import {redirect} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {NotificationList} from "@/components/NotificationList";
import {messages} from "@/lib/i18n";
import {localeTag} from "@/lib/locale-format";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";
import {markAllNotificationsRead} from "@/app/notifications/actions";

export default async function NotificationsPage() {
  const locale = await getRequestLocale();
  const t = messages[locale];
  const numberLocale = localeTag(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");
  const {data} = await s
    .from("notifications")
    .select("id,title,body,conversation_id,book_id,is_read,created_at")
    .eq("user_id", user.id)
    .order("created_at", {ascending: false});

  const rows = data || [];
  const unreadCount = rows.filter((n) => !n.is_read).length;

  return (
    <AppShell>
      <section className="profile-page container">
        <div className="notifications-head">
          <div>
            <span className="eyebrow">{t.notifications.eyebrow}</span>
            <h1>{t.notifications.title}</h1>
          </div>
          {unreadCount > 0 && (
            <form action={markAllNotificationsRead}>
              <button type="submit" className="secondary-button button-small">
                {t.notifications.markAllRead}
              </button>
            </form>
          )}
        </div>
        {rows.length ? (
          <NotificationList items={rows} dateLocale={numberLocale} />
        ) : (
          <div className="empty-state">
            <h2>{t.notifications.emptyTitle}</h2>
            <p>{t.notifications.emptyText}</p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
