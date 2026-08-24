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

const base64Url = (input: string | Uint8Array) => {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const importPrivateKey = async (pem: string) => {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return crypto.subtle.importKey(
    "pkcs8",
    bytes,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
};

const getGoogleAccessToken = async () => {
  const raw = Netlify.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not configured");

  const credentials = JSON.parse(raw) as {
    client_email?: string;
    private_key?: string;
    private_key_id?: string;
    token_uri?: string;
  };
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("Google service-account credentials are incomplete");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
    ...(credentials.private_key_id ? { kid: credentials.private_key_id } : {}),
  };
  const claims = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/calendar.events",
    aud: credentials.token_uri || "https://oauth2.googleapis.com/token",
    iat: now - 30,
    exp: now + 3300,
  };
  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claims))}`;
  const key = await importPrivateKey(credentials.private_key);
  const signature = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned)),
  );
  const assertion = `${unsigned}.${base64Url(signature)}`;

  const tokenResponse = await fetch(claims.aud, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const tokenBody = (await tokenResponse.json()) as { access_token?: string; error?: string };
  if (!tokenResponse.ok || !tokenBody.access_token) {
    throw new Error(`Google token request failed (${tokenResponse.status})`);
  }
  return tokenBody.access_token;
};

const supabaseRpc = async (name: string, body: JsonRecord) => {
  const supabaseUrl = Netlify.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const secretKey = Netlify.env.get("SUPABASE_SECRET_KEY");
  if (!supabaseUrl || !secretKey) {
    throw new Error("Supabase server credentials are not configured");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });
  const raw = await response.text();
  let parsed: unknown = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
  if (!response.ok) {
    const code = typeof parsed === "object" && parsed && "code" in parsed
      ? String((parsed as { code: unknown }).code)
      : `HTTP_${response.status}`;
    throw new Error(`Supabase RPC ${name} failed (${code})`);
  }
  return (Array.isArray(parsed) ? parsed[0] : parsed) as JsonRecord;
};

const createCalendarEvent = async (payload: JsonRecord, crm: JsonRecord) => {
  const accessToken = await getGoogleAccessToken();
  const calendarId = Netlify.env.get("GOOGLE_CALENDAR_ID") || "gneshto@gmail.com";
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
    ? `Boost Club — confirmă scanarea: ${fullName}`
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
    p_preferred_weekday: Number.isInteger(payload.preferredWeekday)
      ? payload.preferredWeekday
      : null,
    p_preferred_start: clean(payload.preferredStart, 8) || null,
    p_preferred_end: clean(payload.preferredEnd, 8) || null,
    p_goal_category: clean(payload.goalCategory, 20) || null,
  };

  try {
    const crm = await supabaseRpc("ingest_website_lead", rpcBody);
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
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lead pipeline failed";
    console.error(JSON.stringify({ requestId, idempotencyKey, stage: "crm", error: message }));
    return json({ ok: false, code: "LEAD_PIPELINE_FAILED", requestId }, 503);
  }
};

export const config = {
  path: "/api/lead",
};
