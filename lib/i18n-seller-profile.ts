import type {Locale} from "@/lib/i18n";

export const sellerProfileMessages = {
  pt: {
    eyebrow: "VENDEDOR",
    listingsTitle: "Anúncios activos",
    listingsEmpty: "Este vendedor não tem anúncios publicados de momento.",
    memberSince: "Membro desde",
    viewProfile: "Ver perfil do vendedor",
    metaTitle: "Vendedor",
    metaDescription: "Perfil público, anúncios e avaliações no ReLivroApps.",
    notFound: "Vendedor não encontrado.",
  },
  fr: {
    eyebrow: "VENDEUR",
    listingsTitle: "Annonces actives",
    listingsEmpty: "Ce vendeur n’a pas d’annonces publiées pour le moment.",
    memberSince: "Membre depuis",
    viewProfile: "Voir le profil du vendeur",
    metaTitle: "Vendeur",
    metaDescription: "Profil public, annonces et avis sur ReLivroApps.",
    notFound: "Vendeur introuvable.",
  },
  en: {
    eyebrow: "SELLER",
    listingsTitle: "Active listings",
    listingsEmpty: "This seller has no published listings right now.",
    memberSince: "Member since",
    viewProfile: "View seller profile",
    metaTitle: "Seller",
    metaDescription: "Public profile, listings and reviews on ReLivroApps.",
    notFound: "Seller not found.",
  },
} as const satisfies Record<Locale, unknown>;

export function sellerProfileT(locale: Locale) {
  return sellerProfileMessages[locale] ?? sellerProfileMessages.pt;
}
