export type JsonRecord = Record<string, unknown>;

export const json = (body: JsonRecord, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export const allowedOrigin = (req: Request) => {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = new URL(origin).hostname;
    return host === new URL(req.url).hostname
      || host === "boostclub.ro" || host === "www.boostclub.ro"
      || host.endsWith("--resplendent-starlight-5bdd62.netlify.app")
      || host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
};

declare const Netlify: {
  env: { get(name: string): string | undefined };
};

export const ADDRESS = "Boost Club, Strada Sevastopol 24, Sector 1, București";
export const MAPS = "https://www.google.com/maps/dir/?api=1&destination=Strada+Sevastopol+24+Bucuresti";
export const LINK_TOKEN = /^[A-Za-z0-9_-]{16,64}$/;

export const dayLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Bucharest", weekday: "long", day: "numeric", month: "long" }).format(new Date(iso));
export const timeLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Bucharest", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));
export const shortLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Bucharest", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));

export const manageUrl = (lang: string, token: string) =>
  `https://boostclub.ro/${lang === "ro" ? "ro/" : lang === "ru" ? "ru/" : ""}book?m=${token}`;

// Gabi's Telegram (same bot as /menu orders). Never throws.
export const telegram = async (lines: string[]) => {
  const token = Netlify.env.get("MENU_TELEGRAM_BOT_TOKEN");
  const chatId = Netlify.env.get("MENU_TELEGRAM_CHAT_ID");
  if (!token || !chatId) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.filter(Boolean).join("\n") }),
      signal: AbortSignal.timeout(6000),
    });
    return res.ok;
  } catch {
    return false;
  }
};
