"use client";

import Link from "next/link";
import {useCallback, useState} from "react";
import {shellT} from "@/lib/i18n-shell";
import {createClient} from "@/lib/supabase/client";
import {useClientLocale} from "@/lib/use-client-locale";
import {useNavBadgeRefresh} from "@/lib/use-nav-badge-refresh";

export function NotificationNavLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const locale = useClientLocale();
  const t = shellT(locale);
  const [unread, setUnread] = useState(0);

  const loadUnread = useCallback(async () => {
    const supabase = createClient();
    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (!user) {
      setUnread(0);
      return;
    }
    const {count} = await supabase
      .from("notifications")
      .select("id", {count: "exact", head: true})
      .eq("user_id", user.id)
      .eq("is_read", false);
    setUnread(count || 0);
  }, []);

  useNavBadgeRefresh(loadUnread);

  const badge = unread > 99 ? "99+" : String(unread);
  const ariaLabel =
    unread > 0
      ? `${t.ariaNotifications} (${unread})`
      : t.ariaNotifications;

  return (
    <Link href="/notifications" className={className} aria-label={ariaLabel}>
      {children}
      {unread > 0 && <span className="nav-unread-badge">{badge}</span>}
    </Link>
  );
}
