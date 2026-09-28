import type {Locale} from "@/lib/i18n";
import {formatPrice} from "@/lib/books";
import {labelGrade} from "@/lib/i18n-catalog";

export function buildBookShareDescription(input: {
  title: string;
  grade?: string | null;
  city?: string | null;
  municipality?: string | null;
  priceKz?: number | null;
  locale?: Locale;
}): string {
  const locale = input.locale ?? "pt";
  const lines: string[] = [`📚 ${input.title.trim()}`];

  if (input.grade?.trim()) {
    lines.push(`🎓 ${labelGrade(input.grade.trim(), locale)}`);
  }

  const location = [input.city?.trim(), input.municipality?.trim()].filter(Boolean).join(", ");
  if (location) {
    lines.push(`📍 ${location}`);
  }

  if (input.priceKz != null && Number.isFinite(input.priceKz) && input.priceKz > 0) {
    lines.push(`💰 ${formatPrice(input.priceKz)}`);
  }

  return lines.join("\n");
}
