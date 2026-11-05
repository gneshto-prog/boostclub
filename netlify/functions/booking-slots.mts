// GET /api/booking/slots -> every free 30-minute consultation slot the page may offer.
// Free = inside Gabi's rules (booking-rules.mts) AND not busy in his Google Calendar AND not a
// CRM consultation AND not a WhatsApp hold. Never today (first day = tomorrow, Bucharest clock).
import { bookingRules, freeSlotsFor, instantAt, offerDates } from "./_shared/booking-rules.mts";
import { calendarBusy } from "./_shared/calendar-bridge.mts";
import { crmBusy } from "./_shared/booking-rpc.mts";
import { allowedOrigin, json } from "./_shared/booking-http.mts";

export default async (req: Request, context: { requestId?: string }) => {
  const requestId = context?.requestId || crypto.randomUUID();
  if (req.method !== "GET") return json({ ok: false, code: "METHOD_NOT_ALLOWED" }, 405);
  if (!allowedOrigin(req)) return json({ ok: false, code: "ORIGIN_NOT_ALLOWED" }, 403);

  try {
    const rules = bookingRules();
    const now = new Date();
    const dates = offerDates(now, rules);
    if (!dates.length) return json({ ok: true, slotMinutes: rules.slotMinutes, days: [] });
    const from = instantAt(dates[0], "00:00").toISOString();
    const last = new Date(`${dates[dates.length - 1]}T12:00:00Z`);
    last.setUTCDate(last.getUTCDate() + 1);
    const to = instantAt(last.toISOString().slice(0, 10), "00:00").toISOString();

    const [calendar, crm] = await Promise.all([calendarBusy(from, to), crmBusy(from, to)]);
    const busy = [...calendar, ...crm.sits, ...crm.holds];
    const days = dates.map((date) => ({
      date,
      slots: freeSlotsFor(date, busy, crm.sits, now, rules)
        .map(({ time, startAt, nextToSit }) => ({ time, startAt, nextToSit })),
    })).filter((d) => d.slots.length);
    return json({ ok: true, slotMinutes: rules.slotMinutes, days });
  } catch (error) {
    console.error(JSON.stringify({ requestId, stage: "slots", error: error instanceof Error ? error.message : String(error) }));
    return json({ ok: false, code: "SLOTS_UNAVAILABLE", requestId }, 503);
  }
};

export const config = { path: "/api/booking/slots" };
