// Token-gated CRM calls for the self-serve booking page. Production has no service-role key by
// design: the site uses the public publishable key + WEBSITE_INTAKE_TOKEN (sha256 in
// private.website_intake_tokens), and that pair can only call the *_public wrappers.
import { upstreamJson } from "./upstream.mts";
import type { Range } from "./booking-rules.mts";

declare const Netlify: {
  env: { get(name: string): string | undefined };
};

export class BookingRpcError extends Error {
  status: number;
  constructor(name: string, status: number, message: string) {
    super(`${name} ${status}: ${message.slice(0, 160)}`);
    this.status = status;
  }
}

const rpc = async <T,>(name: string, body: Record<string, unknown>): Promise<T> => {
  const url = Netlify.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const apiKey = Netlify.env.get("SUPABASE_PUBLISHABLE_KEY");
  const token = Netlify.env.get("WEBSITE_INTAKE_TOKEN");
  if (!url || !apiKey || !token) throw new Error("CRM_NOT_CONFIGURED");
  const { response, body: parsed } = await upstreamJson<Record<string, unknown>>(
    `${url}/rest/v1/rpc/${name}`,
    {
      method: "POST",
      headers: { apikey: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ p_token: token, ...body }),
    },
    "SUPABASE",
  );
  if (!response.ok) throw new BookingRpcError(name, response.status, String(parsed?.message ?? ""));
  return parsed as T;
};

export type CrmBusy = { sits: Range[]; holds: Range[] };

export const crmBusy = async (start: string, end: string): Promise<CrmBusy> => {
  const out = await rpc<CrmBusy>("get_website_busy_public", { p_start: start, p_end: end });
  const ok = (list: unknown) => Array.isArray(list) && list.every((r) =>
    r && typeof r.start === "string" && typeof r.end === "string"
    && Number.isFinite(Date.parse(r.start)) && Number.isFinite(Date.parse(r.end)));
  if (!out || !ok(out.sits) || !ok(out.holds)) throw new Error("CRM_INVALID_BUSY");
  const norm = (r: Range) => ({ start: new Date(r.start).toISOString(), end: new Date(r.end).toISOString() });
  return { sits: out.sits.map(norm), holds: out.holds.map(norm) };
};

export type BookResult = {
  ok: boolean;
  code?: "slot_taken" | "already_booked" | "blocked";
  replay?: boolean;
  person_id?: string;
  consultation_id?: string;
  scheduled_at?: string;
  calendar_event_id?: string | null;
  duplicate_person?: boolean;
  full_name?: string;
  manage?: string | null;
};

export const bookSlot = (body: Record<string, unknown>) => rpc<BookResult>("book_website_slot_public", body);

export const markCalendar = (
  idempotencyKey: string, eventId: string | null, eventUrl: string | null, error: string | null,
  context: "create" | "move" | "cancel" = "create",
) =>
  rpc<unknown>("mark_website_booking_calendar_public", {
    p_idempotency_key: idempotencyKey, p_event_id: eventId, p_event_url: eventUrl, p_error: error, p_context: context,
  });

// Personal link Kai sends on WhatsApp (?i=<token>): only the first name comes back.
export type Invite = { ok: boolean; code?: string; first_name?: string; language?: string; open_at?: string | null };
export const getInvite = (invite: string) => rpc<Invite>("get_booking_invite_public", { p_invite: invite });

// "Change or cancel" link (?m=<token>)
export type MyBooking = {
  ok: boolean; code?: string; first_name?: string; scheduled_at?: string; minutes?: number;
  language?: string; state?: "booked" | "cancelled" | "past"; can_move?: boolean;
};
export type ChangeResult = {
  ok: boolean; code?: string; idempotency_key?: string; full_name?: string;
  old_at?: string; scheduled_at?: string; minutes?: number; calendar_event_id?: string | null;
};
export const getMyBooking = (manage: string) => rpc<MyBooking>("get_my_booking_public", { p_manage: manage });
export const moveMyBooking = (manage: string, start: string) =>
  rpc<ChangeResult>("move_my_booking_public", { p_manage: manage, p_start: start });
export const cancelMyBooking = (manage: string) => rpc<ChangeResult>("cancel_my_booking_public", { p_manage: manage });
