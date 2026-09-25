"use client";

import {shareT, type ShareLabels} from "@/lib/i18n-share";
import type {Locale} from "@/lib/i18n";
import {useEffect, useState} from "react";

export function ShareListingButton({
  title,
  path,
  locale = "pt",
}: {
  title: string;
  path: string;
  locale?: Locale;
}) {
  const [labels, setLabels] = useState<ShareLabels>(shareT(locale));

  useEffect(() => {
    setLabels(shareT(locale));
  }, [locale]);

  async function onShare() {
    const url = typeof window !== "undefined" ? new URL(path, window.location.origin).href : path;
    try {
      if (navigator.share) {
        await navigator.share({title, url});
        return;
      }
      await navigator.clipboard.writeText(url);
      window.alert(labels.copied);
    } catch {
      /* user cancelled share */
    }
  }

  return (
    <button type="button" className="secondary-button" onClick={onShare}>
      {labels.share}
    </button>
  );
}
