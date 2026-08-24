do $migration$
declare
  v_oid oid;
  v_definition text;
  v_old text := $old$
    select c.id, c.scheduled_at into v_consultation, v_calendar_start
    from public.consultations c
    where c.person_id = v_person and c.status in ('scheduled', 'confirmed')
    order by c.scheduled_at
    limit 1;
$old$;
  v_new text := $new$
    select c.id, c.scheduled_at into v_consultation, v_existing.calendar_start_at
    from public.consultations c
    where c.person_id = v_person and c.status in ('scheduled', 'confirmed')
    order by c.scheduled_at
    limit 1;
    if v_consultation is not null then
      v_calendar_start := v_existing.calendar_start_at;
    end if;
$new$;
begin
  select p.oid into v_oid
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'ingest_website_lead'
    and pg_get_function_identity_arguments(p.oid) =
      'p_idempotency_key uuid, p_form_name text, p_language text, p_lead_type text, p_full_name text, p_phone text, p_contact text, p_country text, p_message text, p_landing_page text, p_page_url text, p_attribution jsonb, p_preferred_weekday smallint, p_preferred_start time without time zone, p_preferred_end time without time zone, p_goal_category text';

  if v_oid is null then
    raise exception 'ingest_website_lead function not found';
  end if;

  v_definition := pg_get_functiondef(v_oid);
  if position(v_old in v_definition) = 0 then
    raise exception 'expected website lead scheduling block not found';
  end if;

  execute replace(v_definition, v_old, v_new);
end
$migration$;
