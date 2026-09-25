import type {Locale} from "@/lib/i18n";

export const adminMessages = {
  pt: {
    back: "← Administração",
    dashboard: {
      eyebrow: "ADMINISTRAÇÃO",
      title: "Centro de controlo.",
      lead: "Moderação, actividade e saúde do marketplace.",
      users: "Utilizadores",
      books: "Livros",
      published: "Publicados",
      sold: "Vendidos",
      exchanged: "Trocados",
      views: "Visualizações",
      conversations: "Conversas",
      reports: "Denúncias",
      events: "Eventos",
      sessions: "Sessões",
      events24h: "Eventos 24h",
      events30d: "Eventos 30d",
      moderateListings: "Moderar anúncios",
      reportsLink: "Denúncias",
      usersLink: "Utilizadores",
    },
    listings: {title: "Moderar anúncios."},
    reports: {
      title: "Denúncias.",
      emptyTitle: "Sem denúncias.",
      emptyText: "Não existem denúncias pendentes.",
      removedBook: "Livro removido",
    },
    users: {title: "Utilizadores.", noName: "Sem nome"},
    actions: {
      busy: "...",
      publish: "Publicar",
      suspend: "Suspender",
      resolve: "Resolver",
      publishPrompt: "Motivo da publicação (opcional)",
      suspendPrompt: "Motivo da suspensão (opcional)",
      reportNotePrompt: "Nota da moderação (opcional)",
    },
  },
  fr: {
    back: "← Administration",
    dashboard: {
      eyebrow: "ADMINISTRATION",
      title: "Centre de contrôle.",
      lead: "Modération, activité et santé du marketplace.",
      users: "Utilisateurs",
      books: "Livres",
      published: "Publiés",
      sold: "Vendus",
      exchanged: "Échangés",
      views: "Vues",
      conversations: "Conversations",
      reports: "Signalements",
      events: "Événements",
      sessions: "Sessions",
      events24h: "Événements 24 h",
      events30d: "Événements 30 j",
      moderateListings: "Modérer les annonces",
      reportsLink: "Signalements",
      usersLink: "Utilisateurs",
    },
    listings: {title: "Modérer les annonces."},
    reports: {
      title: "Signalements.",
      emptyTitle: "Aucun signalement.",
      emptyText: "Il n’y a pas de signalements en attente.",
      removedBook: "Livre supprimé",
    },
    users: {title: "Utilisateurs.", noName: "Sans nom"},
    actions: {
      busy: "...",
      publish: "Publier",
      suspend: "Suspendre",
      resolve: "Résoudre",
      publishPrompt: "Motif de publication (facultatif)",
      suspendPrompt: "Motif de suspension (facultatif)",
      reportNotePrompt: "Note de modération (facultatif)",
    },
  },
  en: {
    back: "← Admin",
    dashboard: {
      eyebrow: "ADMIN",
      title: "Control centre.",
      lead: "Moderation, activity and marketplace health.",
      users: "Users",
      books: "Books",
      published: "Published",
      sold: "Sold",
      exchanged: "Exchanged",
      views: "Views",
      conversations: "Conversations",
      reports: "Reports",
      events: "Events",
      sessions: "Sessions",
      events24h: "Events 24h",
      events30d: "Events 30d",
      moderateListings: "Moderate listings",
      reportsLink: "Reports",
      usersLink: "Users",
    },
    listings: {title: "Moderate listings."},
    reports: {
      title: "Reports.",
      emptyTitle: "No reports.",
      emptyText: "There are no pending reports.",
      removedBook: "Removed book",
    },
    users: {title: "Users.", noName: "No name"},
    actions: {
      busy: "...",
      publish: "Publish",
      suspend: "Suspend",
      resolve: "Resolve",
      publishPrompt: "Publish reason (optional)",
      suspendPrompt: "Suspension reason (optional)",
      reportNotePrompt: "Moderation note (optional)",
    },
  },
} as const satisfies Record<Locale, unknown>;

export type AdminActionLabels = {
  busy: string;
  publish: string;
  suspend: string;
  resolve: string;
  publishPrompt: string;
  suspendPrompt: string;
  reportNotePrompt: string;
};

export function adminT(locale: Locale) {
  return adminMessages[locale] ?? adminMessages.pt;
}
