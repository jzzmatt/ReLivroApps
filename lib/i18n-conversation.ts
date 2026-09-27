import type {Locale} from "@/lib/i18n";

export const conversationMessages = {
  pt: {
    back: "← Conversas",
    bookEyebrow: "LIVRO",
    viewBook: "Ver livro",
    threadEmpty: "Comece a conversa sobre este livro.",
    bookFallback: "Livro",
    defaultCountry: "Angola",
    composerPlaceholder: "Escreva uma mensagem...",
    send: "Enviar",
    sending: "A enviar...",
    unread: "Nova mensagem",
    previewYou: "Tu:",
    previewEmpty: "Sem mensagens ainda.",
  },
  fr: {
    back: "← Conversations",
    bookEyebrow: "LIVRE",
    viewBook: "Voir le livre",
    threadEmpty: "Commencez la conversation à propos de ce livre.",
    bookFallback: "Livre",
    defaultCountry: "Angola",
    composerPlaceholder: "Écrivez un message...",
    send: "Envoyer",
    sending: "Envoi...",
    unread: "Nouveau message",
    previewYou: "Vous :",
    previewEmpty: "Pas encore de messages.",
  },
  en: {
    back: "← Conversations",
    bookEyebrow: "BOOK",
    viewBook: "View book",
    threadEmpty: "Start the conversation about this book.",
    bookFallback: "Book",
    defaultCountry: "Angola",
    composerPlaceholder: "Write a message...",
    send: "Send",
    sending: "Sending...",
    unread: "New message",
    previewYou: "You:",
    previewEmpty: "No messages yet.",
  },
} as const;

export function conversationT(locale: Locale) {
  return conversationMessages[locale] ?? conversationMessages.pt;
}
