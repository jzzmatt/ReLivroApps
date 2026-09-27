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
  },
} as const satisfies Record<Locale, unknown>;

export function appRouteT(locale: Locale) {
  return appRouteMessages[locale] ?? appRouteMessages.pt;
}
