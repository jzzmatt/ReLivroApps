import Link from "next/link";
import {fillTemplate, workspaceT} from "@/lib/i18n-workspace";
import type {Locale} from "@/lib/i18n";

export function WorkspaceInboxCards({
  locale,
  unreadNotifications,
  unreadMessages,
}: {
  locale: Locale;
  unreadNotifications: number;
  unreadMessages: number;
}) {
  const t = workspaceT(locale);
  return (
    <div className="workspace-inbox">
      <section className="workspace-panel">
        <h2>{t.notificationsTitle}</h2>
        <p>
          {unreadNotifications > 0
            ? fillTemplate(t.notificationsUnread, {count: unreadNotifications})
            : t.notificationsEmpty}
        </p>
        <Link className="secondary-button" href="/notifications">
          {t.notificationsCta}
        </Link>
      </section>
      <section className="workspace-panel">
        <h2>{t.conversationsTitle}</h2>
        <p>
          {unreadMessages > 0
            ? fillTemplate(t.conversationsUnread, {count: unreadMessages})
            : t.conversationsEmpty}
        </p>
        <Link className="secondary-button" href="/messages">
          {t.conversationsCta}
        </Link>
      </section>
    </div>
  );
}
