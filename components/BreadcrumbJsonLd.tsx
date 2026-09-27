import type {BreadcrumbItem} from "@/components/Breadcrumbs";
import {getSiteUrl} from "@/lib/site-url";

export function BreadcrumbJsonLd({items}: {items: BreadcrumbItem[]}) {
  const base = getSiteUrl();
  const payload = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? {item: `${base}${item.href}`} : {}),
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(payload)}} />
  );
}
