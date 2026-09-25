import {type NextRequest, NextResponse} from "next/server";
import {createServerClient} from "@supabase/ssr";
import {getSupabasePublicEnv} from "@/lib/supabase/public-env";

export async function middleware(request: NextRequest) {
  const env = getSupabasePublicEnv();
  if (!env) {
    return NextResponse.next();
  }

  let response = NextResponse.next({request: {headers: request.headers}});

  try {
    const supabase = createServerClient(env.url, env.anonKey, {
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
