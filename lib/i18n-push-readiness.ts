import type {Locale} from "@/lib/i18n";

export const pushReadinessMessages = {
  pt: {
    title: "Notificações no browser",
    body: "Por agora recebe alertas aqui na app quando estiver com sessão iniciada. Notificações push nativas (telefone ou browser em segundo plano) estão planeadas — não é necessária nenhuma ação sua.",
  },
  fr: {
    title: "Notifications dans le navigateur",
    body: "Pour l’instant, vous recevez les alertes ici dans l’app lorsque vous êtes connecté. Les notifications push natives (téléphone ou navigateur en arrière-plan) sont prévues — aucune action requise de votre part.",
  },
  en: {
    title: "In-app notifications",
    body: "For now you get alerts here while signed in. Native push (phone or background browser) is on the roadmap — no setup needed from you yet.",
  },
} as const satisfies Record<Locale, unknown>;

export function pushReadinessT(locale: Locale) {
  return pushReadinessMessages[locale] ?? pushReadinessMessages.pt;
}
