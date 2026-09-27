import type {Locale} from "@/lib/i18n";

export const listingMediaMessages = {
  pt: {
    videoLabel: "Vídeo curto (opcional)",
    videoHint: "MP4, WebM ou MOV, até 20 MB. Só é mostrado em anúncios publicados.",
    videoType: "O vídeo deve ser MP4, WebM ou MOV.",
    videoSize: "O vídeo deve ter no máximo 20 MB.",
    videoFailed: "Não foi possível guardar o vídeo.",
    watchVideo: "Ver vídeo",
    analyze: "Sugerir estado com IA",
    analyzing: "A analisar fotos...",
    applySuggestion: "Usar esta sugestão",
    suggestionLead: "Sugestão da IA (o estado que publicar continua a ser o seu):",
    unavailable: "A análise por IA não está configurada neste servidor.",
    analyzeFailed: "Não foi possível analisar as fotos. Pode escolher o estado manualmente.",
    aiDone: "IA analisada",
    aiPending: "Análise pendente",
    hasVideo: "Com vídeo",
  },
  fr: {
    videoLabel: "Courte vidéo (facultatif)",
    videoHint: "MP4, WebM ou MOV, 20 Mo maximum. Visible seulement si l’annonce est publiée.",
    videoType: "La vidéo doit être en MP4, WebM ou MOV.",
    videoSize: "La vidéo doit faire 20 Mo maximum.",
    videoFailed: "Impossible d’enregistrer la vidéo.",
    watchVideo: "Voir la vidéo",
    analyze: "Suggérer l’état avec l’IA",
    analyzing: "Analyse des photos...",
    applySuggestion: "Utiliser cette suggestion",
    suggestionLead: "Suggestion de l’IA (l’état publié reste le vôtre) :",
    unavailable: "L’analyse IA n’est pas configurée sur ce serveur.",
    analyzeFailed: "Impossible d’analyser les photos. Vous pouvez choisir l’état manuellement.",
    aiDone: "IA analysée",
    aiPending: "Analyse en attente",
    hasVideo: "Avec vidéo",
  },
  en: {
    videoLabel: "Short video (optional)",
    videoHint: "MP4, WebM or MOV, up to 20 MB. Shown only on published listings.",
    videoType: "The video must be MP4, WebM or MOV.",
    videoSize: "The video must be 20 MB or smaller.",
    videoFailed: "The video could not be saved.",
    watchVideo: "Watch video",
    analyze: "Suggest condition with AI",
    analyzing: "Analysing photos...",
    applySuggestion: "Use this suggestion",
    suggestionLead: "AI suggestion (the condition you publish is still yours):",
    unavailable: "AI analysis is not configured on this server.",
    analyzeFailed: "The photos could not be analysed. You can choose the condition yourself.",
    aiDone: "AI analysed",
    aiPending: "Analysis pending",
    hasVideo: "Has video",
  },
} as const satisfies Record<Locale, unknown>;

export function listingMediaT(locale: Locale) {
  return listingMediaMessages[locale] ?? listingMediaMessages.pt;
}
