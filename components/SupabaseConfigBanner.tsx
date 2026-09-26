"use client";

import {shellT} from "@/lib/i18n-shell";
import {isSupabaseConfigured} from "@/lib/supabase/public-env";
import {useClientLocale} from "@/lib/use-client-locale";

/** Visible when NEXT_PUBLIC Supabase vars were not present at build time (e.g. missing on Vercel). */
export function SupabaseConfigBanner() {
  const locale = useClientLocale();
  const c = shellT(locale).supabaseConfig;

  if (isSupabaseConfigured()) return null;

  return (
    <div className="config-banner" role="alert">
      {c.lead}
      <code>NEXT_PUBLIC_SUPABASE_URL</code>
      {c.mid}
      <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
      {c.tail}
      <strong>{c.redeploy}</strong>
      {c.tailEnd}
    </div>
  );
}
