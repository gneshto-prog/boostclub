declare const Netlify: {
  env: { get(name: string): string | undefined };
};

// Shake order from /menu -> instant Telegram message to Gabi.
// Every item is checked against these lists, so the message can only ever
// contain menu items plus a short customer name.
const BASES: Record<string, string> = {
  vanilla: "Vanilla Cream",
  choc: "Smooth Chocolate",
  cookie: "Cookie Crunch",
  latte: "Café Latte",
  banana: "Banana Cream",
  straw: "Strawberry Delight",
  mint: "Mint & Chocolate",
  rasp: "Raspberry & White Choc",
  dubai: "Dubai Chocolate",
};
const SYRUPS: Record<string, string> = {
  sstraw: "Strawberry",
  schoc: "Chocolate",
  shaz: "Hazelnut",
  scar: "Caramel",
};
const TOPPINGS: Record<string, string> = {
  tcoco: "Coconut",
  thaz: "Hazelnut",
  talm: "Almonds",
  tpist: "Pistachio",
};
// Bar drinks (menutest): all optional, same allowlist rule.
const TEAS: Record<string, string> = { original: "Original", lemon: "Lemon", peach: "Peach", mango: "Mango & Dragon Fruit" };
const ALOES: Record<string, string> = { original: "Original", mango: "Mango" };
const TEMPS: Record<string, string> = { iced: "iced", hot: "hot" };
const XTRAS: Record<string, string> = { f3: "Formula 3 Protein", fibre: "Oat Apple Fibre", creatine: "Creatine+" };
const PLUS: Record<string, string> = {
  collagen: "Collagen Skin Booster", cr7: "CR7 Drive", hydrate: "H24 Hydrate", nightmode: "Night Mode",
  betaheart: "Beta Heart", immune: "Immune Booster", aloemax: "Aloe Max", liftoff: "Liftoff",
  icedcoffee: "High Protein Iced Coffee",
};
const COMBOS = new Set(["Skin Boost", "Energy Boost", "Hydro", "Night Cap", "Heart"]);
const SIGNATURES = new Set([
  "Bounty", "Ferrero", "Raffaello", "Dubai", "Snickers", "Kinder Bueno",
  "Caramel Macchiato", "Banoffee", "After Eight", "Strawberry Cheesecake",
  "Neapolitan", "Mocha", "Chunky Monkey", "Cookies & Cream", "Berry Blush",
  "Pistachio Dream", "Mint Mojito", "Black Forest",
]);

// Best-effort flood guard per warm function instance.
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const pick = (value: unknown, allowed: Record<string, string>, max: number) => {
  if (!Array.isArray(value)) return null;
  const ids = [...new Set(value.filter((v): v is string => typeof v === "string"))];
  if (ids.length > max || ids.some((id) => !(id in allowed))) return null;
  return ids.map((id) => allowed[id]);
};

export default async (request: Request, context: { ip?: string }) => {
  if (request.method !== "POST") return json({ ok: false }, 405);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }
  if (typeof body.website === "string" && body.website) return json({ ok: true }); // honeypot

  const bases = pick(body.b, BASES, 2);
  const syrups = pick(body.s ?? [], SYRUPS, 2);
  const toppings = pick(body.t ?? [], TOPPINGS, 2);
  if (!bases || !bases.length || !syrups || !toppings) return json({ ok: false, error: "invalid" }, 400);

  // Optional bar drinks block. Anything off-list makes the whole block invalid -> ignored.
  let drink = "";
  let extra = "";
  const d = body.d;
  if (d && typeof d === "object") {
    const o = d as Record<string, unknown>;
    const tea = typeof o.tea === "string" && o.tea in TEAS ? TEAS[o.tea] : null;
    const aloe = typeof o.aloe === "string" && o.aloe in ALOES ? ALOES[o.aloe] : null;
    const temp = typeof o.temp === "string" && o.temp in TEMPS ? TEMPS[o.temp] : null;
    const xs = pick(o.x ?? [], XTRAS, 1);
    const ps = pick(o.p ?? [], PLUS, 1);
    if (tea && aloe && temp && xs && ps) {
      drink = `Drink: ${tea} tea + ${aloe} aloe, ${temp}`;
      const combo = typeof o.combo === "string" && COMBOS.has(o.combo) ? o.combo : "";
      const parts = [...xs, ...ps.map((p) => (combo ? `${combo} (${p})` : `${p} (Boost+)`))];
      extra = parts.length ? `Boost+: ${parts.join(" + ")}` : "";
    }
  }

  const name = typeof body.name === "string"
    ? body.name.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 40)
    : "";
  const signature = typeof body.sig === "string" && SIGNATURES.has(body.sig) ? body.sig : "";
  const lang = body.lang === "ro" ? "RO" : "EN";

  const ip = context?.ip || request.headers.get("x-nf-client-connection-ip") || "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) return json({ ok: false, error: "slow_down" }, 429);
  hits.push(now);
  recent.set(ip, hits);

  const token = Netlify.env.get("MENU_TELEGRAM_BOT_TOKEN");
  const chatId = Netlify.env.get("MENU_TELEGRAM_CHAT_ID");
  if (!token || !chatId) return json({ ok: false, error: "not_configured" }, 503);

  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Bucharest", hour: "2-digit", minute: "2-digit",
  }).format(new Date());

  const lines = [
    `🥤 MENU ORDER · ${time}`,
    `👤 ${name || "(no name)"} · ${lang}`,
    signature ? `⭐ ${signature}` : "",
    `Base: ${bases.join(" + ")}${bases.length > 1 ? " (half/half)" : ""}`,
    syrups.length ? `Syrup: ${syrups.join(" + ")}` : "",
    toppings.length ? `Topping: ${toppings.join(" + ")}` : "",
    drink,
    extra,
  ].filter(Boolean);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
    });
    if (!res.ok) return json({ ok: false, error: "send_failed" }, 502);
  } catch {
    return json({ ok: false, error: "send_failed" }, 502);
  }
  return json({ ok: true });
};

export const config = {
  path: "/api/menu-order",
};
