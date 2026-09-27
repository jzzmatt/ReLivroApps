import {createBrowserClient} from "@supabase/ssr";
import {supabaseAuthCookieOptions} from "@/lib/supabase/cookie-options";
import {getSupabaseClientEnv} from "@/lib/supabase/public-env";

export function createClient() {
  const {url, anonKey} = getSupabaseClientEnv();
  return createBrowserClient(url, anonKey, {
    cookieOptions: supabaseAuthCookieOptions(),
  });
}
