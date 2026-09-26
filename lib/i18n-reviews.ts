import type {Locale} from "@/lib/i18n";

export const reviewMessages = {
  pt: {
    sectionEyebrow: "CONFIANÇA",
    sectionTitle: "Avaliações do vendedor",
    average: "Nota média",
    count: "avaliações",
    countOne: "avaliação",
    empty: "Ainda não há avaliações para este vendedor.",
    anonymous: "Membro ReLivroApps",
    formTitle: "Avaliar vendedor",
    formHint: "Partilhe a sua experiência com este vendedor (opcional).",
    ratingLabel: "Classificação",
    commentLabel: "Comentário",
    commentPlaceholder: "Comunicação, pontualidade, estado do livro...",
    submit: "Enviar avaliação",
    update: "Actualizar avaliação",
    sending: "A enviar...",
    loginPrompt: "Entre para avaliar o vendedor.",
    ownListing: "Não pode avaliar o seu próprio anúncio.",
    validation: "Seleccione uma classificação de 1 a 5 estrelas.",
    thanks: "Obrigado pela sua avaliação.",
    statsBooks: "livros",
    statsReviews: "avaliações",
    statsRating: "nota média",
    profileRecent: "Feedback recente",
  },
  fr: {
    sectionEyebrow: "CONFIANCE",
    sectionTitle: "Avis sur le vendeur",
    average: "Note moyenne",
    count: "avis",
    countOne: "avis",
    empty: "Il n’y a pas encore d’avis pour ce vendeur.",
    anonymous: "Membre ReLivroApps",
    formTitle: "Évaluer le vendeur",
    formHint: "Partagez votre expérience avec ce vendeur (facultatif).",
    ratingLabel: "Note",
    commentLabel: "Commentaire",
    commentPlaceholder: "Communication, ponctualité, état du livre...",
    submit: "Envoyer l’avis",
    update: "Mettre à jour l’avis",
    sending: "Envoi...",
    loginPrompt: "Connectez-vous pour évaluer le vendeur.",
    ownListing: "Vous ne pouvez pas évaluer votre propre annonce.",
    validation: "Choisissez une note de 1 à 5 étoiles.",
    thanks: "Merci pour votre avis.",
    statsBooks: "livres",
    statsReviews: "avis",
    statsRating: "note moyenne",
    profileRecent: "Retours récents",
  },
  en: {
    sectionEyebrow: "TRUST",
    sectionTitle: "Seller reviews",
    average: "Average rating",
    count: "reviews",
    countOne: "review",
    empty: "There are no reviews for this seller yet.",
    anonymous: "ReLivroApps member",
    formTitle: "Rate the seller",
    formHint: "Share your experience with this seller (optional).",
    ratingLabel: "Rating",
    commentLabel: "Comment",
    commentPlaceholder: "Communication, punctuality, book condition...",
    submit: "Submit review",
    update: "Update review",
    sending: "Sending...",
    loginPrompt: "Sign in to rate the seller.",
    ownListing: "You cannot review your own listing.",
    validation: "Please choose a rating from 1 to 5 stars.",
    thanks: "Thank you for your review.",
    statsBooks: "books",
    statsReviews: "reviews",
    statsRating: "average rating",
    profileRecent: "Recent feedback",
  },
} as const;

export function reviewsT(locale: Locale) {
  return reviewMessages[locale] ?? reviewMessages.pt;
}

export function formatReviewCount(count: number, locale: Locale): string {
  const t = reviewsT(locale);
  if (count === 1) return `1 ${t.countOne}`;
  return `${count} ${t.count}`;
}
