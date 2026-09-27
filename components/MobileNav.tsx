"use client";

import Link from "next/link";
import {NavIcon} from "@/components/NavIcon";
import {MessageNavLink} from "@/components/MessageNavLink";
import {shellT} from "@/lib/i18n-shell";
import {useClientLocale} from "@/lib/use-client-locale";

export function MobileNav() {
  const locale = useClientLocale();
  const t = shellT(locale);

  return (
    <nav className="mobile-nav" aria-label={t.headerNavAria}>
      <Link href="/books">
        <NavIcon name="books" />
        <small>{t.mobileExplore}</small>
      </Link>
      <MessageNavLink className="mobile-messages-link">
        <NavIcon name="messages" />
        <small>{t.mobileMessages}</small>
      </MessageNavLink>
      <Link href="/sell" className="mobile-add" aria-label={t.mobilePublish}>
        <span>＋</span>
      </Link>
      <Link href="/workspace">
        <NavIcon name="workspace" />
        <small>{t.mobileWorkspace}</small>
      </Link>
      <Link href="/profile">
        <NavIcon name="profile" />
        <small>{t.mobileProfile}</small>
      </Link>
    </nav>
  );
}
