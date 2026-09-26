import {demoUuid} from "./demo-uuid";

export type DemoFavorite = {userKey: string; bookKey: string};
export type DemoConversation = {key: string; bookKey: string; buyerKey: string};
export type DemoMessage = {key: string; conversationKey: string; senderKey: string; body: string; read: boolean};
export type DemoReview = {key: string; sellerKey: string; reviewerKey: string; bookKey: string; rating: number; comment: string};
export type DemoReport = {key: string; bookKey: string; reporterKey: string; reason: string; details: string; resolved: boolean};

export const DEMO_FAVORITES: DemoFavorite[] = [
  {userKey: "ana", bookKey: "book-010"},
  {userKey: "ana", bookKey: "book-008"},
  {userKey: "joao", bookKey: "book-004"},
  {userKey: "carlos", bookKey: "book-010"},
  {userKey: "maria", bookKey: "book-009"},
  {userKey: "rui", bookKey: "book-011"},
  {userKey: "teresa", bookKey: "book-012"},
  {userKey: "antonio", bookKey: "book-016"},
  {userKey: "helena", bookKey: "book-015"},
  {userKey: "sandra", bookKey: "book-007"},
  {userKey: "pedro", bookKey: "book-013"},
  {userKey: "paulo", bookKey: "book-021"},
  {userKey: "ines", bookKey: "book-006"},
  {userKey: "lucia", bookKey: "book-014"},
  {userKey: "miguel", bookKey: "book-001"},
];

export const DEMO_CONVERSATIONS: DemoConversation[] = [
  {key: "conv-01", bookKey: "book-010", buyerKey: "ana"},
  {key: "conv-02", bookKey: "book-008", buyerKey: "joao"},
  {key: "conv-03", bookKey: "book-009", buyerKey: "carlos"},
  {key: "conv-04", bookKey: "book-011", buyerKey: "rui"},
  {key: "conv-05", bookKey: "book-012", buyerKey: "teresa"},
  {key: "conv-06", bookKey: "book-014", buyerKey: "antonio"},
  {key: "conv-07", bookKey: "book-004", buyerKey: "maria"},
  {key: "conv-08", bookKey: "book-016", buyerKey: "helena"},
  {key: "conv-09", bookKey: "book-007", buyerKey: "sandra"},
  {key: "conv-10", bookKey: "book-001", buyerKey: "paulo"},
];

export const DEMO_MESSAGES: DemoMessage[] = [
  {key: "msg-01", conversationKey: "conv-01", senderKey: "ana", body: "Olá, ainda está disponível?", read: true},
  {key: "msg-02", conversationKey: "conv-01", senderKey: "lucia", body: "Sim, ainda está disponível.", read: true},
  {key: "msg-03", conversationKey: "conv-01", senderKey: "ana", body: "Podemos combinar a entrega em Talatona?", read: false},
  {key: "msg-04", conversationKey: "conv-02", senderKey: "joao", body: "Bom dia! Qual o estado das capas?", read: true},
  {key: "msg-05", conversationKey: "conv-02", senderKey: "miguel", body: "Estão boas, apenas ligeiro desgaste.", read: false},
  {key: "msg-06", conversationKey: "conv-03", senderKey: "carlos", body: "Aceita troca por manual de História?", read: true},
  {key: "msg-07", conversationKey: "conv-03", senderKey: "maria", body: "Sim, podemos combinar.", read: true},
  {key: "msg-08", conversationKey: "conv-04", senderKey: "rui", body: "Qual o preço final com entrega?", read: false},
  {key: "msg-09", conversationKey: "conv-05", senderKey: "teresa", body: "Obrigada pelo anúncio!", read: true},
  {key: "msg-10", conversationKey: "conv-05", senderKey: "lucia", body: "De nada — avise quando quiser recolher.", read: true},
  {key: "msg-11", conversationKey: "conv-06", senderKey: "antonio", body: "Ainda tem o livro de História?", read: true},
  {key: "msg-12", conversationKey: "conv-06", senderKey: "lucia", body: "Sim, disponível.", read: false},
  {key: "msg-13", conversationKey: "conv-07", senderKey: "maria", body: "Podemos falar amanhã?", read: true},
  {key: "msg-14", conversationKey: "conv-07", senderKey: "miguel", body: "Claro, envio mensagem de manhã.", read: true},
  {key: "msg-15", conversationKey: "conv-08", senderKey: "helena", body: "Interesso-me na troca.", read: false},
  {key: "msg-16", conversationKey: "conv-09", senderKey: "sandra", body: "Olá! O livro ainda está em oferta?", read: true},
  {key: "msg-17", conversationKey: "conv-09", senderKey: "lucia", body: "Sim, oferta activa.", read: true},
  {key: "msg-18", conversationKey: "conv-10", senderKey: "paulo", body: "Boa tarde — posso ver o livro ao fim de semana?", read: true},
  {key: "msg-19", conversationKey: "conv-10", senderKey: "lucia", body: "Sim, combinamos sábado.", read: false},
  {key: "msg-20", conversationKey: "conv-02", senderKey: "joao", body: "Perfeito, obrigado!", read: false},
  {key: "msg-21", conversationKey: "conv-04", senderKey: "miguel", body: "Entrega possível no Lobito centro.", read: false},
  {key: "msg-22", conversationKey: "conv-01", senderKey: "lucia", body: "Talatona funciona — sábado à tarde?", read: false},
  {key: "msg-23", conversationKey: "conv-03", senderKey: "carlos", body: "Combinado então.", read: true},
  {key: "msg-24", conversationKey: "conv-07", senderKey: "maria", body: "Até amanhã!", read: false},
  {key: "msg-25", conversationKey: "conv-08", senderKey: "lucia", body: "Troca válida para manual de Geografia.", read: false},
  {key: "msg-26", conversationKey: "conv-05", senderKey: "teresa", body: "Vou partilhar com uma colega.", read: false},
  {key: "msg-27", conversationKey: "conv-06", senderKey: "antonio", body: "Pode reservar até sexta?", read: false},
  {key: "msg-28", conversationKey: "conv-09", senderKey: "sandra", body: "Obrigada!", read: false},
  {key: "msg-29", conversationKey: "conv-10", senderKey: "paulo", body: "Confirmado sábado 10h.", read: false},
  {key: "msg-30", conversationKey: "conv-04", senderKey: "rui", body: "Ok, fico a aguardar.", read: false},
];

export const DEMO_REVIEWS: DemoReview[] = [
  {key: "rev-01", sellerKey: "lucia", reviewerKey: "ana", bookKey: "book-010", rating: 5, comment: "Boa comunicação e entrega conforme combinado."},
  {key: "rev-02", sellerKey: "miguel", reviewerKey: "joao", bookKey: "book-004", rating: 4, comment: "Livro em bom estado, conforme descrito."},
  {key: "rev-03", sellerKey: "maria", reviewerKey: "carlos", bookKey: "book-009", rating: 5, comment: "Transacção simples e rápida."},
  {key: "rev-04", sellerKey: "lucia", reviewerKey: "teresa", bookKey: "book-012", rating: 4, comment: "Vendedora atenciosa — demo."},
  {key: "rev-05", sellerKey: "miguel", reviewerKey: "maria", bookKey: "book-004", rating: 5, comment: "Recomendo para compras no Lobito."},
  {key: "rev-06", sellerKey: "lucia", reviewerKey: "antonio", bookKey: "book-014", rating: 5, comment: "Entrega em Talatona sem problemas."},
  {key: "rev-07", sellerKey: "lucia", reviewerKey: "paulo", bookKey: "book-001", rating: 4, comment: "Bom estado geral do manual."},
  {key: "rev-08", sellerKey: "miguel", reviewerKey: "rui", bookKey: "book-011", rating: 3, comment: "Livro usado mas aceitável — demo."},
  {key: "rev-09", sellerKey: "carlos", reviewerKey: "ana", bookKey: "book-005", rating: 4, comment: "Preço justo para o estado."},
  {key: "rev-10", sellerKey: "lucia", reviewerKey: "helena", bookKey: "book-015", rating: 5, comment: "Troca combinada rapidamente."},
  {key: "rev-11", sellerKey: "miguel", reviewerKey: "sandra", bookKey: "book-013", rating: 4, comment: "Comunicação clara — demo."},
  {key: "rev-12", sellerKey: "teresa", reviewerKey: "joao", bookKey: "book-012", rating: 5, comment: "Oferta generosa — demo."},
];

export const DEMO_REPORTS: DemoReport[] = [
  {
    key: "rep-01",
    bookKey: "book-020",
    reporterKey: "rui",
    reason: "Informação enganosa",
    details: "Demo: denúncia pendente para moderação.",
    resolved: false,
  },
  {
    key: "rep-02",
    bookKey: "book-005",
    reporterKey: "ines",
    reason: "Conteúdo inapropriado",
    details: "Demo: verificado.\nAdmin: Resolvido — anúncio conforme regras demo.",
    resolved: true,
  },
];

export const DEMO_ANALYTICS_EVENTS = [
  "page_view",
  "book_viewed",
  "search_performed",
  "favorite_added",
  "profile_viewed",
  "conversation_started",
  "message_sent",
  "listing_created",
  "listing_updated",
  "book_published",
] as const;

export function demoConversationId(key: string): string {
  return demoUuid("conversation", key);
}

export function demoMessageId(key: string): string {
  return demoUuid("message", key);
}

export function demoReviewId(key: string): string {
  return demoUuid("review", key);
}

export function demoReportId(key: string): string {
  return demoUuid("report", key);
}

export function demoFavoriteId(userKey: string, bookKey: string): string {
  return demoUuid("favorite", `${userKey}:${bookKey}`);
}
