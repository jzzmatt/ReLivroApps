import type {Locale} from "@/lib/i18n";

export const helpMessages = {
  pt: {
    eyebrow: "AJUDA",
    title: "Como funciona o ReLivroApps",
    lead: "Respostas rápidas para estudantes, famílias e escolas.",
    faqs: [
      {
        q: "Como crio uma conta?",
        a: "Abra Entrar / Criar conta, use email e palavra-passe ou Continue com Google. Complete o perfil em Editar perfil.",
      },
      {
        q: "Como publico um livro?",
        a: "Com sessão iniciada, vá a Publicar livro, preencha título, disciplina, classe, preço ou troca, cidade e fotografias (até 5).",
      },
      {
        q: "Como contacto um vendedor?",
        a: "Na página do livro, use Contactar vendedor para abrir uma conversa privada.",
      },
      {
        q: "É seguro?",
        a: "Mensagens e anúncios passam por regras de acesso (RLS). Denuncie anúncios suspeitos; a equipa de moderação revê denúncias.",
      },
      {
        q: "Posso usar em francês ou inglês?",
        a: "Sim. Use o selector de idioma no topo; a preferência fica guardada no browser.",
      },
    ],
    contact: "Dúvidas adicionais: contacte a equipa ReLivroApps através dos canais oficiais do projecto.",
    explore: "Explorar livros",
    backHome: "← Início",
  },
  fr: {
    eyebrow: "AIDE",
    title: "Comment fonctionne ReLivroApps",
    lead: "Réponses rapides pour élèves, familles et écoles.",
    faqs: [
      {
        q: "Comment créer un compte ?",
        a: "Ouvrez Connexion / Créer un compte, utilisez l’e-mail ou Google. Complétez le profil dans Modifier le profil.",
      },
      {
        q: "Comment publier un livre ?",
        a: "Connecté, allez à Publier un livre, renseignez titre, matière, classe, prix ou échange, ville et photos (jusqu’à 5).",
      },
      {
        q: "Comment contacter un vendeur ?",
        a: "Sur la fiche du livre, utilisez Contacter le vendeur pour ouvrir une conversation privée.",
      },
      {
        q: "Est-ce sécurisé ?",
        a: "Messages et annonces sont protégés par des règles d’accès. Signalez les annonces suspectes ; la modération les examine.",
      },
      {
        q: "Puis-je utiliser le français ou l’anglais ?",
        a: "Oui. Utilisez le sélecteur de langue ; la préférence est enregistrée dans le navigateur.",
      },
    ],
    contact: "Autres questions : contactez l’équipe ReLivroApps via les canaux officiels du projet.",
    explore: "Explorer les livres",
    backHome: "← Accueil",
  },
  en: {
    eyebrow: "HELP",
    title: "How ReLivroApps works",
    lead: "Quick answers for students, families and schools.",
    faqs: [
      {
        q: "How do I create an account?",
        a: "Open Sign in / Create account, use email and password or Continue with Google. Complete your profile under Edit profile.",
      },
      {
        q: "How do I publish a book?",
        a: "While signed in, go to Publish a book, fill title, subject, grade, price or exchange, city and photos (up to 5).",
      },
      {
        q: "How do I contact a seller?",
        a: "On the book page, use Contact seller to start a private conversation.",
      },
      {
        q: "Is it safe?",
        a: "Messages and listings use access rules (RLS). Report suspicious listings; moderators review reports.",
      },
      {
        q: "Can I use French or English?",
        a: "Yes. Use the language selector at the top; your preference is stored in the browser.",
      },
    ],
    contact: "Further questions: reach the ReLivroApps team through the project’s official channels.",
    explore: "Explore books",
    backHome: "← Home",
  },
} as const satisfies Record<Locale, unknown>;

export function helpT(locale: Locale) {
  return helpMessages[locale] ?? helpMessages.pt;
}
