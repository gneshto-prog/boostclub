// Never include request headers, credentials or upstream bodies in errors/logs.
export async function upstreamJson<T>(url: string, init: RequestInit, service: string, timeoutMs = 8000): Promise<{ response: Response; body: T }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const body = await response.json() as T;
    return { response, body };
  } catch (error) {
    if (controller.signal.aborted) throw new Error(`${service}_TIMEOUT`);
    if (error instanceof SyntaxError) throw new Error(`${service}_INVALID_RESPONSE`);
    throw new Error(`${service}_NETWORK_ERROR`);
  } finally {
    clearTimeout(timer);
  }
}
