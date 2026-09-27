import {getSiteUrl} from "@/lib/site-url";

export function SellerProfileJsonLd({
  sellerId,
  name,
  description,
  imageUrl,
}: {
  sellerId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}) {
  const url = `${getSiteUrl()}/seller/${sellerId}`;
  const payload = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    mainEntity: {
      "@type": "Person",
      name,
      url,
      description: description || undefined,
      ...(imageUrl ? {image: imageUrl} : {}),
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(payload)}} />
  );
}
