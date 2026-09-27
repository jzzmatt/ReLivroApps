import type {Locale} from "@/lib/i18n";

export const appRouteMessages = {
  pt: {
    profile: {
      title: "O meu perfil",
      description: "Gerir a sua conta ReLivroApps, estatísticas e atalhos para anúncios e favoritos.",
    },
    profileEdit: {
      title: "Editar perfil",
      description: "Actualize nome, localização, escola e foto de perfil no ReLivroApps.",
    },
    favorites: {
      title: "Favoritos",
      description: "Livros escolares que guardou no ReLivroApps.",
    },
    myListings: {
      title: "Os meus anúncios",
      description: "Gerir os seus livros publicados, pausar ou editar anúncios.",
    },
    messages: {
      title: "Mensagens",
      description: "Conversas com compradores e vendedores sobre livros escolares.",
    },
    notifications: {
      title: "Notificações",
      description: "Alertas da sua actividade no ReLivroApps.",
    },
    adminDashboard: {
      title: "Administração",
      description: "Moderação, actividade e saúde do marketplace ReLivroApps.",
    },
    adminListings: {
      title: "Moderar anúncios",
      description: "Rever e moderar anúncios de livros escolares.",
    },
    adminReports: {
      title: "Denúncias",
      description: "Denúncias de anúncios pendentes de moderação.",
    },
    adminUsers: {
      title: "Utilizadores",
      description: "Gestão de contas de utilizadores ReLivroApps.",
    },
    bookEdit: {
      title: "Editar anúncio",
      description: "Actualizar fotos, preço e detalhes do livro publicado.",
    },
    messageThread: {
      title: "Conversa",
      description: "Mensagens privadas sobre um livro escolar no ReLivroApps.",
    },
  },
  fr: {
    profile: {
      title: "Mon profil",
      description: "Gérez votre compte ReLivroApps, statistiques et raccourcis vers annonces et favoris.",
    },
    profileEdit: {
      title: "Modifier le profil",
      description: "Mettez à jour nom, lieu, école et photo sur ReLivroApps.",
    },
    favorites: {
      title: "Favoris",
      description: "Livres scolaires enregistrés sur ReLivroApps.",
    },
    myListings: {
      title: "Mes annonces",
      description: "Gérez vos livres publiés, mettez en pause ou modifiez les annonces.",
    },
    messages: {
      title: "Messages",
      description: "Conversations avec acheteurs et vendeurs à propos des livres scolaires.",
    },
    notifications: {
      title: "Notifications",
      description: "Alertes liées à votre activité sur ReLivroApps.",
    },
    adminDashboard: {
      title: "Administration",
      description: "Modération, activité et santé du marketplace ReLivroApps.",
    },
    adminListings: {
      title: "Modérer les annonces",
      description: "Examiner et modérer les annonces de livres scolaires.",
    },
    adminReports: {
      title: "Signalements",
      description: "Signalements d’annonces en attente de modération.",
    },
    adminUsers: {
      title: "Utilisateurs",
      description: "Gestion des comptes utilisateurs ReLivroApps.",
    },
    bookEdit: {
      title: "Modifier l’annonce",
      description: "Mettre à jour photos, prix et détails du livre publié.",
    },
    messageThread: {
      title: "Conversation",
      description: "Messages privés à propos d’un livre scolaire sur ReLivroApps.",
    },
  },
  en: {
    profile: {
      title: "My profile",
      description: "Manage your ReLivroApps account, stats and shortcuts to listings and favorites.",
    },
    profileEdit: {
      title: "Edit profile",
      description: "Update name, location, school and avatar on ReLivroApps.",
    },
    favorites: {
      title: "Favorites",
      description: "School books you saved on ReLivroApps.",
    },
    myListings: {
      title: "My listings",
      description: "Manage your published books, pause or edit listings.",
    },
    messages: {
      title: "Messages",
      description: "Conversations with buyers and sellers about school books.",
    },
    notifications: {
      title: "Notifications",
      description: "Alerts about your activity on ReLivroApps.",
    },
    adminDashboard: {
      title: "Administration",
      description: "Moderation, activity and marketplace health on ReLivroApps.",
    },
    adminListings: {
      title: "Moderate listings",
      description: "Review and moderate school book listings.",
    },
    adminReports: {
      title: "Reports",
      description: "Listing reports pending moderation.",
    },
    adminUsers: {
      title: "Users",
      description: "ReLivroApps user account management.",
    },
    bookEdit: {
      title: "Edit listing",
      description: "Update photos, price and details for a published book.",
    },
    messageThread: {
      title: "Conversation",
      description: "Private messages about a school book on ReLivroApps.",
    },
  },
} as const satisfies Record<Locale, unknown>;

export function appRouteT(locale: Locale) {
  return appRouteMessages[locale] ?? appRouteMessages.pt;
}
