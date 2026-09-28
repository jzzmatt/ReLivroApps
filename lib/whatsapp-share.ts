import type {Locale} from "@/lib/i18n";
import {formatPrice} from "@/lib/books";
import {labelGrade} from "@/lib/i18n-catalog";
import {whatsappShareT} from "@/lib/i18n-whatsapp-share";

export type WhatsAppBookShareInput = {
  title: string;
  grade?: string | null;
  city?: string | null;
  municipality?: string | null;
  priceKz?: number | null;
  bookUrl: string;
  locale?: Locale;
};

function locationLine(city?: string | null, municipality?: string | null): string | null {
  const parts = [city?.trim(), municipality?.trim()].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

export function buildWhatsAppBookShareMessage(input: WhatsAppBookShareInput): string {
  const locale = input.locale ?? "pt";
  const t = whatsappShareT(locale);
  const lines: string[] = [t.headline, "", `📖 *${input.title.trim()}*`];

  if (input.grade?.trim()) {
    lines.push("", `🎓 *${t.classLabel}:* ${labelGrade(input.grade.trim(), locale)}`);
  }

  const location = locationLine(input.city, input.municipality);
  if (location) {
    lines.push(`📍 *${t.locationLabel}:* ${location}`);
  }

  if (input.priceKz != null && Number.isFinite(input.priceKz) && input.priceKz > 0) {
    lines.push(`💰 *${t.priceLabel}:* ${formatPrice(input.priceKz)}`);
  }

  lines.push("", t.cta, input.bookUrl.trim(), "", `🔗 *${t.viewBook}*`);
  return lines.join("\n");
}

export function createWhatsAppBookShareUrl(input: WhatsAppBookShareInput): string {
  const message = buildWhatsAppBookShareMessage(input);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
