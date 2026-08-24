create schema if not exists private;

create table private.website_lead_ingestions (
  idempotency_key uuid primary key,
  payload_fingerprint text not null,
  form_name text not null,
  language text not null check (language in ('ro', 'en', 'ru')),
  lead_type text not null check (lead_type in ('client', 'business')),
  person_id uuid references public.people(id),
  consultation_id uuid references public.consultations(id),
  action_id uuid references public.actions(id),
  calendar_start_at timestamptz not null,
  calendar_end_at timestamptz not null,
  calendar_event_id text,
  calendar_event_url text,
  calendar_synced_at timestamptz,
  calendar_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

comment on table private.website_lead_ingestions is
  'Private idempotency and delivery ledger for website lead ingestion.';

alter table private.website_lead_ingestions enable row level security;
revoke all on table private.website_lead_ingestions from public, anon, authenticated;
grant usage on schema private to service_role;
grant select, insert, update on table private.website_lead_ingestions to service_role;

create or replace function public.ingest_website_lead(
  p_idempotency_key uuid,
  p_form_name text,
  p_language text,
  p_lead_type text,
  p_full_name text,
  p_phone text default null,
  p_contact text default null,
  p_country text default null,
  p_message text default null,
  p_landing_page text default null,
  p_page_url text default null,
  p_attribution jsonb default '{}'::jsonb,
  p_preferred_weekday smallint default null,
  p_preferred_start time default null,
  p_preferred_end time default null,
  p_goal_category text default null
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_workspace uuid;
  v_owner uuid;
  v_fingerprint text;
  v_existing private.website_lead_ingestions%rowtype;
  v_inserted integer;
  v_person uuid;
  v_consultation uuid;
  v_action uuid;
  v_duplicate_person boolean := false;
  v_previous_stage text;
  v_now timestamptz := now();
  v_local_now timestamp;
  v_candidate_date date;
  v_local_candidate timestamp;
  v_calendar_start timestamptz;
  v_calendar_end timestamptz;
  v_source_detail text;
begin
  if p_idempotency_key is null then
    raise exception 'idempotency_key_required';
  end if;
  if p_language not in ('ro', 'en', 'ru') then
    raise exception 'invalid_language';
  end if;
  if p_lead_type not in ('client', 'business') then
    raise exception 'invalid_lead_type';
  end if;
  if p_form_name not in ('consultatie', 'consultatie-en', 'consultatie-ru', 'partner-lead') then
    raise exception 'invalid_form_name';
  end if;
  if (p_form_name = 'consultatie' and p_language <> 'ro')
     or (p_form_name = 'consultatie-en' and p_language <> 'en')
     or (p_form_name = 'consultatie-ru' and p_language <> 'ru')
     or (p_form_name like 'consultatie%' and p_lead_type <> 'client')
     or (p_form_name = 'partner-lead' and p_lead_type <> 'business') then
    raise exception 'form_language_or_type_mismatch';
  end if;
  if p_full_name is null or length(btrim(p_full_name)) < 2 or length(btrim(p_full_name)) > 120 then
    raise exception 'invalid_full_name';
  end if;
  if p_phone is not null and p_phone !~ '^\+[1-9][0-9]{6,14}$' then
    raise exception 'invalid_phone';
  end if;
  if p_lead_type = 'client' and p_phone is null then
    raise exception 'client_phone_required';
  end if;
  if p_lead_type = 'business'
     and length(btrim(coalesce(p_contact, p_phone, ''))) < 3 then
    raise exception 'business_contact_required';
  end if;
  if p_goal_category is not null
     and p_goal_category not in ('slabire', 'energie', 'masa', 'tonus', 'altele') then
    raise exception 'invalid_goal_category';
  end if;

  select w.id into v_workspace
  from public.workspaces w
  where w.name = 'Boost Club Bucharest' and w.status = 'active'
  order by w.created_at
  limit 1;
  if v_workspace is null then
    raise exception 'boost_club_workspace_not_found';
  end if;

  select wm.user_id into v_owner
  from public.workspace_members wm
  where wm.workspace_id = v_workspace
    and wm.role = 'owner'
    and wm.status = 'active'
  order by wm.created_at
  limit 1;
  if v_owner is null then
    raise exception 'boost_club_owner_not_found';
  end if;

  v_fingerprint := md5(jsonb_build_object(
    'form_name', p_form_name,
    'language', p_language,
    'lead_type', p_lead_type,
    'full_name', btrim(p_full_name),
    'phone', p_phone,
    'contact', nullif(btrim(coalesce(p_contact, '')), ''),
    'country', nullif(btrim(coalesce(p_country, '')), ''),
    'message', nullif(btrim(coalesce(p_message, '')), ''),
    'landing_page', p_landing_page,
    'page_url', p_page_url,
    'attribution', coalesce(p_attribution, '{}'::jsonb),
    'preferred_weekday', p_preferred_weekday,
    'preferred_start', p_preferred_start,
    'preferred_end', p_preferred_end,
    'goal_category', p_goal_category
  )::text);

  select * into v_existing
  from private.website_lead_ingestions
  where idempotency_key = p_idempotency_key;
  if found then
    if v_existing.payload_fingerprint <> v_fingerprint then
      raise exception 'idempotency_key_payload_mismatch';
    end if;
    return jsonb_build_object(
      'idempotent_replay', true,
      'person_id', v_existing.person_id,
      'consultation_id', v_existing.consultation_id,
      'action_id', v_existing.action_id,
      'calendar_start_at', v_existing.calendar_start_at,
      'calendar_end_at', v_existing.calendar_end_at,
      'calendar_event_id', v_existing.calendar_event_id,
      'calendar_event_url', v_existing.calendar_event_url,
      'calendar_synced_at', v_existing.calendar_synced_at
    );
  end if;

  if p_lead_type = 'client' then
    if p_preferred_weekday not in (1, 2, 3, 4, 5, 7)
       or p_preferred_start is null then
      raise exception 'client_preferred_window_required';
    end if;
    v_local_now := v_now at time zone 'Europe/Bucharest';
    v_candidate_date := v_local_now::date
      + ((p_preferred_weekday - extract(isodow from v_local_now)::integer + 7) % 7);
    v_local_candidate := v_candidate_date + p_preferred_start;
    if v_local_candidate <= v_local_now + interval '30 minutes' then
      v_local_candidate := v_local_candidate + interval '7 days';
    end if;
    v_calendar_start := v_local_candidate at time zone 'Europe/Bucharest';
    v_calendar_end := v_calendar_start + interval '40 minutes';
  else
    v_calendar_start := date_trunc('minute', v_now) + interval '15 minutes';
    v_calendar_end := v_calendar_start + interval '30 minutes';
  end if;

  insert into private.website_lead_ingestions (
    idempotency_key, payload_fingerprint, form_name, language, lead_type,
    calendar_start_at, calendar_end_at
  ) values (
    p_idempotency_key, v_fingerprint, p_form_name, p_language, p_lead_type,
    v_calendar_start, v_calendar_end
  ) on conflict do nothing;
  get diagnostics v_inserted = row_count;

  if v_inserted = 0 then
    select * into v_existing
    from private.website_lead_ingestions
    where idempotency_key = p_idempotency_key;
    if v_existing.payload_fingerprint <> v_fingerprint then
      raise exception 'idempotency_key_payload_mismatch';
    end if;
    return jsonb_build_object(
      'idempotent_replay', true,
      'person_id', v_existing.person_id,
      'consultation_id', v_existing.consultation_id,
      'action_id', v_existing.action_id,
      'calendar_start_at', v_existing.calendar_start_at,
      'calendar_end_at', v_existing.calendar_end_at,
      'calendar_event_id', v_existing.calendar_event_id,
      'calendar_event_url', v_existing.calendar_event_url,
      'calendar_synced_at', v_existing.calendar_synced_at
    );
  end if;

  v_source_detail := left(concat_ws(' | ',
    'form=' || p_form_name,
    'lang=' || p_language,
    'landing=' || coalesce(nullif(btrim(p_landing_page), ''), 'unknown'),
    case when nullif(btrim(coalesce(p_page_url, '')), '') is not null
      then 'page=' || btrim(p_page_url) end,
    case when nullif(btrim(coalesce(p_contact, '')), '') is not null
      then 'contact=' || btrim(p_contact) end,
    case when nullif(btrim(coalesce(p_country, '')), '') is not null
      then 'country=' || btrim(p_country) end,
    case when coalesce(p_attribution, '{}'::jsonb) <> '{}'::jsonb
      then 'attribution=' || p_attribution::text end
  ), 3000);

  if p_phone is not null then
    select p.id into v_person
    from public.people p
    where p.workspace_id = v_workspace
      and p.phone = p_phone
      and p.merged_into_id is null
      and p.erased_at is null
    order by p.created_at
    limit 1;
    v_duplicate_person := v_person is not null;
  end if;

  if v_person is null then
    insert into public.people (
      workspace_id, full_name, phone, language, source, source_detail,
      original_contact_date, stage, goal_category, owner_id, created_by,
      lead_type, partner_potential
    ) values (
      v_workspace, btrim(p_full_name), p_phone, p_language, 'website',
      v_source_detail, (v_now at time zone 'Europe/Bucharest')::date,
      case when p_lead_type = 'client' then 'booked' else 'new_lead' end,
      p_goal_category, v_owner, v_owner, p_lead_type,
      p_lead_type = 'business'
    ) returning id into v_person;
  end if;

  if p_lead_type = 'client' then
    select c.id, c.scheduled_at into v_consultation, v_calendar_start
    from public.consultations c
    where c.person_id = v_person and c.status in ('scheduled', 'confirmed')
    order by c.scheduled_at
    limit 1;

    if v_consultation is null then
      select p.stage into v_previous_stage from public.people p where p.id = v_person;
      if v_previous_stage in ('new_lead', 'contacted', 'interested') then
        update public.people set stage = 'booked', updated_at = v_now where id = v_person;
      else
        v_previous_stage := null;
      end if;

      insert into public.consultations (
        workspace_id, person_id, scheduled_at, status, previous_stage, created_by
      ) values (
        v_workspace, v_person, v_calendar_start, 'scheduled', v_previous_stage, v_owner
      ) returning id into v_consultation;
    end if;
    v_calendar_end := v_calendar_start + interval '40 minutes';
  end if;

  insert into public.actions (
    workspace_id, person_id, type, due_at, reason, consultation_id, created_by
  ) values (
    v_workspace,
    v_person,
    'task',
    v_now,
    case when p_lead_type = 'client'
      then 'Website booking request — contact now and confirm the requested scan window'
      else 'Website business lead — contact now and arrange the first conversation'
    end || ' (' || p_form_name || ', ' || p_language || ')',
    v_consultation,
    v_owner
  ) returning id into v_action;

  if nullif(btrim(coalesce(p_message, '')), '') is not null then
    insert into public.notes (workspace_id, person_id, body, created_by)
    values (
      v_workspace,
      v_person,
      left('Website lead message: ' || btrim(p_message), 5000),
      v_owner
    );
  end if;

  update private.website_lead_ingestions
  set person_id = v_person,
      consultation_id = v_consultation,
      action_id = v_action,
      calendar_start_at = v_calendar_start,
      calendar_end_at = v_calendar_end,
      updated_at = v_now
  where idempotency_key = p_idempotency_key;

  return jsonb_build_object(
    'idempotent_replay', false,
    'duplicate_person', v_duplicate_person,
    'person_id', v_person,
    'consultation_id', v_consultation,
    'action_id', v_action,
    'calendar_start_at', v_calendar_start,
    'calendar_end_at', v_calendar_end,
    'calendar_event_id', null,
    'calendar_event_url', null,
    'calendar_synced_at', null
  );
end;
$$;

revoke all on function public.ingest_website_lead(
  uuid, text, text, text, text, text, text, text, text, text, text, jsonb,
  smallint, time, time, text
) from public, anon, authenticated;
grant execute on function public.ingest_website_lead(
  uuid, text, text, text, text, text, text, text, text, text, text, jsonb,
  smallint, time, time, text
) to service_role;

create or replace function public.mark_website_lead_calendar(
  p_idempotency_key uuid,
  p_event_id text default null,
  p_event_url text default null,
  p_error text default null
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_row private.website_lead_ingestions%rowtype;
begin
  if p_idempotency_key is null then
    raise exception 'idempotency_key_required';
  end if;
  if p_event_id is null and nullif(btrim(coalesce(p_error, '')), '') is null then
    raise exception 'calendar_result_required';
  end if;

  update private.website_lead_ingestions
  set calendar_event_id = coalesce(nullif(btrim(p_event_id), ''), calendar_event_id),
      calendar_event_url = coalesce(nullif(btrim(p_event_url), ''), calendar_event_url),
      calendar_synced_at = case when nullif(btrim(coalesce(p_event_id, '')), '') is not null
        then now() else calendar_synced_at end,
      calendar_error = case when nullif(btrim(coalesce(p_event_id, '')), '') is not null
        then null else left(btrim(p_error), 2000) end,
      updated_at = now()
  where idempotency_key = p_idempotency_key
  returning * into v_row;

  if not found then
    raise exception 'website_lead_ingestion_not_found';
  end if;

  return jsonb_build_object(
    'idempotency_key', v_row.idempotency_key,
    'calendar_event_id', v_row.calendar_event_id,
    'calendar_event_url', v_row.calendar_event_url,
    'calendar_synced_at', v_row.calendar_synced_at,
    'calendar_error', v_row.calendar_error
  );
end;
$$;

revoke all on function public.mark_website_lead_calendar(uuid, text, text, text)
  from public, anon, authenticated;
grant execute on function public.mark_website_lead_calendar(uuid, text, text, text)
  to service_role;
