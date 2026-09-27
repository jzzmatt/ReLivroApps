import type {Locale} from "@/lib/i18n";

export const sellRouteMessages = {
  pt: {
    title: "Publicar livro",
    description:
      "Crie um anúncio de livro escolar no ReLivroApps: fotos, preço, localização e modo de venda ou troca.",
  },
  fr: {
    title: "Publier un livre",
    description:
      "Créez une annonce de livre scolaire sur ReLivroApps : photos, prix, lieu et mode vente ou échange.",
  },
  en: {
    title: "Publish a book",
    description:
      "Create a school book listing on ReLivroApps: photos, price, location, and sale or exchange mode.",
  },
} as const satisfies Record<Locale, unknown>;

export function sellRouteT(locale: Locale) {
  return sellRouteMessages[locale] ?? sellRouteMessages.pt;
}
