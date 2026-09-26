import type {Locale} from "@/lib/i18n";

export const siteMetadataMessages = {
  pt: {
    title: "ReLivroApps — Livros escolares para todos",
    description:
      "Marketplace mobile-first para encontrar, trocar e partilhar livros escolares em Angola.",
    keywords: ["livros escolares", "Angola", "troca de livros", "marketplace escolar"],
  },
  fr: {
    title: "ReLivroApps — Des livres scolaires pour tous",
    description:
      "Marketplace mobile-first pour trouver, échanger et partager des livres scolaires en Angola.",
    keywords: ["livres scolaires", "Angola", "échange de livres", "marketplace scolaire"],
  },
  en: {
    title: "ReLivroApps — School books for everyone",
    description:
      "Mobile-first marketplace to find, exchange and share school books in Angola.",
    keywords: ["school books", "Angola", "book exchange", "school marketplace"],
  },
} as const;

export function siteMetadataT(locale: Locale) {
  return siteMetadataMessages[locale] ?? siteMetadataMessages.pt;
}
