import Link from "next/link";
import {redirect} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {conversationT} from "@/lib/i18n-conversation";
import {messages} from "@/lib/i18n";
import {localeTag} from "@/lib/locale-format";
import {getRequestLocale} from "@/lib/locale-server";
import {unreadConversationIds} from "@/lib/messages-unread";
import {oneRelation} from "@/lib/supabase-relations";
import {createClient} from "@/lib/supabase/server";

export default async function MessagesPage() {
  const locale = await getRequestLocale();
  const t = messages[locale];
  const conv = conversationT(locale);
  const numberLocale = localeTag(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");

  const {data} = await s
    .from("conversations")
    .select("id,book_id,last_message_at,books(title,price_kz),buyer_id,seller_id")
    .or("buyer_id.eq." + user.id + ",seller_id.eq." + user.id)
    .order("last_message_at", {ascending: false});

  const unreadIds = await unreadConversationIds(s, user.id);

  return (
    <AppShell>
      <section className="messages-page container">
        <span className="eyebrow">{t.messages.eyebrow}</span>
        <h1>{t.messages.title}</h1>
        <p className="messages-intro">{t.messages.intro}</p>
        <div className="conversation-list">
          {data?.length ? (
            data.map((c) => {
              const book = oneRelation(c.books);
              const hasUnread = unreadIds.has(c.id);
              return (
                <Link
                  href={"/messages/" + c.id}
                  className={"conversation-row" + (hasUnread ? " unread" : "")}
                  key={c.id}
                >
                  <div className="conversation-icon">💬</div>
                  <div>
                    <strong>{book?.title || conv.bookFallback}</strong>
                    <p>{Number(book?.price_kz || 0).toLocaleString(numberLocale)} Kz</p>
                    {hasUnread && <span className="conversation-unread-label">{conv.unread}</span>}
                  </div>
                  <span>→</span>
                </Link>
              );
            })
          ) : (
            <div className="empty-state">
              <h2>{t.messages.emptyTitle}</h2>
              <p>{t.messages.emptyText}</p>
              <Link className="button" href="/books">
                {t.messages.explore}
              </Link>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
