-- Partner landing pages boostclub.ro/<slug> (15 Oct 2026). Form "partner-page" posts first name +
-- phone before WhatsApp opens with the partner; submission-created passes the partner slug inside
-- p_page_url as "partner=<slug>". Same person/note/action flow as every website request, with a
-- note and action that name the partner (the client belongs to the partner who brought them).
-- Applied to boostclub-crm-prod via the Supabase MCP on 15 Oct 2026; this file is the repo mirror.
create or replace function public.ingest_website_request(p_idempotency_key uuid, p_form_name text, p_language text, p_lead_type text, p_full_name text, p_phone text default null::text, p_contact text default null::text, p_when text default null::text, p_goal text default null::text, p_country text default null::text, p_page_url text default null::text, p_source text default 'website'::text)
 returns jsonb
 language plpgsql
 set search_path to ''
as $function$
declare
  v_workspace uuid := '00000000-0000-0000-0000-000000000001';
  v_owner uuid;
  v_now timestamptz := now();
  v_fingerprint text;
  v_existing private.website_lead_ingestions%rowtype;
  v_lead_owner record;
  v_blocked boolean := false;
  v_person uuid;
  v_duplicate_person boolean := false;
  v_action uuid;
  v_existing_action uuid;
  v_note text;
  v_reason text;
  v_partner text;
begin
  if p_idempotency_key is null then raise exception 'idempotency_key_required'; end if;
  if p_language not in ('ro', 'en', 'ru') then raise exception 'invalid_language'; end if;
  if p_lead_type not in ('client', 'business') then raise exception 'invalid_lead_type'; end if;
  if p_form_name not in ('consultatie', 'consultatie-en', 'consultatie-ru', 'partner-lead', 'ambasador', 'menu-gen21', 'partner-page') then
    raise exception 'invalid_form_name';
  end if;
  if p_full_name is null or length(btrim(p_full_name)) < 1 or length(btrim(p_full_name)) > 120 then
    raise exception 'invalid_full_name';
  end if;
  if p_phone is not null and p_phone !~ '^\+[1-9][0-9]{6,14}$' then
    raise exception 'invalid_phone';
  end if;
  if coalesce(p_source, 'website') not in ('website', 'meta_ads', 'instagram', 'facebook', 'tiktok') then
    raise exception 'invalid_source';
  end if;
  if p_phone is null and length(btrim(coalesce(p_contact, ''))) < 3 then
    raise exception 'contact_required';
  end if;

  v_partner := case when p_form_name = 'partner-page'
    then coalesce(substring(coalesce(p_page_url, '') from 'partner=([a-z0-9-]{1,40})'), 'unknown') end;

  select wm.user_id into v_owner
  from public.workspace_members wm
  where wm.workspace_id = v_workspace and wm.role = 'owner' and wm.status = 'active'
  order by wm.created_at limit 1;
  if v_owner is null then raise exception 'boost_club_owner_not_found'; end if;

  v_fingerprint := md5(jsonb_build_object(
    'form', p_form_name, 'lang', p_language, 'type', p_lead_type,
    'name', btrim(p_full_name), 'phone', p_phone, 'contact', p_contact,
    'when', p_when, 'goal', p_goal, 'country', p_country, 'source', p_source
  )::text);

  select * into v_existing from private.website_lead_ingestions
  where idempotency_key = p_idempotency_key;
  if found then
    return jsonb_build_object('idempotent_replay', true,
      'person_id', v_existing.person_id, 'action_id', v_existing.action_id);
  end if;

  if p_phone is not null then
    select * into v_lead_owner from public.lead_owner(p_phone, v_workspace);
    v_blocked := coalesce(v_lead_owner.blocked, false);
  end if;

  insert into private.website_lead_ingestions (
    idempotency_key, payload_fingerprint, form_name, language, lead_type,
    calendar_start_at, calendar_end_at, booking_slot, calendar_error
  ) values (
    p_idempotency_key, v_fingerprint, p_form_name, p_language, p_lead_type,
    v_now, v_now, null, 'request form: no slot, no calendar event by design'
  ) on conflict (idempotency_key) do nothing;
  if not found then
    select * into v_existing from private.website_lead_ingestions
    where idempotency_key = p_idempotency_key;
    return jsonb_build_object('idempotent_replay', true,
      'person_id', v_existing.person_id, 'action_id', v_existing.action_id);
  end if;

  if p_phone is not null then
    select p.id into v_person from public.people p
    where p.workspace_id = v_workspace and p.phone = p_phone
      and p.merged_into_id is null and p.erased_at is null
    order by p.created_at limit 1;
    v_duplicate_person := v_person is not null;
  end if;

  if v_person is null then
    insert into public.people (
      workspace_id, full_name, phone, language, source, source_detail,
      original_contact_date, stage, owner_id, created_by, lead_type, partner_potential,
      foreign_owner_workspace_id, blocked_at, blocked_reason
    ) values (
      v_workspace, btrim(p_full_name), p_phone, p_language, coalesce(p_source, 'website'),
      left(concat_ws(' | ', 'form=' || p_form_name, 'lang=' || p_language,
        case when v_partner is not null then 'partner page via ' || v_partner else 'request (no slot)' end,
        case when nullif(btrim(coalesce(p_contact, '')), '') is not null then 'contact=' || btrim(p_contact) end,
        case when nullif(btrim(coalesce(p_country, '')), '') is not null then 'country=' || btrim(p_country) end,
        case when nullif(btrim(coalesce(p_page_url, '')), '') is not null then 'page=' || btrim(p_page_url) end,
        'netlify=' || p_idempotency_key::text), 3000),
      (v_now at time zone 'Europe/Bucharest')::date, 'new_lead', v_owner, v_owner,
      p_lead_type, p_lead_type = 'business',
      case when v_blocked then v_lead_owner.owner_workspace_id end,
      case when v_blocked then v_now end,
      case when v_blocked then 'cross_workspace_duplicate: owned by '
        || coalesce(v_lead_owner.owner_workspace_name, v_lead_owner.owner_workspace_id::text)
        || ' since ' || v_lead_owner.owner_since::text end
    ) returning id into v_person;
  end if;

  v_note := concat_ws(E'\n',
    case when p_form_name = 'menu-gen21' then 'GEN21 menu order ('
         when p_form_name = 'partner-page' then 'Partner page lead via ' || v_partner || ' (boostclub.ro/' || v_partner || ', '
         else 'Website request (' || p_form_name || ', ' end || p_language || ', '
      || to_char(v_now at time zone 'Europe/Bucharest', 'DD Mon HH24:MI') || ')',
    case when p_form_name = 'partner-page' then 'They tapped WhatsApp on the partner page; the chat opened with the partner, not with Boost Club. The client belongs to the partner.' end,
    case when nullif(btrim(coalesce(p_when, '')), '') is not null then 'When suits them: ' || btrim(p_when) end,
    case when nullif(btrim(coalesce(p_goal, '')), '') is not null then case when p_form_name = 'menu-gen21' then 'Order: ' else 'Goal: ' end || btrim(p_goal) end,
    case when nullif(btrim(coalesce(p_contact, '')), '') is not null then 'Contact: ' || btrim(p_contact) end,
    case when nullif(btrim(coalesce(p_country, '')), '') is not null then 'Country: ' || btrim(p_country) end);
  insert into public.notes (workspace_id, person_id, body, created_by)
  values (v_workspace, v_person, left(v_note, 5000), v_owner);

  if not v_blocked then
    select a.id into v_existing_action from public.actions a
    where a.person_id = v_person and a.status = 'open'
      and (a.reason like 'Website request%' or a.reason like 'GEN21 menu order%' or a.reason like 'Partner page lead%')
    order by a.created_at desc limit 1;

    v_reason := case when p_form_name = 'menu-gen21'
      then 'GEN21 menu order: message them on WhatsApp, thank them for the order and invite them to the free body scan'
      when p_form_name = 'partner-page'
      then 'Partner page lead via ' || v_partner || ': they opened WhatsApp with the partner. Check ' || v_partner || ' replied today and gets them booked for the free body scan'
      when p_lead_type = 'client'
      then 'Website request: message them on WhatsApp now and agree a consultation time'
      else 'Website business request: contact them now and arrange the first conversation'
    end
    || case when nullif(btrim(coalesce(p_when, '')), '') is not null
         then ' (they said: ' || left(btrim(p_when), 120) || ')' else '' end
    || ' [' || p_form_name || ']';

    if v_existing_action is null then
      insert into public.actions (workspace_id, person_id, type, due_at, reason, created_by)
      values (v_workspace, v_person, 'task', v_now, v_reason, v_owner)
      returning id into v_action;
    else
      v_action := v_existing_action;
    end if;
  end if;

  update private.website_lead_ingestions
  set person_id = v_person, action_id = v_action, updated_at = v_now
  where idempotency_key = p_idempotency_key;

  return jsonb_build_object(
    'idempotent_replay', false, 'blocked', v_blocked,
    'duplicate_person', v_duplicate_person,
    'person_id', v_person, 'action_id', v_action,
    'action_reused', v_existing_action is not null);
end;
$function$;
