import type {Locale} from "@/lib/i18n";

export const whatsappShareMessages = {
  pt: {
    headline: "📚 *Encontrei este livro no ReLivroApps!*",
    classLabel: "Classe",
    locationLabel: "Localização",
    priceLabel: "Preço",
    cta: "✨ Confira este livro no ReLivroApps:",
    viewBook: "Ver livro",
    button: "Partilhar no WhatsApp",
  },
  fr: {
    headline: "📚 *J’ai trouvé ce livre sur ReLivroApps !*",
    classLabel: "Classe",
    locationLabel: "Localisation",
    priceLabel: "Prix",
    cta: "✨ Découvrez ce livre sur ReLivroApps :",
    viewBook: "Voir le livre",
    button: "Partager sur WhatsApp",
  },
  en: {
    headline: "📚 *I found this book on ReLivroApps!*",
    classLabel: "Class",
    locationLabel: "Location",
    priceLabel: "Price",
    cta: "✨ See this book on ReLivroApps:",
    viewBook: "View book",
    button: "Share on WhatsApp",
  },
} as const satisfies Record<Locale, unknown>;

export type WhatsAppShareLabels = (typeof whatsappShareMessages)[Locale];

export function whatsappShareT(locale: Locale): WhatsAppShareLabels {
  return whatsappShareMessages[locale] ?? whatsappShareMessages.pt;
}
