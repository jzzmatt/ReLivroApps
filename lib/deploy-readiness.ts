import {getSupabasePublicEnv} from "@/lib/supabase/public-env";
import {getSiteUrl} from "@/lib/site-url";
import {isClosedBeta} from "@/lib/site-mode";

/** Ordered SQL migrations shipped in this repo (apply on Supabase before beta). */
export const REQUIRED_MIGRATION_FILES = [
  "0001_relivroapps_foundation.sql",
  "0002_community_transactions.sql",
  "0003_trust_profiles_intelligence.sql",
  "0004_admin_moderation_analytics.sql",
  "0005_security_rate_limits.sql",
  "0006_analytics_observability.sql",
  "0007_storage_book_images_hardening.sql",
  "0008_google_oauth_profile_names.sql",
  "0009_seller_workspace_signals.sql",
  "0010_book_image_slots.sql",
  "0011_listing_video_and_ai.sql",
  "0012_school_verification.sql",
  "0013_payment_arrangement.sql",
  "0014_push_subscriptions.sql",
  "0015_admin_analytics_breakdown.sql",
  "0016_book_marketplace_thumbnail.sql",
] as const;

export type DeployReadinessMode = "beta" | "ga";

export type DeployReadinessReport = {
  mode: DeployReadinessMode;
  ready: boolean;
  closedBeta: boolean;
  checks: {
    supabasePublicEnv: boolean;
    siteUrl: boolean;
    siteUrlMatchesRequest?: boolean;
    openaiConfigured: boolean;
  };
  hints: string[];
  migrations: readonly string[];
};

export function getDeployReadiness(
  requestOrigin?: string | null,
  mode: DeployReadinessMode = "beta",
): DeployReadinessReport {
  const supabase = getSupabasePublicEnv();
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const hints: string[] = [];

  if (!supabase) {
    hints.push("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy.");
  }

  let siteUrlOk = Boolean(siteUrl && siteUrl.startsWith("http"));
  if (siteUrlOk && siteUrl.includes("localhost") && process.env.VERCEL === "1") {
    hints.push("NEXT_PUBLIC_SITE_URL should be your production HTTPS URL on Vercel, not localhost.");
    siteUrlOk = false;
  }

  if (!siteUrlOk) {
    hints.push("Set NEXT_PUBLIC_SITE_URL to the URL users open (no trailing slash mismatch in Supabase Auth).");
  }

  let siteUrlMatchesRequest: boolean | undefined;
  if (requestOrigin && siteUrlOk) {
    try {
      const normalizedOrigin = new URL(requestOrigin).origin;
      const normalizedSite = new URL(siteUrl).origin;
      siteUrlMatchesRequest = normalizedOrigin === normalizedSite;
      if (!siteUrlMatchesRequest) {
        hints.push(
          `Request origin (${normalizedOrigin}) differs from NEXT_PUBLIC_SITE_URL (${normalizedSite}). Update env or Supabase Auth URLs.`,
        );
      }
    } catch {
      siteUrlMatchesRequest = undefined;
    }
  }

  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY?.trim());
  if (!openaiConfigured) {
    hints.push("OPENAI_API_KEY is unset: /sell auto condition + thumbnail selection will be limited (thumbnail falls back to front cover).");
  }

  const closedBeta = isClosedBeta();

  if (mode === "beta" && closedBeta) {
    hints.push("NEXT_PUBLIC_BETA=true: closed beta (noindex). Correct for Phase 9.8.");
  }

  if (mode === "ga" && closedBeta) {
    hints.push("Set NEXT_PUBLIC_BETA=false or remove it, then redeploy before public launch (Phase 9.9).");
  }

  if (mode === "ga" && !closedBeta) {
    hints.push("Public GA mode: confirm /robots.txt allows crawl and /sitemap.xml is reachable.");
  }

  hints.push(`Apply Supabase migrations through ${REQUIRED_MIGRATION_FILES.at(-1)} before sellers publish listings.`);

  const envReady =
    Boolean(supabase) &&
    siteUrlOk &&
    (siteUrlMatchesRequest === undefined || siteUrlMatchesRequest);
  const modeReady = mode === "ga" ? !closedBeta : true;
  const ready = envReady && modeReady;

  return {
    mode,
    ready,
    closedBeta,
    checks: {
      supabasePublicEnv: Boolean(supabase),
      siteUrl: siteUrlOk,
      siteUrlMatchesRequest,
      openaiConfigured,
    },
    hints,
    migrations: REQUIRED_MIGRATION_FILES,
  };
}
