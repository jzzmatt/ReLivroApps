import type {Locale} from "@/lib/i18n";
import type {BookCondition, ListingMode} from "@/lib/books";

export const marketplaceMessages = {
  pt: {
    searchPlaceholder: "Pesquisar por título, disciplina ou localização...",
    all: "Todos",
    results: (n: number) => `${n} livros encontrados`,
    sortRecent: "Mais recentes",
    viewBook: "Ver livro →",
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
    results: (n: number) => `${n} livre${n === 1 ? "" : "s"} trouvé${n === 1 ? "" : "s"}`,
    sortRecent: "Plus récents",
    viewBook: "Voir le livre →",
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
    results: (n: number) => `${n} book${n === 1 ? "" : "s"} found`,
    sortRecent: "Most recent",
    viewBook: "View book →",
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

export type MarketplaceLabels = ReturnType<typeof marketplaceT>;

export function marketplaceT(locale: Locale) {
  return marketplaceMessages[locale] ?? marketplaceMessages.pt;
}
