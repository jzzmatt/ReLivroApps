import type {Locale} from "@/lib/i18n";
import type {BookCondition, ListingMode} from "@/lib/books";

export const detailMessages = {
  pt: {
    back: "← Voltar aos livros",
    seller: "Vendedor",
    viewSellerProfile: "Ver perfil do vendedor",
    moreFromSeller: "Mais deste vendedor",
    viewAllSellerListings: "Ver todos os anúncios →",
    memberDefault: "Membro ReLivroApps",
    condition: "Estado",
    location: "Localização",
    subject: "Disciplina",
    grade: "Classe",
    editListing: "Editar anúncio",
    contactSeller: "Contactar vendedor",
    contactBusy: "A abrir conversa...",
    safeNote:
      "Compra e contacto seguros. Nunca partilhe dados de pagamento fora da plataforma.",
    defaultCountry: "Angola",
    metaNotFound: "Livro",
    modes: {Venda: "Venda", Troca: "Troca", Oferta: "Oferta"} as Record<ListingMode, string>,
    conditions: {
      "Como novo": "Como novo",
      "Muito bom": "Muito bom",
      "Bom estado": "Bom estado",
      Usado: "Usado",
    } as Record<BookCondition, string>,
  },
  fr: {
    back: "← Retour aux livres",
    seller: "Vendeur",
    viewSellerProfile: "Voir le profil du vendeur",
    moreFromSeller: "Plus de ce vendeur",
    viewAllSellerListings: "Voir toutes les annonces →",
    memberDefault: "Membre ReLivroApps",
    condition: "État",
    location: "Localisation",
    subject: "Matière",
    grade: "Classe",
    editListing: "Modifier l’annonce",
    contactSeller: "Contacter le vendeur",
    contactBusy: "Ouverture de la conversation...",
    safeNote:
      "Achat et contact sécurisés. Ne partagez jamais vos données de paiement en dehors de la plateforme.",
    defaultCountry: "Angola",
    metaNotFound: "Livre",
    modes: {Venda: "Vente", Troca: "Échange", Oferta: "Offre"} as Record<ListingMode, string>,
    conditions: {
      "Como novo": "Comme neuf",
      "Muito bom": "Très bon",
      "Bom estado": "Bon état",
      Usado: "Usagé",
    } as Record<BookCondition, string>,
  },
  en: {
    back: "← Back to books",
    seller: "Seller",
    viewSellerProfile: "View seller profile",
    moreFromSeller: "More from this seller",
    viewAllSellerListings: "View all listings →",
    memberDefault: "ReLivroApps member",
    condition: "Condition",
    location: "Location",
    subject: "Subject",
    grade: "Grade",
    editListing: "Edit listing",
    contactSeller: "Contact seller",
    contactBusy: "Opening conversation...",
    safeNote:
      "Buy and contact safely. Never share payment details outside the platform.",
    defaultCountry: "Angola",
    metaNotFound: "Book",
    modes: {Venda: "Sale", Troca: "Exchange", Oferta: "Offer"} as Record<ListingMode, string>,
    conditions: {
      "Como novo": "Like new",
      "Muito bom": "Very good",
      "Bom estado": "Good condition",
      Usado: "Used",
    } as Record<BookCondition, string>,
  },
} as const satisfies Record<Locale, unknown>;

export function detailT(locale: Locale) {
  return detailMessages[locale] ?? detailMessages.pt;
}
