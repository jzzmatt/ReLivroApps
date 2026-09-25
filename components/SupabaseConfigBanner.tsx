"use client";

import {isSupabaseConfigured} from "@/lib/supabase/public-env";

/** Visible when NEXT_PUBLIC Supabase vars were not present at build time (e.g. missing on Vercel). */
export function SupabaseConfigBanner() {
  if (isSupabaseConfigured()) return null;
  return (
    <div className="config-banner" role="alert">
      Supabase não está configurado neste deployment. Defina{" "}
      <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> na Vercel
      (Production) e faça <strong>Redeploy</strong>.
    </div>
  );
}
