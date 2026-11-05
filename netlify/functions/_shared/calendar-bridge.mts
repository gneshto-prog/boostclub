// Talks to the Google Apps Script bridge (google-apps-script/booking-bridge) that runs as
// gneshto@gmail.com. Used because Google refuses a service-account key for the club's project.
import { upstreamJson } from "./upstream.mts";
import type { Range } from "./booking-rules.mts";

declare const Netlify: {
  env: { get(name: string): string | undefined };
};

type BridgeReply = { ok?: boolean; code?: string; busy?: Range[]; id?: string; url?: string; replay?: boolean };

const call = async (payload: Record<string, unknown>, timeoutMs = 12000): Promise<BridgeReply> => {
  const url = Netlify.env.get("BOOKING_BRIDGE_URL");
  const secret = Netlify.env.get("BOOKING_BRIDGE_SECRET");
  if (!url || !secret) throw new Error("BRIDGE_NOT_CONFIGURED");
  // Apps Script answers a POST with a 302 to googleusercontent.com; fetch follows it (as GET),
  // which is how Apps Script hands back the doPost output.
  const { response, body } = await upstreamJson<BridgeReply>(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret, ...payload }),
    redirect: "follow",
  }, "BRIDGE", timeoutMs);
  if (!response.ok || !body || body.ok !== true) throw new Error(`BRIDGE_${body?.code || `HTTP_${response.status}`}`);
  return body;
};

export const calendarBusy = async (timeMin: string, timeMax: string): Promise<Range[]> => {
  const reply = await call({ op: "freebusy", timeMin, timeMax });
  if (!Array.isArray(reply.busy) || reply.busy.some((b) =>
    !b || typeof b.start !== "string" || typeof b.end !== "string"
    || !Number.isFinite(Date.parse(b.start)) || !Number.isFinite(Date.parse(b.end)))) {
    throw new Error("BRIDGE_INVALID_BUSY");
  }
  return reply.busy.map((b) => ({ start: new Date(b.start).toISOString(), end: new Date(b.end).toISOString() }));
};

export type CalendarEvent = {
  id: string; summary: string; start: string; end: string;
  location: string; description: string; attendeeEmail?: string | null;
};

export const createCalendarEvent = async (event: CalendarEvent) => {
  const reply = await call({ op: "create", event }, 15000);
  if (typeof reply.id !== "string") throw new Error("BRIDGE_INVALID_EVENT");
  return { id: reply.id, url: typeof reply.url === "string" ? reply.url : null, replay: reply.replay === true };
};

export const moveCalendarEvent = async (id: string, start: string, end: string, note: string) => {
  const reply = await call({ op: "move", id, start, end, note }, 15000);
  return { id: String(reply.id || id), url: typeof reply.url === "string" ? reply.url : null };
};

export const cancelCalendarEvent = async (id: string) => {
  await call({ op: "cancel", id }, 15000);
};

// Calendar event ids allow base32hex (0-9, a-v); a uuid's hex digits fit.
export const eventIdFor = (idempotencyKey: string) => `bcbk${idempotencyKey.replace(/-/g, "").toLowerCase()}`;
