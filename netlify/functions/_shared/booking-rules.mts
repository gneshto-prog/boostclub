// Self-serve booking rules for boostclub.ro/book (5 Nov 2026, Gabi's pick "Own page (B)").
// Pure functions: no network, no env reads except bookingRules(). Everything runs on the
// business clock, Europe/Bucharest, whatever the server's own clock says.

declare const Netlify: {
  env: { get(name: string): string | undefined };
};

export const TIME_ZONE = "Europe/Bucharest";

type Hours = { open: string; close: string };
export type BookingRules = {
  slotMinutes: number;
  // ISO weekday 1 (Mon) .. 7 (Sun) -> hours, or null when closed. "close" = the last sit must END by then.
  week: Record<string, Hours | null>;
  // YYYY-MM-DD -> closed all day, or other hours that day
  dates: Record<string, Hours | null>;
  // YYYY-MM-DD -> extra blocked ranges that day, local "HH:MM" pairs
  blocks: Record<string, [string, string][]>;
  minDaysAhead: number; // 1 = never today, first bookable day is tomorrow
  horizonDays: number; // how many calendar days ahead the page offers
  maxPerDay: number | null; // stop offering a day once it holds this many sits (null = no cap)
};

// Gabi's rules as of 5 Nov 2026 (AS work). Override in Netlify with BOOST_BOOKING_RULES_JSON.
export const DEFAULT_RULES: BookingRules = {
  slotMinutes: 30,
  week: {
    "1": { open: "07:00", close: "18:40" }, // Mon: MT Arko 19:30
    "2": { open: "07:00", close: "18:10" }, // Tue: Ranok 19:00
    "3": { open: "07:00", close: "21:00" },
    "4": { open: "07:00", close: "19:10" }, // Thu: Ranok PRO 20:00
    "5": { open: "07:00", close: "21:00" },
    "6": null, // Saturday closed
    "7": { open: "10:00", close: "16:00" }, // Sun: club 10-18, but after 16:00 = Boost Fit (his 4 Nov 23:13)
  },
  dates: {
    "2026-11-06": null, // AS ruling 12 (30 Oct): no new bookings into the week of 2-8 Nov
    "2026-11-08": null,
    "2026-11-09": null, // Mon 9 - Thu 12: full (45 booked + every free time offered on WhatsApp, AS-STATE 5 Nov 13:05)
    "2026-11-10": null,
    "2026-11-11": null,
    "2026-11-12": null,
    "2026-11-13": null, // Fit Club Masterclass trip, Fri 13 - Sun 15 Nov
    "2026-11-14": null,
    "2026-11-15": null,
  },
  blocks: {
    "2026-11-11": [["14:00", "15:40"]], // Wed gym block
  },
  minDaysAhead: 1,
  horizonDays: 14,
  maxPerDay: null,
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const CLOCK = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

const minutesOf = (clock: string) => {
  const [h, m] = clock.split(":").map(Number);
  return h * 60 + m;
};
const clockOf = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const validHours = (value: unknown, label: string): Hours | null => {
  if (value === null) return null;
  const h = value as Hours;
  if (!h || !CLOCK.test(h.open) || !CLOCK.test(h.close) || minutesOf(h.close) <= minutesOf(h.open)) {
    throw new Error(`BOOKING_RULES_INVALID: ${label}`);
  }
  return { open: h.open, close: h.close };
};

export const parseRules = (raw: string | undefined): BookingRules => {
  if (!raw) return structuredClone(DEFAULT_RULES);
  const given = JSON.parse(raw) as Partial<BookingRules>;
  const rules = structuredClone(DEFAULT_RULES);
  if (given.slotMinutes !== undefined) {
    if (![30, 45].includes(Number(given.slotMinutes))) throw new Error("BOOKING_RULES_INVALID: slotMinutes");
    rules.slotMinutes = Number(given.slotMinutes);
  }
  for (const [day, hours] of Object.entries(given.week || {})) {
    if (!/^[1-7]$/.test(day)) throw new Error("BOOKING_RULES_INVALID: week key");
    rules.week[day] = validHours(hours, `week ${day}`);
  }
  for (const [date, hours] of Object.entries(given.dates || {})) {
    if (!ISO_DATE.test(date)) throw new Error("BOOKING_RULES_INVALID: date key");
    rules.dates[date] = validHours(hours, date);
  }
  for (const [date, ranges] of Object.entries(given.blocks || {})) {
    if (!ISO_DATE.test(date) || !Array.isArray(ranges)) throw new Error("BOOKING_RULES_INVALID: blocks");
    rules.blocks[date] = ranges.map(([a, b]) => {
      if (!CLOCK.test(a) || !CLOCK.test(b) || minutesOf(b) <= minutesOf(a)) throw new Error("BOOKING_RULES_INVALID: block range");
      return [a, b] as [string, string];
    });
  }
  for (const key of ["minDaysAhead", "horizonDays"] as const) {
    if (given[key] !== undefined) {
      const n = Number(given[key]);
      if (!Number.isInteger(n) || n < (key === "minDaysAhead" ? 1 : 1) || n > 60) throw new Error(`BOOKING_RULES_INVALID: ${key}`);
      rules[key] = n;
    }
  }
  if (given.maxPerDay !== undefined) {
    const n = given.maxPerDay === null ? null : Number(given.maxPerDay);
    if (n !== null && (!Number.isInteger(n) || n < 1 || n > 40)) throw new Error("BOOKING_RULES_INVALID: maxPerDay");
    rules.maxPerDay = n;
  }
  return rules;
};

export const bookingRules = () => parseRules(Netlify.env.get("BOOST_BOOKING_RULES_JSON"));

// ---------------------------------------------------------------- business-clock helpers
const partsIn = (instant: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(instant);
  const get = (t: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === t)?.value || 0);
  return { y: get("year"), mo: get("month"), d: get("day"), h: get("hour"), mi: get("minute"), s: get("second") };
};

export const localDate = (instant: Date) => {
  const p = partsIn(instant);
  return `${p.y}-${String(p.mo).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
};

// "2026-11-09" + "10:30" on the Bucharest clock -> the real instant (handles DST).
export const instantAt = (date: string, clock: string) => {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = clock.split(":").map(Number);
  const want = Date.UTC(y, mo - 1, d, h, mi, 0);
  let guess = want;
  for (let i = 0; i < 3; i += 1) {
    const p = partsIn(new Date(guess));
    guess += want - Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s);
  }
  return new Date(guess);
};

const addDays = (date: string, days: number) => {
  const t = new Date(`${date}T12:00:00Z`);
  t.setUTCDate(t.getUTCDate() + days);
  return t.toISOString().slice(0, 10);
};

export const isoWeekday = (date: string) => {
  if (!ISO_DATE.test(date)) throw new Error("INVALID_DATE");
  const t = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(t.getTime()) || t.toISOString().slice(0, 10) !== date) throw new Error("INVALID_DATE");
  return t.getUTCDay() === 0 ? 7 : t.getUTCDay();
};

export const hoursFor = (date: string, rules: BookingRules): Hours | null => {
  if (Object.prototype.hasOwnProperty.call(rules.dates, date)) return rules.dates[date];
  return rules.week[String(isoWeekday(date))] ?? null;
};

// ---------------------------------------------------------------- slots
export type Range = { start: string; end: string };
export type Slot = { date: string; time: string; startAt: string; endAt: string; nextToSit: boolean };

const overlaps = (a: Range, b: Range) =>
  Date.parse(a.start) < Date.parse(b.end) && Date.parse(a.end) > Date.parse(b.start);

// The days the page may offer, in order: from minDaysAhead days after today (Bucharest), for horizonDays.
export const offerDates = (now: Date, rules: BookingRules) => {
  const today = localDate(now);
  const out: string[] = [];
  for (let i = rules.minDaysAhead; i < rules.minDaysAhead + rules.horizonDays; i += 1) {
    const date = addDays(today, i);
    if (hoursFor(date, rules)) out.push(date);
  }
  return out;
};

export const gridFor = (date: string, rules: BookingRules): Slot[] => {
  const hours = hoursFor(date, rules);
  if (!hours) return [];
  const blocks: Range[] = (rules.blocks[date] || []).map(([a, b]) => ({
    start: instantAt(date, a).toISOString(), end: instantAt(date, b).toISOString(),
  }));
  const slots: Slot[] = [];
  const close = minutesOf(hours.close);
  for (let m = minutesOf(hours.open); m + rules.slotMinutes <= close; m += 30) {
    const time = clockOf(m);
    const start = instantAt(date, time);
    const slot: Slot = {
      date, time,
      startAt: start.toISOString(),
      endAt: new Date(start.getTime() + rules.slotMinutes * 60_000).toISOString(),
      nextToSit: false,
    };
    if (!blocks.some((b) => overlaps({ start: slot.startAt, end: slot.endAt }, b))) slots.push(slot);
  }
  return slots;
};

// Free slots for one day. busy = calendar busy + CRM sits + WhatsApp holds; sits = CRM sits only
// (used to put times that sit right next to an existing consultation first, so days pack back to back).
export const freeSlotsFor = (
  date: string, busy: Range[], sits: Range[], now: Date, rules: BookingRules,
): Slot[] => {
  if (!offerDates(now, rules).includes(date)) return [];
  if (rules.maxPerDay !== null) {
    const dayStart = instantAt(date, "00:00").getTime();
    const dayEnd = instantAt(addDays(date, 1), "00:00").getTime();
    const count = sits.filter((s) => Date.parse(s.start) >= dayStart && Date.parse(s.start) < dayEnd).length;
    if (count >= rules.maxPerDay) return [];
  }
  return gridFor(date, rules)
    .filter((slot) => !busy.some((b) => overlaps({ start: slot.startAt, end: slot.endAt }, b)))
    .map((slot) => ({
      ...slot,
      nextToSit: sits.some((s) => Date.parse(s.end) === Date.parse(slot.startAt) || Date.parse(s.start) === Date.parse(slot.endAt)),
    }));
};

// The one check the booking call trusts: is this exact start a free slot right now?
export const findFreeSlot = (startAt: unknown, busy: Range[], sits: Range[], now: Date, rules: BookingRules) => {
  if (typeof startAt !== "string" || startAt.length > 40) return null;
  const t = new Date(startAt);
  if (Number.isNaN(t.getTime())) return null;
  const iso = t.toISOString();
  return freeSlotsFor(localDate(t), busy, sits, now, rules).find((s) => s.startAt === iso) || null;
};
