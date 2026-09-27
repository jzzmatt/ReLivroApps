import type {MetadataRoute} from "next";
import {buildDynamicSitemap} from "@/lib/sitemap-entries";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://relivroapps.vercel.app").replace(
  /\/$/,
  "",
);

/** Include live listings when Supabase is configured (request-time). */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildDynamicSitemap(siteUrl);
}
