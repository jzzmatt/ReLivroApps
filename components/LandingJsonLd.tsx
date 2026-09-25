const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://relivroapps.vercel.app").replace(
  /\/$/,
  "",
);

export function LandingJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "ReLivroApps",
        url: siteUrl,
        inLanguage: ["pt-AO", "fr", "en"],
        description:
          "Marketplace mobile-first para livros escolares em Angola — comprar, vender e trocar.",
      },
      {
        "@type": "Organization",
        name: "ReLivroApps",
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(payload)}}
    />
  );
}
