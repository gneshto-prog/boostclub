// Netlify event function: runs after every verified Netlify Forms submission.
// Since 8 Oct the consultation page is a request form that posts to Netlify
// Forms only, so without this a website lead reaches Gabi's inbox but never the
// CRM. Each submission becomes person + "contact now" action + note through
// public.ingest_website_request (no consultation, no calendar: nothing was booked).
//
// Auth: Production has no service-role key, by design. The function calls the
// token-gated wrapper ingest_website_request_public with the PUBLIC publishable
// key plus WEBSITE_INTAKE_TOKEN (sha256 stored in private.website_intake_tokens).
// That pair can do nothing except create a website request.
import { upstreamJson } from "./_shared/upstream.mts";

declare const Netlify: {
  env: { get(name: string): string | undefined };
};

const intakeRpc = async (body: Record<string, unknown>) => {
  const url = Netlify.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const apiKey = Netlify.env.get("SUPABASE_PUBLISHABLE_KEY");
  const token = Netlify.env.get("WEBSITE_INTAKE_TOKEN");
  if (!url || !apiKey || !token) throw new Error("intake env missing (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY / WEBSITE_INTAKE_TOKEN)");
  const { response, body: parsed } = await upstreamJson<Record<string, unknown>>(
    `${url}/rest/v1/rpc/ingest_website_request_public`,
    {
      method: "POST",
      headers: { apikey: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ p_token: token, ...body }),
    },
    "SUPABASE",
  );
  if (!response.ok) throw new Error(`intake RPC ${response.status}: ${String(parsed?.message ?? "").slice(0, 120)}`);
  return parsed;
};

type JsonRecord = Record<string, unknown>;

const FORMS: Record<string, { leadType: "client" | "business"; language?: "ro" | "en" | "ru"; rpcForm?: string }> = {
  "consultatie": { leadType: "client", language: "ro" },
  "consultatie-en": { leadType: "client", language: "en" },
  "consultatie-ru": { leadType: "client", language: "ru" },
  "partner-lead": { leadType: "business" },
  "ambasador": { leadType: "business" },
  "ambasador-en": { leadType: "business", language: "en", rpcForm: "ambasador" },
  "ambasador-ru": { leadType: "business", language: "ru", rpcForm: "ambasador" },
  // English ads landing page /start/ (12 Oct 2026).
  "start-en": { leadType: "client", language: "en", rpcForm: "consultatie-en" },
  // Partner landing pages boostclub.ro/<slug> (15 Oct 2026). Language comes from the hidden
  // "lang" field; the partner slug rides in p_page_url as "partner=<slug>" for the CRM note/action.
  "partner-page": { leadType: "client" },
};

// Paid Meta traffic is tagged by the ad URL: utm_source facebook/instagram/meta/fb/ig
// + utm_medium paid/cpc/ads/paid_social. Anything else stays 'website'.
const sourceFor = (campaign: string) => {
  const [src = "", medium = ""] = campaign.toLowerCase().split("/");
  return /^(facebook|instagram|meta|fb|ig)$/.test(src) && /^(paid|cpc|ads|paid_?social|paidsocial)$/.test(medium)
    ? "meta_ads"
    : "website";
};

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

// "How did you hear about us?" pills on the consultation forms (29 Oct 2026). The
// value is the visible label in RO/EN/RU; the CRM gets one code per answer.
const heardFrom = (value: unknown) => {
  const answer = clean(value, 60).toLowerCase();
  if (!answer) return "";
  if (/google/.test(answer)) return "google";
  if (/insta/.test(answer)) return "instagram";
  if (/prieten|friend|друг/.test(answer)) return "friend";
  if (/strad|street|улиц/.test(answer)) return "street";
  return "other";
};

// The consultation forms carry no campaign field, so read utm_* off the page the
// form was sent from (Netlify keeps the query string). The Google listing's links
// are tagged utm_source=google&utm_medium=gbp.
const campaignFromUrl = (url: string) => {
  try {
    const params = new URL(url).searchParams;
    return ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
      .map((name) => params.get(name) || "").join("/").replace(/\/+$/, "");
  } catch {
    return "";
  }
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

const languageFromUrl = (url: string): "ro" | "en" | "ru" =>
  /\/en(\/|$)/.test(url) ? "en" : /\/ru(\/|$)/.test(url) ? "ru" : "ro";

// Netlify submission ids are 24 hex chars; the ledger key is a uuid, so derive
// a stable one. The same submission always maps to the same key (safe retries).
const keyFor = async (submissionId: string) => {
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`netlify-form:${submissionId}`)));
  hash[6] = (hash[6] & 0x0f) | 0x40;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = [...hash.slice(0, 16)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
};

export default async (req: Request) => {
  let payload: JsonRecord;
  try {
    payload = ((await req.json()) as { payload: JsonRecord }).payload;
  } catch {
    return new Response("bad event body", { status: 400 });
  }
  const formName = clean(payload?.form_name, 40);
  const form = FORMS[formName];
  if (!form) return new Response(`ignored form ${formName}`, { status: 200 });

  const data = (payload.data || {}) as JsonRecord;
  if (clean(data["bot-field"])) return new Response("honeypot", { status: 200 });

  const pageUrl = clean(data.referrer || payload.site_url, 300);
  // "source/medium/campaign/content" from the landing page's utm_* params, if any.
  const campaign = (clean(data.campaign, 200) || campaignFromUrl(pageUrl)).slice(0, 200).replace(/[^\w ./-]/g, "");
  const heard = heardFrom(data.aflat);
  const partner = clean(data.partner, 40).toLowerCase().replace(/[^a-z0-9-]/g, "");
  const language = form.language
    || (["ro", "en", "ru"].includes(clean(data.lang, 4)) ? clean(data.lang, 4) as "ro" | "en" | "ru" : languageFromUrl(pageUrl));
  const fullName = clean(data.prenume || data.firstname || data.name, 120);
  const rawContact = clean(data.telefon || data.phone || data.contact, 200);
  const phone = normalizePhone(rawContact);
  const submissionId = clean(payload.id, 64);

  const body = {
    p_idempotency_key: await keyFor(submissionId || `${formName}:${fullName}:${rawContact}:${clean(payload.created_at, 40)}`),
    p_form_name: form.rpcForm || formName,
    p_language: language,
    p_lead_type: form.leadType,
    p_full_name: fullName || "(no name)",
    p_phone: phone,
    // Keep what they typed when it is not a phone we can normalise (email, handle, typo).
    p_contact: phone && rawContact.replace(/\D/g, "").endsWith(phone.replace(/\D/g, "").slice(-9)) ? null : rawContact || null,
    p_when: clean(data.cand || data.start, 200) || null,
    p_goal: clean(data.obiectiv || data.goal, 120) || null,
    p_country: clean(data.country, 120) || null,
    p_page_url: [pageUrl, partner && `partner=${partner}`, campaign && `campaign=${campaign}`, heard && `heard=${heard}`].filter(Boolean).join(" | ") || null,
    p_source: sourceFor(campaign),
  };

  try {
    const result = await intakeRpc(body);
    console.log(JSON.stringify({ stage: "crm", submissionId, formName, result }));
    return new Response("ok", { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CRM ingest failed";
    // The submission itself is already stored by Netlify and emailed; this only
    // means the CRM row is missing, so it is logged loudly for the sweep.
    console.error(JSON.stringify({ stage: "crm", submissionId, formName, error: message }));
    return new Response("crm ingest failed", { status: 500 });
  }
};
