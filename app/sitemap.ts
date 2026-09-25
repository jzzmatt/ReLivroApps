import type {MetadataRoute} from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://relivroapps.vercel.app").replace(
  /\/$/,
  "",
);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = ["/", "/books", "/auth", "/sell", "/privacidade", "/termos"];

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
