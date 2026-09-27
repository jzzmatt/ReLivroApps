import type {Locale} from "@/lib/i18n";

export const breadcrumbMessages = {
  pt: {
    home: "Início",
    books: "Livros",
    help: "Ajuda",
  },
  fr: {
    home: "Accueil",
    books: "Livres",
    help: "Aide",
  },
  en: {
    home: "Home",
    books: "Books",
    help: "Help",
  },
} as const satisfies Record<Locale, unknown>;

export function breadcrumbsT(locale: Locale) {
  return breadcrumbMessages[locale] ?? breadcrumbMessages.pt;
}
