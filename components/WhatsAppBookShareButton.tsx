"use client";

import type {Locale} from "@/lib/i18n";
import {whatsappShareT} from "@/lib/i18n-whatsapp-share";
import {createWhatsAppBookShareUrl} from "@/lib/whatsapp-share";
import {useEffect, useState} from "react";

export function WhatsAppBookShareButton({
  title,
  grade,
  city,
  municipality,
  priceKz,
  bookUrl,
  locale = "pt",
}: {
  title: string;
  grade?: string | null;
  city?: string | null;
  municipality?: string | null;
  priceKz?: number | null;
  bookUrl: string;
  locale?: Locale;
}) {
  const [label, setLabel] = useState(whatsappShareT(locale).button);

  useEffect(() => {
    setLabel(whatsappShareT(locale).button);
  }, [locale]);

  const href = createWhatsAppBookShareUrl({
    title,
    grade,
    city,
    municipality,
    priceKz,
    bookUrl,
    locale,
  });

  return (
    <a className="secondary-button whatsapp-share-button" href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}
