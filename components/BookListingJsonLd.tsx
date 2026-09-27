import {getSiteUrl} from "@/lib/site-url";

export function BookListingJsonLd({
  bookId,
  title,
  description,
  priceKz,
  imageUrl,
  sellerName,
}: {
  bookId: string;
  title: string;
  description?: string | null;
  priceKz: number;
  imageUrl?: string | null;
  sellerName?: string | null;
}) {
  const url = `${getSiteUrl()}/books/${bookId}`;
  const payload = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: title,
    description: description || undefined,
    url,
    ...(imageUrl ? {image: imageUrl} : {}),
    ...(sellerName
      ? {
          author: {
            "@type": "Person",
            name: sellerName,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url,
      price: priceKz,
      priceCurrency: "AOA",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(payload)}} />
  );
}
