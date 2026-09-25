import type {Locale} from "@/lib/i18n";

export const legalMessages = {
  pt: {
    privacy: {
      title: "Privacidade",
      updated: "Última actualização: Setembro 2026",
      sections: [
        {
          heading: "Dados que recolhemos",
          body: "Conta (email, nome), perfil (cidade, escola), anúncios, mensagens entre utilizadores e eventos analíticos agregados para melhorar o serviço.",
        },
        {
          heading: "Como usamos os dados",
          body: "Operar o marketplace, autenticação, mensagens, moderação, segurança e estatísticas internas. Não vendemos dados pessoais.",
        },
        {
          heading: "Armazenamento",
          body: "Dados alojados em Supabase (UE/região do seu projecto). Imagens em buckets de armazenamento com políticas de acesso.",
        },
        {
          heading: "Os seus direitos",
          body: "Pode editar o perfil, eliminar anúncios e solicitar apoio para correcção ou eliminação de conta contactando a equipa ReLivroApps.",
        },
      ],
    },
    terms: {
      title: "Termos de utilização",
      updated: "Última actualização: Setembro 2026",
      sections: [
        {
          heading: "Serviço",
          body: "ReLivroApps liga compradores e vendedores de livros escolares. Não somos parte das transacções entre utilizadores.",
        },
        {
          heading: "Conta e conteúdo",
          body: "É responsável pela exactidão dos anúncios e pelo cumprimento das regras escolares e legais aplicáveis.",
        },
        {
          heading: "Conduta",
          body: "Proibido conteúdo ilegal, fraude, assédio ou abuso. Reservamo-nos o direito de suspender anúncios ou contas.",
        },
        {
          heading: "Beta / alterações",
          body: "Funcionalidades podem evoluir. O serviço é fornecido «tal como está» durante fases beta ou de lançamento inicial.",
        },
      ],
    },
    backHome: "← Início",
  },
  fr: {
    privacy: {
      title: "Confidentialité",
      updated: "Dernière mise à jour : septembre 2026",
      sections: [
        {
          heading: "Données collectées",
          body: "Compte (e-mail, nom), profil (ville, école), annonces, messages entre utilisateurs et événements analytiques agrégés.",
        },
        {
          heading: "Utilisation",
          body: "Exploitation du marketplace, authentification, messagerie, modération, sécurité et statistiques internes. Nous ne vendons pas vos données.",
        },
        {
          heading: "Stockage",
          body: "Données hébergées sur Supabase. Images dans des buckets avec politiques d’accès.",
        },
        {
          heading: "Vos droits",
          body: "Vous pouvez modifier votre profil, supprimer des annonces et demander l’assistance pour la correction ou la suppression du compte.",
        },
      ],
    },
    terms: {
      title: "Conditions d’utilisation",
      updated: "Dernière mise à jour : septembre 2026",
      sections: [
        {
          heading: "Service",
          body: "ReLivroApps met en relation acheteurs et vendeurs de livres scolaires. Nous ne sommes pas partie aux transactions.",
        },
        {
          heading: "Compte et contenu",
          body: "Vous êtes responsable de l’exactitude des annonces et du respect des règles applicables.",
        },
        {
          heading: "Conduite",
          body: "Contenu illégal, fraude, harcèlement ou abus interdits. Nous pouvons suspendre annonces ou comptes.",
        },
        {
          heading: "Bêta / évolutions",
          body: "Les fonctionnalités peuvent évoluer. Service fourni « en l’état » pendant la bêta ou le lancement initial.",
        },
      ],
    },
    backHome: "← Accueil",
  },
  en: {
    privacy: {
      title: "Privacy",
      updated: "Last updated: September 2026",
      sections: [
        {
          heading: "Data we collect",
          body: "Account (email, name), profile (city, school), listings, user messages and aggregated analytics events.",
        },
        {
          heading: "How we use data",
          body: "To run the marketplace, authentication, messaging, moderation, security and internal statistics. We do not sell personal data.",
        },
        {
          heading: "Storage",
          body: "Data hosted on Supabase. Images in storage buckets with access policies.",
        },
        {
          heading: "Your rights",
          body: "You can edit your profile, delete listings and contact ReLivroApps for account correction or deletion.",
        },
      ],
    },
    terms: {
      title: "Terms of use",
      updated: "Last updated: September 2026",
      sections: [
        {
          heading: "Service",
          body: "ReLivroApps connects buyers and sellers of school books. We are not a party to user transactions.",
        },
        {
          heading: "Account and content",
          body: "You are responsible for accurate listings and compliance with applicable school and legal rules.",
        },
        {
          heading: "Conduct",
          body: "Illegal content, fraud, harassment or abuse is prohibited. We may suspend listings or accounts.",
        },
        {
          heading: "Beta / changes",
          body: "Features may evolve. The service is provided “as is” during beta or initial launch.",
        },
      ],
    },
    backHome: "← Home",
  },
} as const satisfies Record<Locale, unknown>;

export function legalT(locale: Locale) {
  return legalMessages[locale] ?? legalMessages.pt;
}
