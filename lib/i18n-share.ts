import type {Locale} from "@/lib/i18n";

export const shareMessages = {
  pt: {
    share: "Partilhar anúncio",
    shareSeller: "Partilhar perfil",
    copied: "Ligação copiada para a área de transferência.",
    emailSupport: "Contactar suporte",
  },
  fr: {
    share: "Partager l’annonce",
    shareSeller: "Partager le profil",
    copied: "Lien copié dans le presse-papiers.",
    emailSupport: "Contacter le support",
  },
  en: {
    share: "Share listing",
    shareSeller: "Share profile",
    copied: "Link copied to clipboard.",
    emailSupport: "Contact support",
  },
} as const satisfies Record<Locale, unknown>;

export type ShareLabels = {
  share: string;
  shareSeller: string;
  copied: string;
  emailSupport: string;
};

export function shareT(locale: Locale): ShareLabels {
  return shareMessages[locale] ?? shareMessages.pt;
}
