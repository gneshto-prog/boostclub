-- Self-serve booking page boostclub.ro/book (Gabi's pick "Own page (B)", 5 Nov 2026; v2 same day).
-- Applied to prod Thu 5 Nov 2026 ~13:15 on Gabi's "Yes, start go-live".
--
-- Adds:
--   public.slot_holds                       times offered to someone on WhatsApp, hidden from the page
--   private.website_bookings                one ledger row per page booking (idempotency, calendar, manage link)
--   private.booking_invites                 personal booking links Kai sends on WhatsApp (?i=<token>)
--   public.make_booking_link                (members) mint a personal link for one CRM person
--   public.get_website_busy_public          CRM sits + active holds for a time range (no names)
--   public.get_booking_invite_public        first name behind a personal link
--   public.book_website_slot_public         person + consultation + note in one call, slot locked
--   public.get_my_booking_public            the booking behind a "change or cancel" link (?m=<token>)
--   public.move_my_booking_public           they move their own visit (cancel + rebook through the app RPCs)
--   public.cancel_my_booking_public         they cancel their own visit
--   public.mark_website_booking_calendar_public   records the Google Calendar result (or its failure)
--
-- Auth: the site has no service key; it sends the publishable key + WEBSITE_INTAKE_TOKEN, checked
-- against private.website_intake_tokens (same as ingest_website_request_public, 12 Oct).
-- Links carry only random tokens (sha256 stored), never a name or phone.
-- Everything is pinned to Gabi's workspace 00000000-0000-0000-0000-000000000001. CRM writes go
-- through book_consultation / record_consultation_outcome, acting as the workspace owner.

-- ------------------------------------------------------------------ holds
create table if not exists public.slot_holds (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  person_id uuid references public.people(id),
  label text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '24 hours',
  released_at timestamptz,
  released_reason text,
  constraint slot_holds_range check (ends_at > starts_at and ends_at - starts_at <= interval '3 hours')
);
create index if not exists slot_holds_active_idx
  on public.slot_holds (workspace_id, starts_at) where released_at is null;

alter table public.slot_holds enable row level security;
drop policy if exists slot_holds_member_select on public.slot_holds;
create policy slot_holds_member_select on public.slot_holds for select to authenticated
  using (public.is_member_of(workspace_id));
drop policy if exists slot_holds_member_insert on public.slot_holds;
create policy slot_holds_member_insert on public.slot_holds for insert to authenticated
  with check (public.is_member_of(workspace_id));
drop policy if exists slot_holds_member_update on public.slot_holds;
create policy slot_holds_member_update on public.slot_holds for update to authenticated
  using (public.is_member_of(workspace_id)) with check (public.is_member_of(workspace_id));
revoke all on public.slot_holds from anon;
grant select, insert, update on public.slot_holds to authenticated;

comment on table public.slot_holds is
  'Times offered to one person on WhatsApp (AS mode). Active = released_at is null and expires_at > now(). '
  'boostclub.ro/book hides active holds. Release with released_at = now() when they say no or book.';

-- ------------------------------------------------------------------ ledger
create table if not exists private.website_bookings (
  idempotency_key uuid primary key,
  person_id uuid not null,
  consultation_id uuid not null,
  scheduled_at timestamptz not null,
  minutes int not null,
  language text not null,
  calendar_event_id text,
  calendar_event_url text,
  calendar_error text,
  origin text not null default 'page' check (origin in ('page', 'invite')),
  status text not null default 'booked' check (status in ('booked', 'moved', 'cancelled')),
  moves int not null default 0,
  manage_sha256 text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
revoke all on private.website_bookings from public, anon, authenticated;

-- ------------------------------------------------------------------ token check
create or replace function private.check_website_intake_token(p_token text)
returns void
language plpgsql
security definer
set search_path to ''
as $$
begin
  if p_token is null or not exists (
    select 1 from private.website_intake_tokens t
    where t.token_sha256 = encode(extensions.digest(p_token, 'sha256'), 'hex')
      and t.revoked_at is null
  ) then
    raise exception 'invalid_intake_token' using errcode = '42501';
  end if;
end;
$$;
revoke all on function private.check_website_intake_token(text) from public, anon, authenticated;

-- ------------------------------------------------------------------ busy (no names)
create or replace function public.get_website_busy_public(p_token text, p_start timestamptz, p_end timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path to ''
as $$
declare
  v_ws constant uuid := '00000000-0000-0000-0000-000000000001';
begin
  perform private.check_website_intake_token(p_token);
  if p_start is null or p_end is null or p_end <= p_start or p_end - p_start > interval '32 days' then
    raise exception 'invalid_range';
  end if;
  return jsonb_build_object(
    'sits', coalesce((
      select jsonb_agg(jsonb_build_object('start', c.scheduled_at,
               'end', c.scheduled_at + make_interval(mins => coalesce(b.minutes, 30))) order by c.scheduled_at)
      from public.consultations c
      left join private.website_bookings b on b.consultation_id = c.id
      where c.workspace_id = v_ws
        and c.status in ('scheduled', 'confirmed')
        and c.scheduled_at < p_end
        and c.scheduled_at + interval '45 minutes' > p_start), '[]'::jsonb),
    'holds', coalesce((
      select jsonb_agg(jsonb_build_object('start', h.starts_at, 'end', h.ends_at) order by h.starts_at)
      from public.slot_holds h
      where h.workspace_id = v_ws
        and h.released_at is null and h.expires_at > now()
        and h.starts_at < p_end and h.ends_at > p_start), '[]'::jsonb));
end;
$$;


-- ------------------------------------------------------------------ helpers
create or replace function private.sha(p text) returns text language sql immutable set search_path to ''
as $$ select encode(extensions.digest(p, 'sha256'), 'hex') $$;

create or replace function private.new_link_token() returns text language sql volatile set search_path to ''
as $$ select translate(encode(extensions.gen_random_bytes(18), 'base64'), '+/=', '-_') $$;

-- act as the Boost Club owner for the app RPCs (auth.uid()), transaction-local
create or replace function private.act_as_owner() returns uuid language plpgsql security definer set search_path to ''
as $$
declare v_owner uuid;
begin
  select wm.user_id into v_owner from public.workspace_members wm
  where wm.workspace_id = '00000000-0000-0000-0000-000000000001' and wm.role = 'owner' and wm.status = 'active'
  order by wm.created_at limit 1;
  if v_owner is null then raise exception 'boost_club_owner_not_found'; end if;
  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_owner, 'role', 'authenticated')::text, true);
  perform set_config('request.jwt.claim.sub', v_owner::text, true);
  return v_owner;
end $$;

create or replace function private.stop_acting() returns void language sql set search_path to ''
as $$ select set_config('request.jwt.claims', '', true); select set_config('request.jwt.claim.sub', '', true); $$;

revoke all on function private.sha(text), private.new_link_token(), private.act_as_owner(), private.stop_acting()
  from public, anon, authenticated;

-- is [p_start, p_end) free of open consultations (except p_except) and active holds?
create or replace function private.website_slot_free(p_start timestamptz, p_end timestamptz, p_except uuid)
returns boolean language sql stable set search_path to ''
as $$
  select not exists (
    select 1 from public.consultations c
    left join private.website_bookings b on b.consultation_id = c.id
    where c.workspace_id = '00000000-0000-0000-0000-000000000001'
      and c.status in ('scheduled', 'confirmed')
      and c.id is distinct from p_except
      and c.scheduled_at < p_end
      and c.scheduled_at + make_interval(mins => coalesce(b.minutes, 30)) > p_start
  ) and not exists (
    select 1 from public.slot_holds h
    where h.workspace_id = '00000000-0000-0000-0000-000000000001'
      and h.released_at is null and h.expires_at > now()
      and h.starts_at < p_end and h.ends_at > p_start
  )
$$;
revoke all on function private.website_slot_free(timestamptz, timestamptz, uuid) from public, anon, authenticated;

-- never same day, Bucharest clock
create or replace function private.website_start_ok(p_start timestamptz) returns boolean language sql stable set search_path to ''
as $$ select p_start is not null
     and (p_start at time zone 'Europe/Bucharest')::date > (now() at time zone 'Europe/Bucharest')::date $$;
revoke all on function private.website_start_ok(timestamptz) from public, anon, authenticated;

-- ------------------------------------------------------------------ personal links
create table if not exists private.booking_invites (
  token_sha256 text primary key,
  person_id uuid not null references public.people(id),
  created_by uuid,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz
);
revoke all on private.booking_invites from public, anon, authenticated;

-- Kai/Gabi: select public.make_booking_link('<person id>') -> {"url": "https://boostclub.ro/book?i=..."}
create or replace function public.make_booking_link(p_person uuid, p_days int default 14)
returns jsonb language plpgsql security definer set search_path to ''
as $$
declare v_p public.people%rowtype; v_token text; v_exp timestamptz;
begin
  select * into v_p from public.people where id = p_person;
  if not found or v_p.workspace_id <> '00000000-0000-0000-0000-000000000001'
     or not public.is_member_of(v_p.workspace_id)
     or public.role_in(v_p.workspace_id) not in ('owner', 'partner', 'trainee') then
    raise exception 'person not found';
  end if;
  if v_p.merged_into_id is not null or v_p.erased_at is not null or v_p.blocked_at is not null then
    raise exception 'person cannot be booked (merged, erased or blocked)';
  end if;
  if p_days not between 1 and 60 then raise exception 'invalid_days'; end if;
  v_token := private.new_link_token();
  v_exp := now() + make_interval(days => p_days);
  insert into private.booking_invites (token_sha256, person_id, created_by, expires_at)
  values (private.sha(v_token), p_person, auth.uid(), v_exp);
  return jsonb_build_object('url', 'https://boostclub.ro/'
      || case v_p.language when 'ro' then 'ro/' when 'ru' then 'ru/' else '' end || 'book?i=' || v_token,
    'expires_at', v_exp);
end $$;

create or replace function public.get_booking_invite_public(p_token text, p_invite text)
returns jsonb language plpgsql stable security definer set search_path to ''
as $$
declare v_p public.people%rowtype; v_open timestamptz;
begin
  perform private.check_website_intake_token(p_token);
  select p.* into v_p from private.booking_invites i join public.people p on p.id = i.person_id
  where i.token_sha256 = private.sha(coalesce(p_invite, '')) and i.revoked_at is null and i.expires_at > now()
    and p.merged_into_id is null and p.erased_at is null and p.blocked_at is null
    and p.workspace_id = '00000000-0000-0000-0000-000000000001';
  if not found then return jsonb_build_object('ok', false, 'code', 'invalid_invite'); end if;
  select min(c.scheduled_at) into v_open from public.consultations c
  where c.person_id = v_p.id and c.status in ('scheduled', 'confirmed') and c.scheduled_at > now();
  return jsonb_build_object('ok', true, 'first_name', split_part(btrim(v_p.full_name), ' ', 1),
    'language', v_p.language, 'open_at', v_open);
end $$;

-- ------------------------------------------------------------------ book
create or replace function public.book_website_slot_public(
  p_token text,
  p_idempotency_key uuid,
  p_language text,
  p_full_name text,
  p_phone text,
  p_start timestamptz,
  p_minutes int default 30,
  p_email text default null,
  p_goal text default null,
  p_ready text default null,
  p_page_url text default null,
  p_source text default 'website',
  p_invite text default null
)
returns jsonb language plpgsql security definer set search_path to ''
as $$
declare
  v_ws constant uuid := '00000000-0000-0000-0000-000000000001';
  v_now timestamptz := now();
  v_owner uuid; v_existing private.website_bookings%rowtype; v_lead record; v_person uuid;
  v_invite private.booking_invites%rowtype; v_duplicate boolean := false; v_open timestamptz; v_end timestamptz;
  v_goal_label text; v_goal_cat text; v_ready_label text; v_note text; v_booked jsonb; v_manage text; v_name text;
begin
  perform private.check_website_intake_token(p_token);
  if p_idempotency_key is null then raise exception 'idempotency_key_required'; end if;
  if p_language not in ('ro', 'en', 'ru') then raise exception 'invalid_language'; end if;
  if p_minutes not in (30, 45) then raise exception 'invalid_minutes'; end if;
  if coalesce(p_source, 'website') not in ('website', 'meta_ads') then raise exception 'invalid_source'; end if;
  if p_email is not null and (length(p_email) > 200 or p_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$') then raise exception 'invalid_email'; end if;
  if not private.website_start_ok(p_start) then raise exception 'invalid_start'; end if;

  if p_invite is not null then
    select * into v_invite from private.booking_invites
    where token_sha256 = private.sha(p_invite) and revoked_at is null and expires_at > v_now;
    if not found then return jsonb_build_object('ok', false, 'code', 'invalid_invite'); end if;
  else
    if p_full_name is null or length(btrim(p_full_name)) < 2 or length(btrim(p_full_name)) > 120 then raise exception 'invalid_full_name'; end if;
    if p_phone is null or p_phone !~ '^\+[1-9][0-9]{6,14}$'
       or (p_phone like '+40%' and p_phone !~ '^\+407[2-9][0-9]{7}$') then raise exception 'invalid_phone'; end if;
  end if;
  v_end := p_start + make_interval(mins => p_minutes);

  v_goal_label := case p_goal when 'loss' then 'Lose weight' when 'muscle' then 'Build muscle' when 'energy' then 'More energy' when 'other' then 'Something else' end;
  v_goal_cat := case p_goal when 'loss' then 'slabire' when 'muscle' then 'masa' when 'energy' then 'energie' when 'other' then 'altele' end;
  v_ready_label := case p_ready when 'now' then 'Right away' when 'weeks' then 'In the next few weeks' when 'curious' then 'Just curious for now' end;

  -- replay of the same submission: same answer, nothing written twice (the manage link is not re-sent)
  select * into v_existing from private.website_bookings where idempotency_key = p_idempotency_key;
  if found then
    return jsonb_build_object('ok', true, 'replay', true, 'person_id', v_existing.person_id,
      'consultation_id', v_existing.consultation_id, 'scheduled_at', v_existing.scheduled_at,
      'calendar_event_id', v_existing.calendar_event_id, 'manage', null);
  end if;

  -- one web booking at a time: the overlap check below and the insert cannot interleave
  perform pg_advisory_xact_lock(hashtextextended('bc_website_booking:' || v_ws::text, 0));
  if not private.website_slot_free(p_start, v_end, null) then
    return jsonb_build_object('ok', false, 'code', 'slot_taken');
  end if;

  if p_invite is not null then
    select p.id, p.full_name into v_person, v_name from public.people p
    where p.id = v_invite.person_id and p.workspace_id = v_ws
      and p.merged_into_id is null and p.erased_at is null and p.blocked_at is null;
    if v_person is null then return jsonb_build_object('ok', false, 'code', 'invalid_invite'); end if;
    v_duplicate := true;
  else
    -- S17 guard: a number that belongs to another workspace is never booked or written here
    select * into v_lead from public.lead_owner(p_phone, v_ws);
    if coalesce(v_lead.blocked, false) then return jsonb_build_object('ok', false, 'code', 'blocked'); end if;
    -- find the person by phone (last 9 digits), enrich never duplicate
    select p.id, p.full_name into v_person, v_name from public.people p
    where p.workspace_id = v_ws and p.phone is not null and p.merged_into_id is null and p.erased_at is null
      and public.phone_last9(p.phone) = public.phone_last9(p_phone)
    order by p.created_at limit 1;
    v_duplicate := v_person is not null;
  end if;

  v_owner := private.act_as_owner();

  if v_person is not null then
    select min(c.scheduled_at) into v_open from public.consultations c
    where c.person_id = v_person and c.status in ('scheduled', 'confirmed');
    if v_open is not null then
      perform private.stop_acting();
      return jsonb_build_object('ok', false, 'code', 'already_booked', 'scheduled_at', v_open);
    end if;
    update public.people set language = coalesce(language, p_language), goal_category = coalesce(goal_category, v_goal_cat)
    where id = v_person;
  else
    insert into public.people (workspace_id, full_name, phone, language, source, source_detail,
      original_contact_date, stage, owner_id, created_by, lead_type, goal_category)
    values (v_ws, btrim(p_full_name), p_phone, p_language, coalesce(p_source, 'website'),
      left(concat_ws(' | ', 'form=book', 'lang=' || p_language, 'self-booked on boostclub.ro/book',
        case when p_email is not null then 'email=' || p_email end,
        case when nullif(btrim(coalesce(p_page_url, '')), '') is not null then 'page=' || btrim(p_page_url) end,
        'booking=' || p_idempotency_key::text), 3000),
      (v_now at time zone 'Europe/Bucharest')::date, 'new_lead', v_owner, v_owner, 'client', v_goal_cat)
    returning id, full_name into v_person, v_name;
  end if;

  -- an open "message them and agree a time" task is answered: they booked themselves
  update public.actions a set status = 'skipped', outcome = 'superseded: booked on boostclub.ro/book', done_at = v_now
  where a.person_id = v_person and a.status = 'open' and a.consultation_id is null
    and (a.reason like 'Website request%' or a.reason like 'Partner page lead%' or a.reason like 'GEN21 menu order%');

  v_note := concat_ws(E'\n',
    'Booked themselves on boostclub.ro/book' || case when p_invite is not null then ' from the personal link Gabriel sent' else '' end
      || ' (' || p_language || ', ' || to_char(v_now at time zone 'Europe/Bucharest', 'DD Mon HH24:MI') || '): '
      || to_char(p_start at time zone 'Europe/Bucharest', 'Dy DD Mon HH24:MI') || ', ' || p_minutes || ' min free scan + consultation.',
    case when v_duplicate and p_invite is null then 'Already in the CRM before this booking; the name they typed: ' || btrim(p_full_name) end,
    case when v_goal_label is not null then 'Goal: ' || v_goal_label end,
    case when v_ready_label is not null then 'When they want to start: ' || v_ready_label end,
    case when p_email is not null then 'Email: ' || p_email end,
    case when nullif(btrim(coalesce(p_page_url, '')), '') is not null then 'Page: ' || left(btrim(p_page_url), 400) end);

  -- the one booking path the app uses: stage, cadence (confirm now, evening before, 2 h before)
  v_booked := public.book_consultation(v_person, p_start, v_note);
  perform private.stop_acting();

  v_manage := private.new_link_token();
  insert into private.website_bookings (idempotency_key, person_id, consultation_id, scheduled_at, minutes, language, origin, manage_sha256)
  values (p_idempotency_key, v_person, (v_booked ->> 'consultation_id')::uuid, p_start, p_minutes, p_language,
    case when p_invite is not null then 'invite' else 'page' end, private.sha(v_manage));
  if p_invite is not null then
    update private.booking_invites set used_at = v_now where token_sha256 = v_invite.token_sha256;
  end if;

  return jsonb_build_object('ok', true, 'replay', false, 'person_id', v_person, 'full_name', v_name,
    'consultation_id', v_booked ->> 'consultation_id', 'scheduled_at', p_start,
    'duplicate_person', v_duplicate, 'calendar_event_id', null, 'manage', v_manage);
end $$;

-- ------------------------------------------------------------------ their own booking (?m=<token>)
create or replace function public.get_my_booking_public(p_token text, p_manage text)
returns jsonb language plpgsql stable security definer set search_path to ''
as $$
declare v_b private.website_bookings%rowtype; v_c public.consultations%rowtype; v_name text;
begin
  perform private.check_website_intake_token(p_token);
  select * into v_b from private.website_bookings where manage_sha256 = private.sha(coalesce(p_manage, ''));
  if not found then return jsonb_build_object('ok', false, 'code', 'invalid_link'); end if;
  select * into v_c from public.consultations where id = v_b.consultation_id;
  select split_part(btrim(full_name), ' ', 1) into v_name from public.people where id = v_b.person_id;
  return jsonb_build_object('ok', true, 'first_name', v_name, 'scheduled_at', v_c.scheduled_at, 'minutes', v_b.minutes,
    'language', v_b.language,
    'state', case when v_c.status in ('scheduled', 'confirmed') and v_c.scheduled_at > now() then 'booked'
                  when v_c.status = 'cancelled' then 'cancelled' else 'past' end,
    'can_move', v_b.moves < 3);
end $$;

create or replace function public.move_my_booking_public(p_token text, p_manage text, p_start timestamptz)
returns jsonb language plpgsql security definer set search_path to ''
as $$
declare
  v_b private.website_bookings%rowtype; v_c public.consultations%rowtype; v_new jsonb; v_end timestamptz; v_name text;
begin
  perform private.check_website_intake_token(p_token);
  if not private.website_start_ok(p_start) then raise exception 'invalid_start'; end if;
  perform pg_advisory_xact_lock(hashtextextended('bc_website_booking:00000000-0000-0000-0000-000000000001', 0));
  select * into v_b from private.website_bookings where manage_sha256 = private.sha(coalesce(p_manage, '')) for update;
  if not found then return jsonb_build_object('ok', false, 'code', 'invalid_link'); end if;
  select * into v_c from public.consultations where id = v_b.consultation_id;
  if v_c.status not in ('scheduled', 'confirmed') or v_c.scheduled_at <= now() then
    return jsonb_build_object('ok', false, 'code', 'not_movable');
  end if;
  if v_b.moves >= 3 then return jsonb_build_object('ok', false, 'code', 'too_many_changes'); end if;
  if p_start = v_c.scheduled_at then return jsonb_build_object('ok', false, 'code', 'same_time'); end if;
  v_end := p_start + make_interval(mins => v_b.minutes);
  if not private.website_slot_free(p_start, v_end, v_c.id) then return jsonb_build_object('ok', false, 'code', 'slot_taken'); end if;

  perform private.act_as_owner();
  perform public.record_consultation_outcome(v_c.id, 'cancelled',
    'Moved by them on boostclub.ro to ' || to_char(p_start at time zone 'Europe/Bucharest', 'Dy DD Mon HH24:MI'));
  v_new := public.book_consultation(v_b.person_id, p_start,
    'Moved their visit themselves on boostclub.ro: from ' || to_char(v_c.scheduled_at at time zone 'Europe/Bucharest', 'Dy DD Mon HH24:MI')
    || ' to ' || to_char(p_start at time zone 'Europe/Bucharest', 'Dy DD Mon HH24:MI') || '.');
  perform private.stop_acting();

  update private.website_bookings set consultation_id = (v_new ->> 'consultation_id')::uuid, scheduled_at = p_start,
    status = 'moved', moves = moves + 1, updated_at = now()
  where idempotency_key = v_b.idempotency_key;
  select full_name into v_name from public.people where id = v_b.person_id;
  return jsonb_build_object('ok', true, 'idempotency_key', v_b.idempotency_key, 'full_name', v_name,
    'old_at', v_c.scheduled_at, 'scheduled_at', p_start, 'minutes', v_b.minutes,
    'calendar_event_id', v_b.calendar_event_id);
end $$;

create or replace function public.cancel_my_booking_public(p_token text, p_manage text)
returns jsonb language plpgsql security definer set search_path to ''
as $$
declare v_b private.website_bookings%rowtype; v_c public.consultations%rowtype; v_name text;
begin
  perform private.check_website_intake_token(p_token);
  select * into v_b from private.website_bookings where manage_sha256 = private.sha(coalesce(p_manage, '')) for update;
  if not found then return jsonb_build_object('ok', false, 'code', 'invalid_link'); end if;
  select * into v_c from public.consultations where id = v_b.consultation_id;
  if v_c.status not in ('scheduled', 'confirmed') or v_c.scheduled_at <= now() then
    return jsonb_build_object('ok', false, 'code', 'not_movable');
  end if;
  perform private.act_as_owner();
  -- the app's cancel: stage back, reminders closed, the "re-book them" task created by the cadence
  perform public.record_consultation_outcome(v_c.id, 'cancelled', 'Cancelled by them on boostclub.ro');
  perform private.stop_acting();
  update private.website_bookings set status = 'cancelled', updated_at = now() where idempotency_key = v_b.idempotency_key;
  select full_name into v_name from public.people where id = v_b.person_id;
  return jsonb_build_object('ok', true, 'idempotency_key', v_b.idempotency_key, 'full_name', v_name,
    'old_at', v_c.scheduled_at, 'calendar_event_id', v_b.calendar_event_id);
end $$;

-- ------------------------------------------------------------------ calendar sync
create or replace function public.mark_website_booking_calendar_public(
  p_token text, p_idempotency_key uuid, p_event_id text, p_event_url text, p_error text, p_context text default 'create'
)
returns jsonb language plpgsql security definer set search_path to ''
as $$
declare v_row private.website_bookings%rowtype; v_when text;
begin
  perform private.check_website_intake_token(p_token);
  if p_context not in ('create', 'move', 'cancel') then raise exception 'invalid_context'; end if;
  update private.website_bookings set
    calendar_event_id = coalesce(left(p_event_id, 200), calendar_event_id),
    calendar_event_url = coalesce(left(p_event_url, 500), calendar_event_url),
    calendar_error = case when p_error is null then null else left(p_context || ': ' || p_error, 300) end,
    updated_at = now()
  where idempotency_key = p_idempotency_key
  returning * into v_row;
  if not found then raise exception 'booking_not_found'; end if;
  if p_error is not null then
    v_when := to_char(v_row.scheduled_at at time zone 'Europe/Bucharest', 'Dy DD Mon HH24:MI');
    insert into public.actions (workspace_id, person_id, type, due_at, reason, consultation_id)
    values ('00000000-0000-0000-0000-000000000001', v_row.person_id, 'task', now(),
      case p_context
        when 'create' then 'Website booking: the Google Calendar event did not save. Add "Consultation with ..." at ' || v_when || ' by hand'
        when 'move' then 'Website booking moved to ' || v_when || ': the Google Calendar event did not move. Fix it by hand'
        else 'Website booking cancelled: the Google Calendar event is still there. Delete it by hand' end,
      v_row.consultation_id);
  end if;
  return jsonb_build_object('ok', true);
end $$;

-- ------------------------------------------------------------------ grants
revoke all on function public.get_website_busy_public(text, timestamptz, timestamptz) from public;
revoke all on function public.get_booking_invite_public(text, text) from public;
revoke all on function public.book_website_slot_public(text, uuid, text, text, text, timestamptz, int, text, text, text, text, text, text) from public;
revoke all on function public.get_my_booking_public(text, text) from public;
revoke all on function public.move_my_booking_public(text, text, timestamptz) from public;
revoke all on function public.cancel_my_booking_public(text, text) from public;
revoke all on function public.mark_website_booking_calendar_public(text, uuid, text, text, text, text) from public;
revoke all on function public.make_booking_link(uuid, int) from public, anon;
grant execute on function public.get_website_busy_public(text, timestamptz, timestamptz) to anon, authenticated;
grant execute on function public.get_booking_invite_public(text, text) to anon, authenticated;
grant execute on function public.book_website_slot_public(text, uuid, text, text, text, timestamptz, int, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.get_my_booking_public(text, text) to anon, authenticated;
grant execute on function public.move_my_booking_public(text, text, timestamptz) to anon, authenticated;
grant execute on function public.cancel_my_booking_public(text, text) to anon, authenticated;
grant execute on function public.mark_website_booking_calendar_public(text, uuid, text, text, text, text) to anon, authenticated;
grant execute on function public.make_booking_link(uuid, int) to authenticated;
