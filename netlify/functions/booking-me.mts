// /api/booking/me: the two personal links.
//   GET  ?i=<invite>   personal booking link Gabriel sent on WhatsApp -> first name (+ an open booking, if any)
//   GET  ?m=<manage>   "change or cancel" link from the confirmation -> their booking
//   POST {m, action: "move", startAt}  they move their own visit (live re-check, CRM, calendar, Telegram)
//   POST {m, action: "cancel"}         they cancel (CRM keeps a "rebook them" task, calendar event removed)
// Links carry only random tokens; the database stores their sha256.
import { bookingRules, findFreeSlot, instantAt, localDate } from "./_shared/booking-rules.mts";
import { calendarBusy, cancelCalendarEvent, createCalendarEvent, eventIdFor, moveCalendarEvent } from "./_shared/calendar-bridge.mts";
import { cancelMyBooking, crmBusy, getInvite, getMyBooking, markCalendar, moveMyBooking } from "./_shared/booking-rpc.mts";
import {
  ADDRESS, LINK_TOKEN, MAPS, allowedOrigin, dayLabel, json, shortLabel, telegram, timeLabel, type JsonRecord,
} from "./_shared/booking-http.mts";

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const fail = (requestId: string, stage: string, error: unknown) => {
  console.error(JSON.stringify({ requestId, stage, error: error instanceof Error ? error.message : String(error) }));
  return json({ ok: false, code: "BOOKING_UNAVAILABLE", requestId }, 503);
};

export default async (req: Request, context: { requestId?: string }) => {
  const requestId = context?.requestId || crypto.randomUUID();
  if (!allowedOrigin(req)) return json({ ok: false, code: "ORIGIN_NOT_ALLOWED" }, 403);

  if (req.method === "GET") {
    const params = new URL(req.url).searchParams;
    const invite = clean(params.get("i"), 64);
    const manage = clean(params.get("m"), 64);
    try {
      if (invite) {
        if (!LINK_TOKEN.test(invite)) return json({ ok: false, code: "INVALID_INVITE" });
        const r = await getInvite(invite);
        if (!r.ok) return json({ ok: false, code: "INVALID_INVITE" });
        return json({
          ok: true, kind: "invite", firstName: r.first_name || "",
          openDay: r.open_at ? dayLabel(r.open_at) : null, openTime: r.open_at ? timeLabel(r.open_at) : null,
        });
      }
      if (manage) {
        if (!LINK_TOKEN.test(manage)) return json({ ok: false, code: "INVALID_LINK" });
        const r = await getMyBooking(manage);
        if (!r.ok || !r.scheduled_at) return json({ ok: false, code: "INVALID_LINK" });
        return json({
          ok: true, kind: "manage", firstName: r.first_name || "", state: r.state, canMove: r.can_move !== false,
          startAt: new Date(r.scheduled_at).toISOString(), day: dayLabel(r.scheduled_at), time: timeLabel(r.scheduled_at),
          minutes: r.minutes || 30, address: ADDRESS, maps: MAPS,
        });
      }
    } catch (error) {
      return fail(requestId, "lookup", error);
    }
    return json({ ok: false, code: "MISSING_LINK" }, 400);
  }

  if (req.method !== "POST") return json({ ok: false, code: "METHOD_NOT_ALLOWED" }, 405);
  let body: JsonRecord;
  try {
    body = await req.json() as JsonRecord;
  } catch {
    return json({ ok: false, code: "BAD_JSON" }, 400);
  }
  const manage = clean(body.m, 64);
  if (!LINK_TOKEN.test(manage)) return json({ ok: false, code: "INVALID_LINK" }, 422);
  const action = clean(body.action, 10);

  if (action === "cancel") {
    let r;
    try {
      r = await cancelMyBooking(manage);
    } catch (error) {
      return fail(requestId, "cancel", error);
    }
    if (!r.ok) return json({ ok: false, code: (r.code || "error").toUpperCase() }, 409);
    let calendarOk = true;
    if (r.calendar_event_id) {
      try {
        await cancelCalendarEvent(r.calendar_event_id);
      } catch (error) {
        calendarOk = false;
        console.error(JSON.stringify({ requestId, stage: "calendar-cancel", error: error instanceof Error ? error.message : String(error) }));
        try { await markCalendar(r.idempotency_key!, null, null, error instanceof Error ? error.message : "cancel failed", "cancel"); } catch { /* logged */ }
      }
    }
    await telegram([
      `${r.full_name} cancelled their visit on the website: ${r.old_at ? shortLabel(r.old_at) : ""}`,
      "The slot is free again. A \"rebook them\" task is in the CRM.",
      calendarOk ? "" : "⚠️ The calendar event is still there: delete it by hand.",
    ]);
    return json({ ok: true, state: "cancelled" });
  }

  if (action === "move") {
    const rules = bookingRules();
    const now = new Date();
    const requested = clean(body.startAt, 40);
    const t = new Date(requested);
    if (Number.isNaN(t.getTime())) return json({ ok: false, code: "INVALID_SLOT" }, 422);
    let slot;
    try {
      const from = instantAt(localDate(t), "00:00").toISOString();
      const to = new Date(Date.parse(from) + 26 * 3600_000).toISOString();
      const [calendar, crm] = await Promise.all([calendarBusy(from, to), crmBusy(from, to)]);
      slot = findFreeSlot(requested, [...calendar, ...crm.sits, ...crm.holds], crm.sits, now, rules);
    } catch (error) {
      return fail(requestId, "recheck", error);
    }
    if (!slot) return json({ ok: false, code: "SLOT_TAKEN" }, 409);

    let r;
    try {
      r = await moveMyBooking(manage, slot.startAt);
    } catch (error) {
      return fail(requestId, "move", error);
    }
    if (!r.ok) return json({ ok: false, code: (r.code || "error").toUpperCase() }, 409);

    let calendarOk = true;
    try {
      const note = `Moved by them on boostclub.ro from ${r.old_at ? shortLabel(r.old_at) : "?"}.`;
      if (r.calendar_event_id) {
        const ev = await moveCalendarEvent(r.calendar_event_id, slot.startAt, slot.endAt, note);
        await markCalendar(r.idempotency_key!, ev.id, ev.url, null, "move");
      } else {
        const ev = await createCalendarEvent({
          id: eventIdFor(r.idempotency_key!), summary: `Consultation with ${r.full_name}`,
          start: slot.startAt, end: slot.endAt, location: ADDRESS,
          description: `Booked on boostclub.ro/book. ${note}\nDirections: ${MAPS}`,
        });
        await markCalendar(r.idempotency_key!, ev.id, ev.url, null, "move");
      }
    } catch (error) {
      calendarOk = false;
      console.error(JSON.stringify({ requestId, stage: "calendar-move", error: error instanceof Error ? error.message : String(error) }));
      try { await markCalendar(r.idempotency_key!, null, null, error instanceof Error ? error.message : "move failed", "move"); } catch { /* logged */ }
    }
    await telegram([
      `${r.full_name} moved their visit on the website:`,
      `${r.old_at ? shortLabel(r.old_at) : "?"} → ${shortLabel(slot.startAt)}`,
      calendarOk ? "Calendar + CRM updated." : "⚠️ CRM updated, calendar NOT: move the event by hand.",
    ]);
    return json({ ok: true, state: "booked", startAt: slot.startAt, endAt: slot.endAt, day: dayLabel(slot.startAt), time: slot.time });
  }

  return json({ ok: false, code: "UNKNOWN_ACTION" }, 422);
};

export const config = { path: "/api/booking/me" };
