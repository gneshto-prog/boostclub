import { upstreamJson } from './upstream.mts';

declare const Netlify: {
  env: { get(name: string): string | undefined };
};
type BusyRange = { start: string; end: string };

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

export const googleCalendarId = () => Netlify.env.get("GOOGLE_CALENDAR_ID") || "gneshto@gmail.com";

export const getGoogleAccessToken = async (scopes: string[]) => {
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
    scope: scopes.join(" "),
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

  const { response: tokenResponse, body: tokenBody } = await upstreamJson<{ access_token?: string }>(claims.aud, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  }, 'GOOGLE_TOKEN');
  if (!tokenResponse.ok || !tokenBody.access_token) {
    throw new Error(`Google token request failed (${tokenResponse.status})`);
  }
  return tokenBody.access_token;
};

export const getGoogleCalendarBusy = async (timeMin: string, timeMax: string): Promise<BusyRange[]> => {
  const accessToken = await getGoogleAccessToken([
    "https://www.googleapis.com/auth/calendar.freebusy",
  ]);
  const calendarId = googleCalendarId();
  const { response, body } = await upstreamJson<{
    calendars?: Record<string, { busy?: BusyRange[]; errors?: unknown[] }>;
  }>("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: "Europe/Bucharest",
      items: [{ id: calendarId }],
    }),
  }, 'GOOGLE_CALENDAR');
  const calendar = body.calendars?.[calendarId];
  if (!response.ok || !calendar || (calendar.errors && calendar.errors.length)) {
    throw new Error(`Google Calendar availability failed (${response.status})`);
  }
  if (!Array.isArray(calendar.busy) || calendar.busy.some(range =>
    !Number.isFinite(Date.parse(range.start)) || !Number.isFinite(Date.parse(range.end))
    || Date.parse(range.end) <= Date.parse(range.start))) {
    throw new Error('GOOGLE_CALENDAR_INVALID_BUSY_RESPONSE');
  }
  return calendar.busy;
};
