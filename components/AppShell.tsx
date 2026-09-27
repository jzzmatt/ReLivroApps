"use client";

import Link from "next/link";
import {MobileNav} from "@/components/MobileNav";
import {NavIcon} from "@/components/NavIcon";
import {MessageNavLink} from "@/components/MessageNavLink";
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
            <Link href="/books" className="header-nav-icon" aria-label={t.ariaBooks}>
              <NavIcon name="books" />
            </Link>
            <Link href="/workspace" className="header-nav-icon" aria-label={t.ariaWorkspace}>
              <NavIcon name="workspace" />
            </Link>
            <MessageNavLink className="header-messages-link header-nav-icon">
              <NavIcon name="messages" />
            </MessageNavLink>
            <NotificationNavLink className="header-notifications-link header-nav-icon">
              <NavIcon name="notifications" />
            </NotificationNavLink>
            <Link href="/profile" className="header-nav-icon" aria-label={t.ariaProfile}>
              <NavIcon name="profile" />
            </Link>
          </nav>
        </div>
      </header>
      <main className="app-main">{children}</main>
      <MobileNav/>
    </>
  );
}
