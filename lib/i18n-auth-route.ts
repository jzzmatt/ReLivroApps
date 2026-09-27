import type {Locale} from "@/lib/i18n";

export const authRouteMessages = {
  pt: {
    title: "Entrar ou criar conta",
    description:
      "Inicie sessão no ReLivroApps com email ou Google para comprar, vender e trocar livros escolares.",
  },
  fr: {
    title: "Connexion ou création de compte",
    description:
      "Connectez-vous à ReLivroApps par e-mail ou Google pour acheter, vendre et échanger des livres scolaires.",
  },
  en: {
    title: "Sign in or create account",
    description:
      "Sign in to ReLivroApps with email or Google to buy, sell and exchange school books.",
  },
} as const satisfies Record<Locale, unknown>;

export function authRouteT(locale: Locale) {
  return authRouteMessages[locale] ?? authRouteMessages.pt;
}
