import type {Locale} from "@/lib/i18n";

export const phoneMockTypes = ["home", "detail", "search", "publish", "profile"] as const;
export type PhoneMockType = (typeof phoneMockTypes)[number];

export type LandingPhoneCopy = {
  titles: Record<PhoneMockType, string>;
  home: {
    search: string;
    bannerLine1: string;
    bannerLine2: string;
    chips: [string, string, string];
    cardTitle: string;
    cardMeta: string;
    cardPrice: string;
  };
  detail: {
    coverSubject: string;
    coverGrade: string;
    condition: string;
    conditionValue: string;
    subject: string;
    subjectValue: string;
    location: string;
    locationValue: string;
    contact: string;
  };
  search: {
    query: string;
    filterAll: string;
    filterSale: string;
    filterExchange: string;
    resultTitle: string;
    resultMeta: string;
    prices: [string, string, string];
  };
  publish: {
    heading: string;
    steps: [string, string, string];
    fields: [string, string, string, string, string];
    continue: string;
  };
  profile: {
    role: string;
    menu: [string, string, string, string, string, string];
    ecoTitle: string;
    ecoBody: string;
  };
};

const pt: LandingPhoneCopy = {
  titles: {
    home: "Livros que ligam estudantes",
    detail: "Matemática 10ª Classe",
    search: "32 resultados",
    publish: "Publicar livro",
    profile: "João Silva",
  },
  home: {
    search: "⌕ Pesquisar livros, disciplinas...",
    bannerLine1: "Livros que ligam",
    bannerLine2: "estudantes",
    chips: ["Matemática", "Português", "Ciências"],
    cardTitle: "Matemática 10ª Classe",
    cardMeta: "Usado · Bom estado",
    cardPrice: "8 000 Kz",
  },
  detail: {
    coverSubject: "Matemática",
    coverGrade: "10ª Classe",
    condition: "Estado",
    conditionValue: "Bom estado",
    subject: "Disciplina",
    subjectValue: "Matemática",
    location: "Localização",
    locationValue: "Lobito, Angola",
    contact: "Contactar vendedor",
  },
  search: {
    query: "⌕ Matemática 10ª classe",
    filterAll: "Todos",
    filterSale: "Venda",
    filterExchange: "Troca",
    resultTitle: "Matemática 10ª Classe",
    resultMeta: "Bom estado",
    prices: ["8 000 Kz", "6 000 Kz", "12 000 Kz"],
  },
  publish: {
    heading: "Publicar livro",
    steps: ["1 Informações", "2 Fotos", "3 Revisão"],
    fields: ["Título do livro", "Disciplina", "Classe", "Localização", "Preço (Kz)"],
    continue: "Continuar",
  },
  profile: {
    role: "Estudante",
    menu: ["Os meus anúncios", "Os meus favoritos", "Mensagens", "Compras", "Trocas", "Definições"],
    ecoTitle: "Contribua",
    ecoBody: "Uma segunda vida aos livros.",
  },
};

const fr: LandingPhoneCopy = {
  titles: {
    home: "Des livres qui relient les élèves",
    detail: "Mathématiques 10e",
    search: "32 résultats",
    publish: "Publier un livre",
    profile: "João Silva",
  },
  home: {
    search: "⌕ Rechercher livres, matières...",
    bannerLine1: "Des livres qui",
    bannerLine2: "relient",
    chips: ["Mathématiques", "Portugais", "Sciences"],
    cardTitle: "Mathématiques 10e",
    cardMeta: "Usagé · Bon état",
    cardPrice: "8 000 Kz",
  },
  detail: {
    coverSubject: "Mathématiques",
    coverGrade: "10e",
    condition: "État",
    conditionValue: "Bon état",
    subject: "Matière",
    subjectValue: "Mathématiques",
    location: "Localisation",
    locationValue: "Lobito, Angola",
    contact: "Contacter le vendeur",
  },
  search: {
    query: "⌕ Mathématiques 10e",
    filterAll: "Tous",
    filterSale: "Vente",
    filterExchange: "Échange",
    resultTitle: "Mathématiques 10e",
    resultMeta: "Bon état",
    prices: ["8 000 Kz", "6 000 Kz", "12 000 Kz"],
  },
  publish: {
    heading: "Publier un livre",
    steps: ["1 Infos", "2 Photos", "3 Révision"],
    fields: ["Titre du livre", "Matière", "Classe", "Lieu", "Prix (Kz)"],
    continue: "Continuer",
  },
  profile: {
    role: "Élève",
    menu: ["Mes annonces", "Mes favoris", "Messages", "Achats", "Échanges", "Réglages"],
    ecoTitle: "Contribuez",
    ecoBody: "Une seconde vie pour les livres.",
  },
};

const en: LandingPhoneCopy = {
  titles: {
    home: "Books that connect students",
    detail: "Mathematics Grade 10",
    search: "32 results",
    publish: "Publish a book",
    profile: "João Silva",
  },
  home: {
    search: "⌕ Search books, subjects...",
    bannerLine1: "Books that",
    bannerLine2: "connect students",
    chips: ["Mathematics", "Portuguese", "Science"],
    cardTitle: "Mathematics Grade 10",
    cardMeta: "Used · Good condition",
    cardPrice: "8 000 Kz",
  },
  detail: {
    coverSubject: "Mathematics",
    coverGrade: "Grade 10",
    condition: "Condition",
    conditionValue: "Good condition",
    subject: "Subject",
    subjectValue: "Mathematics",
    location: "Location",
    locationValue: "Lobito, Angola",
    contact: "Contact seller",
  },
  search: {
    query: "⌕ Mathematics grade 10",
    filterAll: "All",
    filterSale: "Sale",
    filterExchange: "Exchange",
    resultTitle: "Mathematics Grade 10",
    resultMeta: "Good condition",
    prices: ["8 000 Kz", "6 000 Kz", "12 000 Kz"],
  },
  publish: {
    heading: "Publish a book",
    steps: ["1 Details", "2 Photos", "3 Review"],
    fields: ["Book title", "Subject", "Grade", "Location", "Price (Kz)"],
    continue: "Continue",
  },
  profile: {
    role: "Student",
    menu: ["My listings", "My favourites", "Messages", "Purchases", "Exchanges", "Settings"],
    ecoTitle: "Contribute",
    ecoBody: "A second life for books.",
  },
};

export const landingPhoneMessages = {pt, fr, en} as const satisfies Record<Locale, LandingPhoneCopy>;

export function landingPhonesT(locale: Locale): LandingPhoneCopy {
  return landingPhoneMessages[locale] ?? landingPhoneMessages.pt;
}
