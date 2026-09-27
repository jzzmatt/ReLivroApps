import type {Locale} from "@/lib/i18n";

export const pushReadinessMessages = {
  pt: {
    title: "Alertas neste browser",
    body: "Active os alertas para saber de novas mensagens mesmo com o separador fechado. As mensagens continuam também nesta página.",
    enable: "Ativar alertas",
    disable: "Desativar alertas",
    busy: "A guardar...",
    enabled: "Alertas ativos neste browser.",
    denied: "O browser bloqueou as notificações.",
    unsupported: "Este browser não suporta alertas push.",
    unconfigured: "Os alertas push ainda não estão configurados neste servidor.",
    failed: "Não foi possível ativar os alertas.",
  },
  fr: {
    title: "Alertes dans ce navigateur",
    body: "Activez les alertes pour savoir qu’un message arrive, même si l’onglet est fermé. Les messages restent aussi sur cette page.",
    enable: "Activer les alertes",
    disable: "Désactiver les alertes",
    busy: "Enregistrement...",
    enabled: "Alertes actives dans ce navigateur.",
    denied: "Le navigateur a bloqué les notifications.",
    unsupported: "Ce navigateur ne prend pas en charge les alertes push.",
    unconfigured: "Les alertes push ne sont pas encore configurées sur ce serveur.",
    failed: "Impossible d’activer les alertes.",
  },
  en: {
    title: "Alerts in this browser",
    body: "Turn on alerts to hear about new messages even when the tab is closed. Messages also stay on this page.",
    enable: "Turn on alerts",
    disable: "Turn off alerts",
    busy: "Saving...",
    enabled: "Alerts are on in this browser.",
    denied: "The browser blocked notifications.",
    unsupported: "This browser does not support push alerts.",
    unconfigured: "Push alerts are not configured on this server yet.",
    failed: "Alerts could not be turned on.",
  },
} as const satisfies Record<Locale, unknown>;

export function pushReadinessT(locale: Locale) {
  return pushReadinessMessages[locale] ?? pushReadinessMessages.pt;
}
