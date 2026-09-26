"use client";

import Link from "next/link";
import {shellT} from "@/lib/i18n-shell";
import {useClientLocale} from "@/lib/use-client-locale";

export function MobileNav() {
  const locale = useClientLocale();
  const t = shellT(locale);

  return (
    <nav className="mobile-nav" aria-label={t.headerNavAria}>
      <Link href="/books">
        <span>⌕</span>
        <small>{t.mobileExplore}</small>
      </Link>
      <Link href="/messages">
        <span>✉</span>
        <small>{t.mobileMessages}</small>
      </Link>
      <Link href="/sell" className="mobile-add" aria-label={t.mobilePublish}>
        <span>＋</span>
      </Link>
      <Link href="/notifications">
        <span>♢</span>
        <small>{t.mobileNotices}</small>
      </Link>
      <Link href="/profile">
        <span>♙</span>
        <small>{t.mobileProfile}</small>
      </Link>
    </nav>
  );
}
