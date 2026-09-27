import type {Locale} from "@/lib/i18n";
import type {InspectionSlot} from "@/lib/inspection-photos";

export const inspectionMessages = {
  pt: {
    guideEyebrow: "COMO PUBLICAR",
    guideTitle: "Antes de publicar",
    steps: [
      "Preencha os dados do livro, o preço e a localização.",
      "Fotografe as cinco partes obrigatórias: capa, contracapa, primeira página, página do meio e última página.",
      "Confirme o estado e publique. O anúncio só avança com as cinco fotos.",
    ],
    slotsTitle: "Fotos de inspecção",
    slotsHint: "JPG, PNG ou WebP, até 5 MB cada. As cinco fotos são obrigatórias.",
    missing: "Adicione as cinco fotos de inspecção antes de publicar.",
    fileType: "Use apenas JPG, PNG ou WebP.",
    fileSize: "Cada foto deve ter no máximo 5 MB.",
    uploadFailed: "Não foi possível guardar as fotos. Tente novamente.",
    slots: {
      front_cover: "Capa",
      back_cover: "Contracapa",
      first_page: "Primeira página",
      middle_page: "Página do meio",
      last_page: "Última página",
    } satisfies Record<InspectionSlot, string>,
    photoProgress: "{count}/5 fotos",
  },
  fr: {
    guideEyebrow: "COMMENT PUBLIER",
    guideTitle: "Avant de publier",
    steps: [
      "Renseignez le livre, le prix et le lieu.",
      "Photographiez les cinq parties obligatoires : couverture, quatrième de couverture, première page, page du milieu et dernière page.",
      "Confirmez l’état et publiez. L’annonce exige les cinq photos.",
    ],
    slotsTitle: "Photos d’inspection",
    slotsHint: "JPG, PNG ou WebP, 5 Mo maximum chacune. Les cinq photos sont obligatoires.",
    missing: "Ajoutez les cinq photos d’inspection avant de publier.",
    fileType: "Utilisez uniquement JPG, PNG ou WebP.",
    fileSize: "Chaque photo doit faire 5 Mo maximum.",
    uploadFailed: "Impossible d’enregistrer les photos. Réessayez.",
    slots: {
      front_cover: "Couverture",
      back_cover: "Quatrième de couverture",
      first_page: "Première page",
      middle_page: "Page du milieu",
      last_page: "Dernière page",
    } satisfies Record<InspectionSlot, string>,
    photoProgress: "{count}/5 photos",
  },
  en: {
    guideEyebrow: "HOW TO PUBLISH",
    guideTitle: "Before you publish",
    steps: [
      "Enter the book details, price and location.",
      "Photograph the five required parts: front cover, back cover, first page, middle page and last page.",
      "Confirm the condition and publish. Listing cannot continue without all five photos.",
    ],
    slotsTitle: "Inspection photos",
    slotsHint: "JPG, PNG or WebP, up to 5 MB each. All five photos are required.",
    missing: "Add all five inspection photos before publishing.",
    fileType: "Use JPG, PNG or WebP only.",
    fileSize: "Each photo must be 5 MB or smaller.",
    uploadFailed: "The photos could not be saved. Try again.",
    slots: {
      front_cover: "Front cover",
      back_cover: "Back cover",
      first_page: "First page",
      middle_page: "Middle page",
      last_page: "Last page",
    } satisfies Record<InspectionSlot, string>,
    photoProgress: "{count}/5 photos",
  },
} as const satisfies Record<Locale, unknown>;

export function inspectionT(locale: Locale) {
  return inspectionMessages[locale] ?? inspectionMessages.pt;
}
