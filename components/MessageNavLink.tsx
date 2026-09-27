"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {unreadMessageCount} from "@/lib/messages-unread";
import {shellT} from "@/lib/i18n-shell";
import {createClient} from "@/lib/supabase/client";
import {useClientLocale} from "@/lib/use-client-locale";

export function MessageNavLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const locale = useClientLocale();
  const t = shellT(locale);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function loadUnread() {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      if (!user || cancelled) {
        if (!cancelled) setUnread(0);
        return;
      }
      const count = await unreadMessageCount(supabase, user.id);
      if (!cancelled) setUnread(count);
    }

    void loadUnread();
    return () => {
      cancelled = true;
    };
  }, []);

  const badge = unread > 99 ? "99+" : String(unread);
  const ariaLabel = unread > 0 ? `${t.ariaMessages} (${unread})` : t.ariaMessages;

  return (
    <Link href="/messages" className={className} aria-label={ariaLabel}>
      {children}
      {unread > 0 && <span className="nav-unread-badge">{badge}</span>}
    </Link>
  );
}
