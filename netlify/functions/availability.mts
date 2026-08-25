import {
  BOOKING_SLOT_MINUTES,
  bookingHoursForDate,
  bookingSlotsForDate,
  rangesOverlap,
} from "./_shared/booking.mts";
import { getGoogleCalendarBusy } from "./_shared/google-calendar.mts";
import { supabaseRpc } from "./_shared/supabase.mts";

type JsonRecord = Record<string, unknown>;
type OccupiedSlot = { scheduled_at?: string };

const json = (body: JsonRecord, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const isAllowedOrigin = (req: Request) => {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).hostname;
    const requestHost = new URL(req.url).hostname;
    return originHost === requestHost
      || originHost === "boostclub.ro"
      || originHost === "www.boostclub.ro"
      || originHost.endsWith("--resplendent-starlight-5bdd62.netlify.app");
  } catch {
    return false;
  }
};

export default async (req: Request, context: { requestId?: string }) => {
  const requestId = context.requestId || crypto.randomUUID();
  if (req.method !== "GET") return json({ ok: false, code: "METHOD_NOT_ALLOWED", requestId }, 405);
  if (!isAllowedOrigin(req)) return json({ ok: false, code: "ORIGIN_NOT_ALLOWED", requestId }, 403);

  const date = new URL(req.url).searchParams.get("date") || "";
  let slots;
  let hours;
  try {
    hours = bookingHoursForDate(date);
    slots = bookingSlotsForDate(date);
  } catch {
    return json({ ok: false, code: "INVALID_DATE", requestId }, 422);
  }

  if (!hours || !slots.length) {
    return json({ ok: true, date, hours, slotMinutes: BOOKING_SLOT_MINUTES, slots: [] });
  }

  try {
    const timeMin = slots[0].startAt;
    const timeMax = slots[slots.length - 1].endAt;
    const [calendarBusy, occupiedRaw] = await Promise.all([
      getGoogleCalendarBusy(timeMin, timeMax),
      supabaseRpc("get_website_booking_occupancy", {
        p_start: timeMin,
        p_end: timeMax,
      }),
    ]);
    const occupied = Array.isArray(occupiedRaw) ? occupiedRaw as OccupiedSlot[] : [];
    const unavailable = [
      ...calendarBusy,
      ...occupied
        .filter((item) => typeof item.scheduled_at === "string")
        .map((item) => ({
          start: item.scheduled_at as string,
          end: new Date(new Date(item.scheduled_at as string).getTime() + BOOKING_SLOT_MINUTES * 60_000).toISOString(),
        })),
    ];
    const available = slots.filter((slot) =>
      !unavailable.some((busy) => rangesOverlap(slot.startAt, slot.endAt, busy.start, busy.end))
    );
    return json({
      ok: true,
      date,
      hours,
      slotMinutes: BOOKING_SLOT_MINUTES,
      slots: available,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Availability failed";
    console.error(JSON.stringify({ requestId, stage: "availability", error: message }));
    return json({ ok: false, code: "AVAILABILITY_UNAVAILABLE", requestId }, 503);
  }
};

export const config = {
  path: "/api/availability",
};
