// Build-time guard. Runtime credentials must also include Netlify Functions scope.
// CLI deploys that skip the build need the same explicit preflight.
export function checkBookingConfig(env) {
  const required = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'GOOGLE_SERVICE_ACCOUNT_JSON', 'GOOGLE_CALENDAR_ID'];
  const missing = required.filter(name => !env[name]?.trim());
  if (missing.length) throw new Error(`Booking configuration missing in ${env.CONTEXT || 'selected context'}: ${missing.join(', ')}. Set this context in Netlify; preview values do not populate production.`);
  let credentials;
  try { credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON); }
  catch { throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON must contain valid JSON.'); }
  if (!credentials.client_email || !credentials.private_key?.includes('BEGIN PRIVATE KEY')) {
    throw new Error('Google service account needs client_email and a PEM private_key.');
  }
  if (!/^https:\/\/[^/]+\.supabase\.co\/?$/.test(env.SUPABASE_URL)) {
    throw new Error('SUPABASE_URL must be the HTTPS Supabase project URL.');
  }
  if (!env.SUPABASE_SECRET_KEY.startsWith('sb_secret_') && !env.SUPABASE_SECRET_KEY.startsWith('eyJ')) {
    throw new Error('SUPABASE_SECRET_KEY must be a server secret or legacy service-role key.');
  }
}
