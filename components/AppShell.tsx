"use client";

import Link from "next/link";
import {MobileNav} from "@/components/MobileNav";
import {NotificationNavLink} from "@/components/NotificationNavLink";
import {shellT} from "@/lib/i18n-shell";
import {useClientLocale} from "@/lib/use-client-locale";

export function AppShell({children}: {children: React.ReactNode}) {
  const locale = useClientLocale();
  const t = shellT(locale);

  return (
    <>
      <header className="app-header" role="banner">
        <div className="app-header-inner">
          <Link className="brand" href="/">
            <span className="logo-book">
              <span/>
            </span>
            <span>
              <b>Re</b>Livro<span>Apps</span>
            </span>
          </Link>
          <nav className="app-header-actions" aria-label={t.headerNavAria}>
            <Link href="/books" aria-label={t.ariaSearch}>
              ⌕
            </Link>
            <Link href="/messages" aria-label={t.ariaMessages}>
              ✉
            </Link>
            <NotificationNavLink className="header-notifications-link">
              ♢
            </NotificationNavLink>
            <Link href="/profile" aria-label={t.ariaProfile}>
              ♙
            </Link>
          </nav>
        </div>
      </header>
      <main className="app-main">{children}</main>
      <MobileNav/>
    </>
  );
}
