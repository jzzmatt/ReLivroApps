import type {MetadataRoute} from "next";
import {isClosedBeta, PRIVATE_ROBOTS_PATHS} from "@/lib/site-mode";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://relivroapps.vercel.app").replace(
  /\/$/,
  "",
);

export default function robots(): MetadataRoute.Robots {
  if (isClosedBeta()) {
    return {
      rules: {userAgent: "*", disallow: "/"},
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...PRIVATE_ROBOTS_PATHS],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
