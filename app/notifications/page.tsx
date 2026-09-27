import {redirect} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {NotificationsPaginatedClient} from "@/components/NotificationsPaginatedClient";
import {messages} from "@/lib/i18n";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {MARKETPLACE_PAGE_SIZE} from "@/lib/marketplace-query";
import {NOTIFICATIONS_LIST_SELECT, type NotificationRow} from "@/lib/notifications-query";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";
import {markAllNotificationsRead} from "@/app/notifications/actions";
import {pushReadinessT} from "@/lib/i18n-push-readiness";

export default async function NotificationsPage() {
  const locale = await getRequestLocale();
  const t = messages[locale];
  const loadMoreLabels = marketplaceT(locale);
  const pushHint = pushReadinessT(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");

  const [{data, count}, {count: unreadCount}] = await Promise.all([
    s
      .from("notifications")
      .select(NOTIFICATIONS_LIST_SELECT, {count: "exact"})
      .eq("user_id", user.id)
      .order("created_at", {ascending: false})
      .range(0, MARKETPLACE_PAGE_SIZE - 1),
    s
      .from("notifications")
      .select("id", {count: "exact", head: true})
      .eq("user_id", user.id)
      .eq("is_read", false),
  ]);

  const rows = (data || []) as NotificationRow[];
  const totalNotifications = count ?? rows.length;

  return (
    <AppShell>
      <section className="profile-page container">
        <div className="notifications-head">
          <div>
            <span className="eyebrow">{t.notifications.eyebrow}</span>
            <h1>{t.notifications.title}</h1>
          </div>
          {(unreadCount ?? 0) > 0 && (
            <form action={markAllNotificationsRead}>
              <button type="submit" className="secondary-button button-small">
                {t.notifications.markAllRead}
              </button>
            </form>
          )}
        </div>
        <aside className="push-readiness-note" aria-label={pushHint.title}>
          <strong>{pushHint.title}</strong>
          <p>{pushHint.body}</p>
        </aside>
        {totalNotifications === 0 ? (
          <div className="empty-state">
            <h2>{t.notifications.emptyTitle}</h2>
            <p>{t.notifications.emptyText}</p>
          </div>
        ) : (
          <NotificationsPaginatedClient
            items={rows}
            totalNotifications={totalNotifications}
            pageSize={MARKETPLACE_PAGE_SIZE}
            locale={locale}
            loadMoreLabels={loadMoreLabels}
          />
        )}
      </section>
    </AppShell>
  );
}
