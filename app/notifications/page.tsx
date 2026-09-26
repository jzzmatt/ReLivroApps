import Link from "next/link";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";
import {messages, type Locale} from "@/lib/i18n";
import {localeTag} from "@/lib/locale-format";

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("relivro-locale")?.value as Locale) || "pt";
  const t = messages[locale];
  const numberLocale = localeTag(locale);
  const s = await createClient();
  const {data: {user}} = await s.auth.getUser();
  if (!user) redirect("/auth");
  const {data} = await s.from("notifications")
    .select("id,title,body,conversation_id,book_id,is_read,created_at")
    .eq("user_id", user.id)
    .order("created_at", {ascending: false});

  return (
    <AppShell>
      <section className="profile-page container">
        <span className="eyebrow">{t.notifications.eyebrow}</span>
        <h1>{t.notifications.title}</h1>
        <div className="notification-list">
          {data?.length ? data.map(n => (
            <Link
              className={"notification-row " + (!n.is_read ? "unread" : "")}
              href={n.conversation_id ? "/messages/" + n.conversation_id : "/books/" + n.book_id}
              key={n.id}
            >
              <div>
                <strong>{n.title}</strong>
                <p>{n.body}</p>
              </div>
              <small>{new Date(n.created_at).toLocaleDateString(numberLocale)}</small>
            </Link>
          )) : (
            <div className="empty-state">
              <h2>{t.notifications.emptyTitle}</h2>
              <p>{t.notifications.emptyText}</p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
