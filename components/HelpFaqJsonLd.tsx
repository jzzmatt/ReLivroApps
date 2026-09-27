export function HelpFaqJsonLd({
  faqs,
}: {
  faqs: {q: string; a: string}[];
}) {
  if (!faqs.length) return null;

  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(payload)}} />
  );
}
