import {createClient} from "@supabase/supabase-js";
import {getSupabaseClientEnv, isSupabaseConfigured} from "@/lib/supabase/public-env";

/** Read-only Supabase client for sitemap generation (no request cookies). */
export function createSitemapClient() {
  if (!isSupabaseConfigured()) return null;
  const {url, anonKey} = getSupabaseClientEnv();
  return createClient(url, anonKey);
}
