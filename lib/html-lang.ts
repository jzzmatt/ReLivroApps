import type {Locale} from "@/lib/i18n";

export function htmlLang(locale: Locale): string {
  if (locale === "fr") return "fr";
  if (locale === "en") return "en";
  return "pt-AO";
}

export function openGraphLocale(locale: Locale): string {
  if (locale === "fr") return "fr_FR";
  if (locale === "en") return "en_GB";
  return "pt_AO";
}
