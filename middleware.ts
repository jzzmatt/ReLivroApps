import {type NextRequest, NextResponse} from "next/server";
import {createServerClient} from "@supabase/ssr";

function supabaseEnv(): {url: string; anonKey: string} | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  } catch {
    return null;
  }
  return {url, anonKey};
}

export async function middleware(request: NextRequest) {
  const env = supabaseEnv();
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
