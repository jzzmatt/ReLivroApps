import {createClient} from "@supabase/supabase-js";
import {getSupabasePublicEnv} from "@/lib/supabase/public-env";

/** Server-only client. Returns null when the service role key is not set. */
export function createAdminClient() {
  const env = getSupabasePublicEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!env || !key) return null;
  return createClient(env.url, key, {
    auth: {persistSession: false, autoRefreshToken: false},
  });
}
