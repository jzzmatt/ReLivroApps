import type {Locale} from "@/lib/i18n";

export const breadcrumbMessages = {
  pt: {
    home: "Início",
    books: "Livros",
    help: "Ajuda",
    privacy: "Privacidade",
    terms: "Termos",
  },
  fr: {
    home: "Accueil",
    books: "Livres",
    help: "Aide",
    privacy: "Confidentialité",
    terms: "Conditions",
  },
  en: {
    home: "Home",
    books: "Books",
    help: "Help",
    privacy: "Privacy",
    terms: "Terms",
  },
} as const satisfies Record<Locale, unknown>;

export function breadcrumbsT(locale: Locale) {
  return breadcrumbMessages[locale] ?? breadcrumbMessages.pt;
}
