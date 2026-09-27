import type {Locale} from "@/lib/i18n";

export const breadcrumbMessages = {
  pt: {
    books: "Livros",
  },
  fr: {
    books: "Livres",
  },
  en: {
    books: "Books",
  },
} as const satisfies Record<Locale, unknown>;

export function breadcrumbsT(locale: Locale) {
  return breadcrumbMessages[locale] ?? breadcrumbMessages.pt;
}
