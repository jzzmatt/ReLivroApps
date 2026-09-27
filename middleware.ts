import {type NextRequest, NextResponse} from "next/server";
import {createServerClient} from "@supabase/ssr";
import {supabaseAuthCookieOptions} from "@/lib/supabase/cookie-options";
import {getSupabasePublicEnv} from "@/lib/supabase/public-env";

export async function middleware(request: NextRequest) {
  const {pathname, searchParams} = request.nextUrl;

  // Supabase sometimes redirects to Site URL (/) with ?code= when /auth/callback
  // is missing from Redirect URLs — forward to the app callback route.
  if (pathname !== "/auth/callback") {
    const code = searchParams.get("code");
    if (code) {
      const callbackUrl = request.nextUrl.clone();
      callbackUrl.pathname = "/auth/callback";
      return NextResponse.redirect(callbackUrl);
    }
    const oauthError = searchParams.get("error_description") || searchParams.get("error");
    // Only forward OAuth errors from the site root — redirecting /auth → /auth loops (ERR_TOO_MANY_REDIRECTS).
    if (oauthError && pathname === "/") {
      const authUrl = request.nextUrl.clone();
      authUrl.pathname = "/auth";
      authUrl.searchParams.delete("code");
      authUrl.searchParams.delete("error");
      authUrl.searchParams.delete("error_code");
      authUrl.searchParams.delete("error_description");
      authUrl.searchParams.set("error", oauthError);
      return NextResponse.redirect(authUrl);
    }
  }

  const env = getSupabasePublicEnv();
  if (!env) {
    return NextResponse.next();
  }

  let response = NextResponse.next({request: {headers: request.headers}});

  try {
    const supabase = createServerClient(env.url, env.anonKey, {
      cookieOptions: supabaseAuthCookieOptions(),
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({name, value}) => request.cookies.set(name, value));
          response = NextResponse.next({request});
          cookiesToSet.forEach(({name, value, options}) => response.cookies.set(name, value, options));
        },
      },
    });
    await supabase.auth.getUser();
  } catch {
    // Do not fail the whole site if session refresh fails (misconfigured env, network, etc.)
    return NextResponse.next();
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
