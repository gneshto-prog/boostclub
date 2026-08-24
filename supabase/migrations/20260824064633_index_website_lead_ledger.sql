create index website_lead_ingestions_person_id_idx
  on private.website_lead_ingestions (person_id)
  where person_id is not null;

create index website_lead_ingestions_consultation_id_idx
  on private.website_lead_ingestions (consultation_id)
  where consultation_id is not null;

create index website_lead_ingestions_action_id_idx
  on private.website_lead_ingestions (action_id)
  where action_id is not null;
