// POST /api/booking/book -> books one free scan + consultation from boostclub.ro/book.
// Order: re-check the slot live (calendar + CRM + holds) -> CRM booking in ONE database call
// (person, consultation, stage, note, confirm action; the slot is locked there so two people can
// never take the same time) -> Google Calendar event -> Telegram ping to Gabi.
// If the calendar write fails the booking still stands (the CRM holds the slot) and the Telegram
// ping says the event is missing.
import { bookingRules, findFreeSlot, instantAt, localDate } from "./_shared/booking-rules.mts";
import { calendarBusy, createCalendarEvent, eventIdFor } from "./_shared/calendar-bridge.mts";
import { BookingRpcError, bookSlot, crmBusy, markCalendar } from "./_shared/booking-rpc.mts";
import {
  ADDRESS, LINK_TOKEN, MAPS, allowedOrigin, dayLabel, json, manageUrl, telegram, timeLabel, type JsonRecord,
} from "./_shared/booking-http.mts";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

// Goal chips and the readiness question (soft money qualifier, wording pending Gabi's OK).
const GOALS: Record<string, string> = {
  loss: "Lose weight", muscle: "Build muscle", energy: "More energy", other: "Something else",
};
const READY: Record<string, string> = {
  now: "Right away", weeks: "In the next few weeks", curious: "Just curious for now",
};

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export const normalizePhone = (value: unknown) => {
  let digits = clean(value, 40).replace(/[^0-9+]/g, "");
  if (!digits) return null;
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (digits.startsWith("0")) digits = `+40${digits.slice(1)}`;
  if (!digits.startsWith("+") && digits.startsWith("40")) digits = `+${digits}`;
  if (!/^\+[1-9][0-9]{6,14}$/.test(digits)) return null;
  // Romanian mobiles are +407[2-9] + 7 digits; anything else under +40 is a typo.
  if (digits.startsWith("+40") && !/^\+407[2-9][0-9]{7}$/.test(digits)) return null;
  return digits;
};

const sourceFor = (page: string) => {
  try {
    const p = new URL(page).searchParams;
    const src = (p.get("utm_source") || "").toLowerCase();
    const med = (p.get("utm_medium") || "").toLowerCase();
    return /^(facebook|instagram|meta|fb|ig)$/.test(src) && /^(paid|cpc|ads|paid_?social|paidsocial)$/.test(med)
      ? "meta_ads" : "website";
  } catch {
    return "website";
  }
};

export default async (req: Request, context: { requestId?: string }) => {
  const requestId = context?.requestId || crypto.randomUUID();
  if (req.method !== "POST") return json({ ok: false, code: "METHOD_NOT_ALLOWED" }, 405);
  if (!allowedOrigin(req)) return json({ ok: false, code: "ORIGIN_NOT_ALLOWED" }, 403);

  let body: JsonRecord;
  try {
    body = await req.json() as JsonRecord;
  } catch {
    return json({ ok: false, code: "BAD_JSON" }, 400);
  }
  if (clean(body.website, 200)) return json({ ok: true, honeypot: true }); // bots fill the hidden field

  const key = clean(body.key, 36).toLowerCase();
  const name = clean(body.name, 120).replace(/\s+/g, " ");
  const phone = normalizePhone(body.phone);
  const emailRaw = clean(body.email, 200);
  const email = emailRaw && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw) ? emailRaw : null;
  const goal = GOALS[clean(body.goal, 20)] || null;
  const ready = READY[clean(body.ready, 20)] || null;
  const lang = ["en", "ro", "ru"].includes(clean(body.lang, 4)) ? clean(body.lang, 4) : "en";
  const page = clean(body.page, 400);
  const heard = clean(body.heard, 20);
  // personal link from Gabriel's WhatsApp: the person is already in the CRM, no name/phone needed
  const invite = LINK_TOKEN.test(clean(body.invite, 64)) ? clean(body.invite, 64) : null;

  if (!UUID.test(key)) return json({ ok: false, code: "INVALID_KEY" }, 422);
  if (!invite && name.length < 2) return json({ ok: false, code: "INVALID_NAME" }, 422);
  if (!invite && !phone) return json({ ok: false, code: "INVALID_PHONE" }, 422);
  if (emailRaw && !email) return json({ ok: false, code: "INVALID_EMAIL" }, 422);

  const rules = bookingRules();
  const now = new Date();
  const requested = clean(body.startAt, 40);
  const t = new Date(requested);
  if (Number.isNaN(t.getTime())) return json({ ok: false, code: "INVALID_SLOT" }, 422);

  // Live re-check of the exact slot: calendar + CRM sits + WhatsApp holds.
  let slot;
  try {
    const date = localDate(t);
    const from = instantAt(date, "00:00").toISOString();
    const to = new Date(Date.parse(from) + 26 * 3600_000).toISOString();
    const [calendar, crm] = await Promise.all([calendarBusy(from, to), crmBusy(from, to)]);
    slot = findFreeSlot(requested, [...calendar, ...crm.sits, ...crm.holds], crm.sits, now, rules);
  } catch (error) {
    console.error(JSON.stringify({ requestId, stage: "recheck", error: error instanceof Error ? error.message : String(error) }));
    return json({ ok: false, code: "BOOKING_UNAVAILABLE", requestId }, 503);
  }
  if (!slot) return json({ ok: false, code: "SLOT_TAKEN" }, 409);

  let crm;
  try {
    crm = await bookSlot({
      p_idempotency_key: key,
      p_language: lang,
      p_full_name: invite ? null : name,
      p_phone: invite ? null : phone,
      p_email: email,
      p_goal: goal ? clean(body.goal, 20) : null,
      p_ready: ready ? clean(body.ready, 20) : null,
      p_start: slot.startAt,
      p_minutes: rules.slotMinutes,
      p_page_url: [page, heard && `heard=${heard}`].filter(Boolean).join(" | ") || null,
      p_source: sourceFor(page),
      p_invite: invite,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ requestId, stage: "crm", error: message }));
    if (error instanceof BookingRpcError && error.status === 400 && /invalid_phone|invalid_full_name/.test(message)) {
      return json({ ok: false, code: "INVALID_INPUT" }, 422);
    }
    return json({ ok: false, code: "BOOKING_UNAVAILABLE", requestId }, 503);
  }

  if (!crm.ok) {
    if (crm.code === "slot_taken") return json({ ok: false, code: "SLOT_TAKEN" }, 409);
    if (crm.code === "invalid_invite") return json({ ok: false, code: "INVALID_INVITE" }, 409);
    if (crm.code === "already_booked") {
      return json({ ok: false, code: "ALREADY_BOOKED", day: crm.scheduled_at ? dayLabel(crm.scheduled_at) : null, time: crm.scheduled_at ? timeLabel(crm.scheduled_at) : null }, 409);
    }
    // blocked: the number belongs to another Boost Club workspace. Book nothing, say nothing about why.
    await telegram([`Website booking NOT made: ${name} ${phone} asked for ${dayLabel(slot.startAt)} ${slot.time}, number belongs to another workspace (S17 guard).`]);
    return json({ ok: false, code: "CONTACT_US" }, 409);
  }

  const who = crm.full_name || name;
  const manage = crm.manage ? manageUrl(lang, crm.manage) : null;

  // Calendar event (idempotent on the booking key). A replay that already has one skips this.
  let calendarOk = Boolean(crm.calendar_event_id);
  if (!calendarOk) {
    try {
      const event = await createCalendarEvent({
        id: eventIdFor(key),
        summary: `Consultation with ${who}`,
        start: slot.startAt,
        end: slot.endAt,
        location: ADDRESS,
        description: [
          `Booked by ${who} on boostclub.ro/book${invite ? " (personal link)" : ""} (${new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Bucharest", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now)}).`,
          phone ? `Phone: ${phone}` : "Phone: in the CRM",
          email ? `Email: ${email}` : "",
          goal ? `Goal: ${goal}` : "",
          ready ? `When they want to start: ${ready}` : "",
          crm.duplicate_person ? "Already in the CRM before this booking." : "New in the CRM.",
          `CRM person: ${crm.person_id}`,
          "",
          `Directions: ${MAPS}`,
          manage ? `Change or cancel: ${manage}` : "",
        ].filter((l) => l !== "").join("\n"),
        attendeeEmail: email,
      });
      await markCalendar(key, event.id, event.url, null);
      calendarOk = true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(JSON.stringify({ requestId, stage: "calendar", error: message }));
      try { await markCalendar(key, null, null, message.slice(0, 300)); } catch { /* logged above */ }
    }
  }

  if (!crm.replay) {
    await telegram([
      `New website booking: ${who}${invite ? " (your personal link)" : ""}`,
      `${dayLabel(slot.startAt)}, ${slot.time}`,
      phone ? `Phone: ${phone}${email ? ` · ${email}` : ""}` : "",
      goal ? `Goal: ${goal}` : "",
      ready ? `Start: ${ready}` : "",
      invite ? "" : crm.duplicate_person ? "Already in the CRM" : "New lead",
      calendarOk ? "Calendar + CRM done. Send the WhatsApp confirmation." : "⚠️ CRM done, calendar event MISSING: add it by hand.",
    ].filter(Boolean));
  }

  return json({
    ok: true,
    day: dayLabel(slot.startAt),
    time: slot.time,
    startAt: slot.startAt,
    endAt: slot.endAt,
    minutes: rules.slotMinutes,
    address: ADDRESS,
    maps: MAPS,
    manage,
    firstName: who.split(" ")[0],
  });
};

export const config = { path: "/api/booking/book" };
