import type {CookieOptions} from "@supabase/ssr";

/** Shared auth cookie options so browser OAuth (PKCE) and server callback agree. */
export function supabaseAuthCookieOptions(): CookieOptions {
  return {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}
