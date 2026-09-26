import type {Locale} from "@/lib/i18n";

export const editListingMessages = {
  pt: {
    eyebrow: "GERIR ANÚNCIO",
    title: "Editar livro.",
    save: "Guardar alterações",
    saving: "A guardar...",
    validation: "Verifique os campos obrigatórios.",
    published: "Anúncio publicado",
    availability: "Como pretende disponibilizar?",
    loading: "A carregar anúncio...",
  },
  fr: {
    eyebrow: "GÉRER L’ANNONCE",
    title: "Modifier le livre.",
    save: "Enregistrer",
    saving: "Enregistrement...",
    validation: "Vérifiez les champs obligatoires.",
    published: "Annonce publiée",
    availability: "Comment souhaitez-vous le proposer ?",
    loading: "Chargement de l’annonce...",
  },
  en: {
    eyebrow: "MANAGE LISTING",
    title: "Edit book.",
    save: "Save changes",
    saving: "Saving...",
    validation: "Check the required fields.",
    published: "Listing published",
    availability: "How would you like to offer it?",
    loading: "Loading listing...",
  },
} as const satisfies Record<Locale, unknown>;

export function editListingT(locale: Locale) {
  return editListingMessages[locale] ?? editListingMessages.pt;
}
