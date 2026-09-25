import type {MetadataRoute} from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://relivroapps.vercel.app").replace(
  /\/$/,
  "",
);

const isBeta = process.env.NEXT_PUBLIC_BETA === "true";

export default function robots(): MetadataRoute.Robots {
  if (isBeta) {
    return {
      rules: {userAgent: "*", disallow: "/"},
    };
  }

  return {
    rules: {userAgent: "*", allow: "/"},
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
