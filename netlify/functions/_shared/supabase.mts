declare const Netlify: {
  env: { get(name: string): string | undefined };
};
type JsonRecord = Record<string, unknown>;

export class SupabaseRpcError extends Error {
  apiCode: string;
  apiMessage: string;

  constructor(name: string, status: number, apiCode: string, apiMessage: string) {
    super(`Supabase RPC ${name} failed (${apiCode || `HTTP_${status}`})`);
    this.name = "SupabaseRpcError";
    this.apiCode = apiCode;
    this.apiMessage = apiMessage;
  }
}

export const supabaseRpc = async (name: string, body: JsonRecord): Promise<unknown> => {
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
    const details = typeof parsed === "object" && parsed ? parsed as JsonRecord : {};
    throw new SupabaseRpcError(
      name,
      response.status,
      typeof details.code === "string" ? details.code : `HTTP_${response.status}`,
      typeof details.message === "string" ? details.message : "",
    );
  }
  return parsed;
};
