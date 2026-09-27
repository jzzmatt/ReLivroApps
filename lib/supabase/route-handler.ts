import {createServerClient} from "@supabase/ssr";
import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {supabaseAuthCookieOptions} from "@/lib/supabase/cookie-options";
import {getSupabaseClientEnv} from "@/lib/supabase/public-env";

/**
 * Supabase client for Route Handlers (e.g. /auth/callback).
 * Reads PKCE verifier from request cookies and writes session cookies on the response.
 */
export function createRouteHandlerSupabaseClient(request: NextRequest) {
  const {url, anonKey} = getSupabaseClientEnv();
  let response = NextResponse.next({request: {headers: request.headers}});

  const supabase = createServerClient(url, anonKey, {
    cookieOptions: supabaseAuthCookieOptions(),
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({name, value}) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({request: {headers: request.headers}});
        cookiesToSet.forEach(({name, value, options}) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  return {supabase, getCookieResponse: () => response};
}

/** Copy Supabase auth cookies onto a redirect (or other) response. */
export function applySupabaseCookiesToResponse(
  source: NextResponse,
  target: NextResponse,
): NextResponse {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
  return target;
}
