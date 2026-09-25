import type {Locale} from "@/lib/i18n";

export const landingMessages = {
  pt: {
    phonesAria: "Pré-visualização das telas móveis do ReLivroApps",
    features: {
      eyebrow: "UMA EXPERIÊNCIA SIMPLES",
      title: "Encontre. Escolha. Partilhe.",
      cards: [
        {title: "Encontre", body: "Encontrar livros de todas as disciplinas e classes."},
        {title: "Compre ou troque", body: "Comprar ou trocar de forma segura e ao melhor preço."},
        {title: "Conecte-se", body: "Conectar-se com estudantes da sua escola e região."},
      ],
    },
    community: {
      eyebrow: "UMA REDE LOCAL",
      title: "Uma segunda vida aos livros.",
      body: "Uma experiência pensada para estudantes, famílias e comunidades em Angola.",
      stats: ["Descubra", "Escolha", "Partilhe"],
    },
    cta: {
      eyebrow: "RELIVROAPPS",
      title: "O seu próximo livro pode estar mais perto do que imagina.",
      button: "Explorar livros",
    },
  },
  fr: {
    phonesAria: "Aperçu des écrans mobiles ReLivroApps",
    features: {
      eyebrow: "UNE EXPÉRIENCE SIMPLE",
      title: "Trouvez. Choisissez. Partagez.",
      cards: [
        {title: "Trouvez", body: "Des livres de toutes les matières et classes."},
        {title: "Achetez ou échangez", body: "En toute sécurité et au meilleur prix."},
        {title: "Connectez-vous", body: "Avec des élèves de votre école et région."},
      ],
    },
    community: {
      eyebrow: "UN RÉSEAU LOCAL",
      title: "Une seconde vie pour les livres.",
      body: "Pensé pour les élèves, les familles et les communautés.",
      stats: ["Découvrez", "Choisissez", "Partagez"],
    },
    cta: {
      eyebrow: "RELIVROAPPS",
      title: "Votre prochain livre est peut-être plus proche que vous ne le pensez.",
      button: "Explorer les livres",
    },
  },
  en: {
    phonesAria: "Preview of ReLivroApps mobile screens",
    features: {
      eyebrow: "A SIMPLE EXPERIENCE",
      title: "Find. Choose. Share.",
      cards: [
        {title: "Find", body: "Books across subjects and grade levels."},
        {title: "Buy or exchange", body: "Safely and at a fair price."},
        {title: "Connect", body: "With students at your school and in your area."},
      ],
    },
    community: {
      eyebrow: "A LOCAL NETWORK",
      title: "A second life for books.",
      body: "Built for students, families and communities in Angola.",
      stats: ["Discover", "Choose", "Share"],
    },
    cta: {
      eyebrow: "RELIVROAPPS",
      title: "Your next book may be closer than you think.",
      button: "Explore books",
    },
  },
} as const satisfies Record<Locale, unknown>;

export function landingT(locale: Locale) {
  return landingMessages[locale] ?? landingMessages.pt;
}
