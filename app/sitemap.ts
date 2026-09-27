import type {MetadataRoute} from "next";
import {buildSitemapById, sitemapIdsForBooks} from "@/lib/sitemap-entries";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://relivroapps.vercel.app").replace(
  /\/$/,
  "",
);

export const dynamic = "force-dynamic";

export async function generateSitemaps() {
  return sitemapIdsForBooks();
}

export default async function sitemap(props: {
  id: Promise<number>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  return buildSitemapById(siteUrl, Number.isFinite(id) ? id : 0);
}
