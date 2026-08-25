-- Active capacity is enforced by consultations_workspace_open_slot_uq. The
-- private delivery ledger is historical, so it must not reserve a slot after
-- the linked consultation is cancelled or rescheduled.
drop index if exists private.website_lead_ingestions_booking_slot_uq;

create index if not exists website_lead_ingestions_booking_slot_idx
  on private.website_lead_ingestions (booking_slot)
  where lead_type = 'client' and booking_slot is not null;
