import {getSiteUrl} from "@/lib/site-url";

export function MarketplaceItemListJsonLd({
  books,
}: {
  books: {id: string; title: string}[];
}) {
  if (!books.length) return null;

  const base = getSiteUrl();
  const payload = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: `${base}/books`,
    numberOfItems: books.length,
    itemListElement: books.map((book, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${base}/books/${book.id}`,
      name: book.title,
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(payload)}} />
  );
}
