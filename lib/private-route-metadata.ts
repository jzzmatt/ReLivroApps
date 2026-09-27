import type {Metadata} from "next";
import {getSiteUrl} from "@/lib/site-url";

export function privateRouteMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const canonical = `${getSiteUrl()}${path}`;

  return {
    title,
    description,
    alternates: {canonical},
    robots: {index: false, follow: false},
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "ReLivroApps",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
