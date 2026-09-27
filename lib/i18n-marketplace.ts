import type {Locale} from "@/lib/i18n";
import type {BookCondition, ListingMode} from "@/lib/books";

export const marketplaceMessages = {
  pt: {
    searchPlaceholder: "Pesquisar por título, disciplina ou localização...",
    all: "Todos",
    sortRecent: "Mais recentes",
    viewBook: "Ver livro →",
    seller: "Vendedor",
    sellerDefault: "Membro ReLivroApps",
    defaultCountry: "Angola",
    modes: {Venda: "Venda", Troca: "Troca", Oferta: "Oferta"} as Record<ListingMode, string>,
    conditions: {
      "Como novo": "Como novo",
      "Muito bom": "Muito bom",
      "Bom estado": "Bom estado",
      Usado: "Usado",
    } as Record<BookCondition, string>,
    report: {
      prompt: "Por que pretende denunciar este anúncio?",
      validation: "A denúncia deve ter entre 3 e 120 caracteres.",
      thanks: "Obrigado. O anúncio foi enviado para análise.",
      button: "Denunciar anúncio",
      busy: "A enviar...",
    },
  },
  fr: {
    searchPlaceholder: "Rechercher par titre, matière ou lieu...",
    all: "Tous",
    sortRecent: "Plus récents",
    viewBook: "Voir le livre →",
    seller: "Vendeur",
    sellerDefault: "Membre ReLivroApps",
    defaultCountry: "Angola",
    modes: {Venda: "Vente", Troca: "Échange", Oferta: "Offre"} as Record<ListingMode, string>,
    conditions: {
      "Como novo": "Comme neuf",
      "Muito bom": "Très bon",
      "Bom estado": "Bon état",
      Usado: "Usagé",
    } as Record<BookCondition, string>,
    report: {
      prompt: "Pourquoi signalez-vous cette annonce ?",
      validation: "Le signalement doit contenir entre 3 et 120 caractères.",
      thanks: "Merci. L’annonce a été envoyée pour examen.",
      button: "Signaler l’annonce",
      busy: "Envoi...",
    },
  },
  en: {
    searchPlaceholder: "Search by title, subject or location...",
    all: "All",
    sortRecent: "Most recent",
    viewBook: "View book →",
    seller: "Seller",
    sellerDefault: "ReLivroApps member",
    defaultCountry: "Angola",
    modes: {Venda: "Sale", Troca: "Exchange", Oferta: "Offer"} as Record<ListingMode, string>,
    conditions: {
      "Como novo": "Like new",
      "Muito bom": "Very good",
      "Bom estado": "Good condition",
      Usado: "Used",
    } as Record<BookCondition, string>,
    report: {
      prompt: "Why are you reporting this listing?",
      validation: "The report must be between 3 and 120 characters.",
      thanks: "Thank you. The listing was sent for review.",
      button: "Report listing",
      busy: "Sending...",
    },
  },
} as const satisfies Record<Locale, unknown>;

export type MarketplaceLabels = (typeof marketplaceMessages)[Locale];

export function marketplaceT(locale: Locale): MarketplaceLabels {
  return marketplaceMessages[locale] ?? marketplaceMessages.pt;
}

/** Client-safe (not passed from RSC props). */
export function formatMarketplaceResults(locale: Locale, count: number): string {
  if (locale === "fr") {
    return `${count} livre${count === 1 ? "" : "s"} trouvé${count === 1 ? "" : "s"}`;
  }
  if (locale === "en") {
    return `${count} book${count === 1 ? "" : "s"} found`;
  }
  return `${count} livros encontrados`;
}
