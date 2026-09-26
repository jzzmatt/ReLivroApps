import type {Locale} from "@/lib/i18n";

export const listingsManageMessages = {
  pt: {
    eyebrow: "OS MEUS ANÚNCIOS",
    title: "Os meus livros.",
    lead: "Gerir os seus anúncios e disponibilidade.",
    publish: "＋ Publicar",
    emptyTitle: "Ainda não publicou nenhum livro.",
    emptyCta: "Publicar primeiro livro",
    statusPublished: "Publicado",
    statusPaused: "Pausado",
    statusActive: "Activo",
    statusReserved: "Reservado",
    statusSold: "Vendido",
    statusExchanged: "Trocado",
    actions: {
      edit: "Editar",
      pause: "Pausar",
      publish: "Publicar",
      delete: "Eliminar",
      deleteConfirm: "Eliminar este anúncio? Esta acção não pode ser anulada.",
    },
  },
  fr: {
    eyebrow: "MES ANNONCES",
    title: "Mes livres.",
    lead: "Gérer vos annonces et leur disponibilité.",
    publish: "＋ Publier",
    emptyTitle: "Vous n’avez encore publié aucun livre.",
    emptyCta: "Publier un premier livre",
    statusPublished: "Publié",
    statusPaused: "En pause",
    statusActive: "Actif",
    statusReserved: "Réservé",
    statusSold: "Vendu",
    statusExchanged: "Échangé",
    actions: {
      edit: "Modifier",
      pause: "Mettre en pause",
      publish: "Publier",
      delete: "Supprimer",
      deleteConfirm: "Supprimer cette annonce ? Cette action est irréversible.",
    },
  },
  en: {
    eyebrow: "MY LISTINGS",
    title: "My books.",
    lead: "Manage your listings and availability.",
    publish: "＋ Publish",
    emptyTitle: "You have not published any books yet.",
    emptyCta: "Publish first book",
    statusPublished: "Published",
    statusPaused: "Paused",
    statusActive: "Active",
    statusReserved: "Reserved",
    statusSold: "Sold",
    statusExchanged: "Exchanged",
    actions: {
      edit: "Edit",
      pause: "Pause",
      publish: "Publish",
      delete: "Delete",
      deleteConfirm: "Delete this listing? This cannot be undone.",
    },
  },
} as const satisfies Record<Locale, unknown>;

export type ListingActionLabels = {
  edit: string;
  pause: string;
  publish: string;
  delete: string;
  deleteConfirm: string;
};

export function listingsManageT(locale: Locale) {
  return listingsManageMessages[locale] ?? listingsManageMessages.pt;
}
