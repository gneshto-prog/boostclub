import {
  rangesOverlap,
  validateRequestedBooking,
} from "./_shared/booking.mts";
import {
  getGoogleAccessToken,
  getGoogleCalendarBusy,
  googleCalendarId,
} from "./_shared/google-calendar.mts";
import { SupabaseRpcError, supabaseRpc } from "./_shared/supabase.mts";

declare const Netlify: {
  env: { get(name: string): string | undefined };
};

type JsonRecord = Record<string, unknown>;

const ALLOWED_FORM_NAMES = new Set([
  "consultatie",
  "consultatie-en",
  "consultatie-ru",
  "partner-lead",
]);

const json = (body: JsonRecord, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const clean = (value: unknown, max = 5000) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
};

const normalizePhone = (value: unknown) => {
  const raw = clean(value, 40);
  if (!raw) return null;
  let digits = raw.replace(/[^0-9+]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (digits.startsWith("0")) digits = `+40${digits.slice(1)}`;
  if (!digits.startsWith("+") && digits.startsWith("40")) digits = `+${digits}`;
  if (!/^\+[1-9][0-9]{6,14}$/.test(digits)) return null;
  return digits;
};

const createCalendarEvent = async (payload: JsonRecord, crm: JsonRecord) => {
  const accessToken = await getGoogleAccessToken([
    "https://www.googleapis.com/auth/calendar.events",
  ]);
  const calendarId = googleCalendarId();
  const idempotencyKey = clean(payload.idempotencyKey, 36);
  const eventId = `bc${idempotencyKey.replace(/-/g, "").toLowerCase()}`;
  const leadType = payload.leadType === "business" ? "business" : "client";
  const fullName = clean(payload.fullName, 120);
  const contact = clean(payload.contact || payload.phone, 200);
  const country = clean(payload.country, 120);
  const message = clean(payload.message, 1000);
  const formName = clean(payload.formName, 40);
  const language = clean(payload.language, 4);
  const landingPage = clean(payload.landingPage, 300);
  const personId = clean(crm.person_id, 50);
  const consultationId = clean(crm.consultation_id, 50);

  const summary = leadType === "client"
    ? `${payload.requestedStart ? "Boost Club — scanare rezervată" : "Boost Club — confirmă scanarea"}: ${fullName}`
    : `Boost Club — răspunde lead business: ${fullName}`;
  const description = [
    `Lead website (${formName}, ${language})`,
    `Contact: ${contact}`,
    country ? `Țară: ${country}` : "",
    landingPage ? `Landing page: ${landingPage}` : "",
    personId ? `CRM person: ${personId}` : "",
    consultationId ? `CRM consultation: ${consultationId}` : "",
    message ? `Mesaj: ${message}` : "",
    `Idempotency: ${idempotencyKey}`,
  ].filter(Boolean).join("\n");

  const event = {
    id: eventId,
    summary,
    description,
    ...(leadType === "client"
      ? { location: "Strada Sevastopol 24, Sector 1, București" }
      : {}),
    start: {
      dateTime: String(crm.calendar_start_at),
      timeZone: "Europe/Bucharest",
    },
    end: {
      dateTime: String(crm.calendar_end_at),
      timeZone: "Europe/Bucharest",
    },
    reminders: {
      useDefault: false,
      overrides: leadType === "client"
        ? [{ method: "popup", minutes: 60 }]
        : [{ method: "popup", minutes: 10 }],
    },
    extendedProperties: {
      private: {
        boostclubIdempotencyKey: idempotencyKey,
        boostclubPersonId: personId,
      },
    },
  };

  const eventUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
  let response = await fetch(`${eventUrl}?sendUpdates=none`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (response.status === 409) {
    response = await fetch(`${eventUrl}/${encodeURIComponent(eventId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  const responseBody = (await response.json()) as { id?: string; htmlLink?: string };
  if (!response.ok || !responseBody.id) {
    throw new Error(`Google Calendar write failed (${response.status})`);
  }
  return { id: responseBody.id, url: responseBody.htmlLink || "" };
};

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
  if (req.method !== "POST") return json({ ok: false, code: "METHOD_NOT_ALLOWED" }, 405);
  if (!isAllowedOrigin(req)) return json({ ok: false, code: "ORIGIN_NOT_ALLOWED" }, 403);

  let payload: JsonRecord;
  try {
    payload = (await req.json()) as JsonRecord;
  } catch {
    return json({ ok: false, code: "INVALID_JSON", requestId }, 400);
  }

  if (clean(payload.botField, 200)) return json({ ok: true, ignored: true, requestId });

  const idempotencyKey = clean(payload.idempotencyKey, 36);
  const formName = clean(payload.formName, 40);
  const language = clean(payload.language, 4);
  const leadType = clean(payload.leadType, 20);
  const fullName = clean(payload.fullName, 120);
  const contact = clean(payload.contact, 200);
  const phone = normalizePhone(payload.phone || contact);
  const requestedStart = clean(payload.requestedStart, 40);
  const preferredWeekday = Number.isInteger(payload.preferredWeekday)
    ? payload.preferredWeekday as number
    : null;
  const preferredStart = clean(payload.preferredStart, 8);
  const preferredEnd = clean(payload.preferredEnd, 8);

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
    return json({ ok: false, code: "INVALID_IDEMPOTENCY_KEY", requestId }, 422);
  }
  if (!ALLOWED_FORM_NAMES.has(formName) || !["ro", "en", "ru"].includes(language)) {
    return json({ ok: false, code: "INVALID_FORM", requestId }, 422);
  }
  if (!fullName || !["client", "business"].includes(leadType)) {
    return json({ ok: false, code: "INVALID_LEAD", requestId }, 422);
  }
  if (leadType === "client" && !phone) {
    return json({ ok: false, code: "INVALID_PHONE", requestId }, 422);
  }
  if (leadType === "business" && !contact) {
    return json({ ok: false, code: "CONTACT_REQUIRED", requestId }, 422);
  }

  let requestedSlot: ReturnType<typeof validateRequestedBooking> | null = null;
  if (leadType === "client" && requestedStart) {
    try {
      requestedSlot = validateRequestedBooking(requestedStart);
      const replay = await supabaseRpc("get_website_booking_replay", {
        p_idempotency_key: idempotencyKey,
      }) as JsonRecord | null;
      const isKnownReplay = replay
        && typeof replay.booking_slot === "string"
        && new Date(replay.booking_slot).toISOString() === requestedSlot.startAt;
      if (!isKnownReplay) {
        const busy = await getGoogleCalendarBusy(requestedSlot.startAt, requestedSlot.endAt);
        if (busy.some((range) => rangesOverlap(
          requestedSlot!.startAt,
          requestedSlot!.endAt,
          range.start,
          range.end,
        ))) {
          return json({ ok: false, code: "BOOKING_SLOT_UNAVAILABLE", requestId }, 409);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_BOOKING_SLOT") {
        return json({ ok: false, code: "INVALID_BOOKING_SLOT", requestId }, 422);
      }
      const message = error instanceof Error ? error.message : "Availability check failed";
      console.error(JSON.stringify({ requestId, stage: "booking_validation", error: message }));
      return json({ ok: false, code: "AVAILABILITY_UNAVAILABLE", requestId }, 503);
    }
  } else if (leadType === "client" && (!preferredWeekday || !preferredStart)) {
    // Allows already-open legacy booking pages to finish their preference-window
    // submission while all current pages require an exact live-calendar slot.
    return json({ ok: false, code: "INVALID_BOOKING_SLOT", requestId }, 422);
  }

  const attribution = typeof payload.attribution === "object" && payload.attribution
    ? payload.attribution as JsonRecord
    : {};
  const rpcBody: JsonRecord = {
    p_idempotency_key: idempotencyKey,
    p_form_name: formName,
    p_language: language,
    p_lead_type: leadType,
    p_full_name: fullName,
    p_phone: phone,
    p_contact: contact || phone,
    p_country: clean(payload.country, 120) || null,
    p_message: clean(payload.message, 2000) || null,
    p_landing_page: clean(payload.landingPage, 300) || null,
    p_page_url: clean(payload.pageUrl, 1000) || null,
    p_attribution: attribution,
    p_preferred_weekday: preferredWeekday,
    p_preferred_start: preferredStart || null,
    p_preferred_end: preferredEnd || null,
    p_goal_category: clean(payload.goalCategory, 20) || null,
    p_requested_start: requestedSlot?.startAt || null,
  };

  try {
    const crm = await supabaseRpc("ingest_website_lead", rpcBody) as JsonRecord;
    if (!crm) throw new Error("Supabase RPC returned no result");

    if (!crm.calendar_synced_at) {
      try {
        const calendar = await createCalendarEvent(
          { ...payload, idempotencyKey, formName, language, leadType, fullName, contact, phone },
          crm,
        );
        await supabaseRpc("mark_website_lead_calendar", {
          p_idempotency_key: idempotencyKey,
          p_event_id: calendar.id,
          p_event_url: calendar.url,
          p_error: null,
        });
        crm.calendar_event_id = calendar.id;
        crm.calendar_event_url = calendar.url;
        crm.calendar_synced_at = new Date().toISOString();
      } catch (calendarError) {
        const message = calendarError instanceof Error ? calendarError.message : "Calendar write failed";
        try {
          await supabaseRpc("mark_website_lead_calendar", {
            p_idempotency_key: idempotencyKey,
            p_event_id: null,
            p_event_url: null,
            p_error: message,
          });
        } catch {
          // The CRM row and urgent action already exist; the failed request is retriable.
        }
        console.error(JSON.stringify({ requestId, idempotencyKey, stage: "calendar", error: message }));
        return json({ ok: false, code: "CALENDAR_SYNC_FAILED", savedToCrm: true, requestId }, 503);
      }
    }

    return json({
      ok: true,
      requestId,
      idempotentReplay: Boolean(crm.idempotent_replay),
      personId: crm.person_id,
      consultationId: crm.consultation_id,
      actionId: crm.action_id,
      calendarEventId: crm.calendar_event_id,
      calendarStartAt: crm.calendar_start_at,
      calendarEndAt: crm.calendar_end_at,
    });
  } catch (error) {
    if (error instanceof SupabaseRpcError && /booking_slot_unavailable/.test(error.apiMessage)) {
      return json({ ok: false, code: "BOOKING_SLOT_UNAVAILABLE", requestId }, 409);
    }
    if (error instanceof SupabaseRpcError && /person_already_has_booking/.test(error.apiMessage)) {
      return json({ ok: false, code: "PERSON_ALREADY_BOOKED", requestId }, 409);
    }
    const message = error instanceof Error ? error.message : "Lead pipeline failed";
    console.error(JSON.stringify({ requestId, idempotencyKey, stage: "crm", error: message }));
    return json({ ok: false, code: "LEAD_PIPELINE_FAILED", requestId }, 503);
  }
};

export const config = {
  path: "/api/lead",
};
