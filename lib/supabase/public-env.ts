/** Public Supabase config. NEXT_PUBLIC_* must be set in Vercel before build (then redeploy). */
const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.placeholder";

export function getSupabasePublicEnv(): {url: string; anonKey: string} | null {
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

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv() !== null;
}

/** Values for client construction — real env or inert placeholders (avoids @supabase/ssr throw). */
export function getSupabaseClientEnv(): {url: string; anonKey: string} {
  return getSupabasePublicEnv() ?? {url: PLACEHOLDER_URL, anonKey: PLACEHOLDER_ANON_KEY};
}
