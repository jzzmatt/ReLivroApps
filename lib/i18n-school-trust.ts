import type {Locale} from "@/lib/i18n";

export const schoolTrustMessages = {
  pt: {
    badge: "Comunidade escolar",
    hint: "Escola indicada no perfil — informação declarada pelo utilizador, não verificada pela ReLivroApps.",
  },
  fr: {
    badge: "Communauté scolaire",
    hint: "École indiquée sur le profil — information déclarée par l’utilisateur, non vérifiée par ReLivroApps.",
  },
  en: {
    badge: "School community",
    hint: "School listed on profile — self-declared by the member, not verified by ReLivroApps.",
  },
} as const satisfies Record<Locale, unknown>;

export function schoolTrustT(locale: Locale) {
  return schoolTrustMessages[locale] ?? schoolTrustMessages.pt;
}
