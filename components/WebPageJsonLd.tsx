import {getSiteUrl} from "@/lib/site-url";

export function WebPageJsonLd({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  const url = `${getSiteUrl()}${path}`;
  const payload = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "ReLivroApps",
      url: getSiteUrl(),
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(payload)}} />
  );
}
