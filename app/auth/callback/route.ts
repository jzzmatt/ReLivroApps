import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {sanitizeAuthRedirect} from "@/lib/auth-redirect";
import {
  applySupabaseCookiesToResponse,
  createRouteHandlerSupabaseClient,
} from "@/lib/supabase/route-handler";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const authError =
    requestUrl.searchParams.get("error_description") || requestUrl.searchParams.get("error");

  if (authError) {
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(authError)}`, requestUrl.origin),
    );
  }

  const destination = sanitizeAuthRedirect(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL(destination, requestUrl.origin));
  }

  const {supabase, getCookieResponse} = createRouteHandlerSupabaseClient(request);
  const {error} = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(error.message)}`, requestUrl.origin),
    );
  }

  const redirectResponse = NextResponse.redirect(new URL(destination, requestUrl.origin));
  return applySupabaseCookiesToResponse(getCookieResponse(), redirectResponse);
}
