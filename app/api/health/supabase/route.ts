import {NextResponse} from "next/server";
import {getSupabasePublicEnv} from "@/lib/supabase/public-env";

/** Safe diagnostics for Vercel env (no secrets). */
export async function GET() {
  const env = getSupabasePublicEnv();
  if (!env) {
    return NextResponse.json({
      configured: false,
      hint: "Set NEXT_PUBLIC_SUPABASE_URL to https://<ref>.supabase.co and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy.",
    });
  }
  let hostname = "";
  try {
    hostname = new URL(env.url).hostname;
  } catch {
    hostname = "invalid";
  }
  return NextResponse.json({configured: true, supabaseHost: hostname});
}
