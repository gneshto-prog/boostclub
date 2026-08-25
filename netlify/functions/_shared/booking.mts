declare const Netlify: {
  env: { get(name: string): string | undefined };
};

export const BOOKING_TIME_ZONE = "Europe/Bucharest";
export const BOOKING_SLOT_MINUTES = 40;
export const BOOKING_LEAD_MINUTES = 30;

type Hours = { open: string; close: string };
type HoursOverride = Partial<Hours> & { closed?: boolean };
type BookingHoursConfig = {
  weekday: Hours;
  sunday: Hours;
  byWeekday: Record<string, HoursOverride>;
  overrides: Record<string, HoursOverride>;
};

export type BookingSlot = {
  date: string;
  start: string;
  end: string;
  startAt: string;
  endAt: string;
};

const DEFAULT_CONFIG: BookingHoursConfig = {
  weekday: { open: "07:00", close: "20:00" },
  sunday: { open: "10:00", close: "18:00" },
  byWeekday: {},
  overrides: {},
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const CLOCK_TIME = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

const minutesFor = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const timeFor = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const validateHours = (hours: Hours, label: string) => {
  if (!CLOCK_TIME.test(hours.open) || !CLOCK_TIME.test(hours.close)) {
    throw new Error(`${label} must use HH:MM values`);
  }
  if (minutesFor(hours.close) <= minutesFor(hours.open)) {
    throw new Error(`${label} closing time must be after opening time`);
  }
  return hours;
};

export const bookingHoursConfig = (): BookingHoursConfig => {
  const raw = Netlify.env.get("BOOST_BOOKING_HOURS_JSON");
  if (!raw) return structuredClone(DEFAULT_CONFIG);

  let parsed: Partial<BookingHoursConfig>;
  try {
    parsed = JSON.parse(raw) as Partial<BookingHoursConfig>;
  } catch {
    throw new Error("BOOST_BOOKING_HOURS_JSON is not valid JSON");
  }

  const config: BookingHoursConfig = {
    weekday: validateHours({ ...DEFAULT_CONFIG.weekday, ...(parsed.weekday || {}) }, "weekday hours"),
    sunday: validateHours({ ...DEFAULT_CONFIG.sunday, ...(parsed.sunday || {}) }, "Sunday hours"),
    byWeekday: {},
    overrides: {},
  };

  for (const [weekday, override] of Object.entries(parsed.byWeekday || {})) {
    if (!/^[1-7]$/.test(weekday) || !override || typeof override !== "object") {
      throw new Error("byWeekday overrides must use ISO weekday keys 1 through 7");
    }
    if (override.closed) {
      config.byWeekday[weekday] = { closed: true };
      continue;
    }
    const base = weekday === "7" ? config.sunday : config.weekday;
    config.byWeekday[weekday] = validateHours(
      { ...base, ...override },
      `hours for ISO weekday ${weekday}`,
    );
  }

  for (const [date, override] of Object.entries(parsed.overrides || {})) {
    if (!ISO_DATE.test(date) || !override || typeof override !== "object") {
      throw new Error("Booking-hour overrides must use YYYY-MM-DD keys");
    }
    const day = dayOfWeek(date);
    const base = day === 0 ? config.sunday : config.weekday;
    if (override.closed) {
      config.overrides[date] = { closed: true };
      continue;
    }
    const hours = validateHours({ ...base, ...override }, `hours for ${date}`);
    config.overrides[date] = hours;
  }
  return config;
};

const dayOfWeek = (date: string) => {
  if (!ISO_DATE.test(date)) throw new Error("INVALID_BOOKING_DATE");
  const candidate = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(candidate.getTime()) || candidate.toISOString().slice(0, 10) !== date) {
    throw new Error("INVALID_BOOKING_DATE");
  }
  return candidate.getUTCDay();
};

export const bookingHoursForDate = (date: string): Hours | null => {
  const config = bookingHoursConfig();
  const override = config.overrides[date];
  if (override?.closed) return null;
  if (override && override.open && override.close) return { open: override.open, close: override.close };

  const day = dayOfWeek(date);
  const isoDay = day === 0 ? 7 : day;
  const weeklyOverride = config.byWeekday[String(isoDay)];
  if (weeklyOverride?.closed) return null;
  if (weeklyOverride?.open && weeklyOverride.close) {
    return { open: weeklyOverride.open, close: weeklyOverride.close };
  }
  if (day === 6) return null;
  if (day === 0) return config.sunday;
  return config.weekday;
};

const localParts = (instant: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value || 0);
  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour"),
    minute: value("minute"),
    second: value("second"),
  };
};

const zonedDateTime = (date: string, time: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const desired = Date.UTC(year, month - 1, day, hour, minute, 0);
  let candidate = desired;

  for (let pass = 0; pass < 3; pass += 1) {
    const observed = localParts(new Date(candidate));
    const observedAsUtc = Date.UTC(
      observed.year,
      observed.month - 1,
      observed.day,
      observed.hour,
      observed.minute,
      observed.second,
    );
    candidate += desired - observedAsUtc;
  }
  return new Date(candidate);
};

export const localDateFor = (instant: Date) => {
  const parts = localParts(instant);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
};

export const bookingSlotsForDate = (date: string, now = new Date()): BookingSlot[] => {
  const hours = bookingHoursForDate(date);
  if (!hours) return [];

  const slots: BookingSlot[] = [];
  const close = minutesFor(hours.close);
  const earliest = now.getTime() + BOOKING_LEAD_MINUTES * 60_000;
  for (let start = minutesFor(hours.open); start + BOOKING_SLOT_MINUTES <= close; start += BOOKING_SLOT_MINUTES) {
    const startLabel = timeFor(start);
    const endLabel = timeFor(start + BOOKING_SLOT_MINUTES);
    const startAt = zonedDateTime(date, startLabel);
    if (startAt.getTime() <= earliest) continue;
    const endAt = new Date(startAt.getTime() + BOOKING_SLOT_MINUTES * 60_000);
    slots.push({
      date,
      start: startLabel,
      end: endLabel,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    });
  }
  return slots;
};

export const validateRequestedBooking = (value: unknown, now = new Date()) => {
  if (typeof value !== "string" || value.length > 40) throw new Error("INVALID_BOOKING_SLOT");
  const requested = new Date(value);
  if (Number.isNaN(requested.getTime())) throw new Error("INVALID_BOOKING_SLOT");
  const date = localDateFor(requested);
  const match = bookingSlotsForDate(date, now).find((slot) => slot.startAt === requested.toISOString());
  if (!match) throw new Error("INVALID_BOOKING_SLOT");
  return match;
};

export const rangesOverlap = (startA: string, endA: string, startB: string, endB: string) =>
  new Date(startA).getTime() < new Date(endB).getTime()
  && new Date(endA).getTime() > new Date(startB).getTime();
