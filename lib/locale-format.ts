import type {Locale} from "@/lib/i18n";

/** BCP 47 tags for dates and numbers in UI. */
export function localeTag(locale: Locale): string {
  if (locale === "fr") return "fr-FR";
  if (locale === "en") return "en-GB";
  return "pt-AO";
}
