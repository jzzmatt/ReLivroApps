import Link from "next/link";
import {redirect} from "next/navigation";
import {authLoginUrl} from "@/lib/auth-redirect";
import {AppShell} from "@/components/AppShell";
import {MessagesInboxClient} from "@/components/MessagesInboxClient";
import {
  CONVERSATIONS_INBOX_SELECT,
  type ConversationInboxRow,
} from "@/lib/conversation-inbox-query";
import {inboxViewsForConversationRows} from "@/lib/inbox-view-model";
import {messages} from "@/lib/i18n";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {MARKETPLACE_PAGE_SIZE} from "@/lib/marketplace-query";
import {getRequestLocale} from "@/lib/locale-server";
import {unreadConversationIds} from "@/lib/messages-unread";
import {createClient} from "@/lib/supabase/server";

export default async function MessagesPage() {
  const locale = await getRequestLocale();
  const t = messages[locale];
  const loadMoreLabels = marketplaceT(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect(authLoginUrl("/messages"));

  const {data, count} = await s
    .from("conversations")
    .select(CONVERSATIONS_INBOX_SELECT, {count: "exact"})
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", {ascending: false})
    .range(0, MARKETPLACE_PAGE_SIZE - 1);

  const rows = (data || []) as ConversationInboxRow[];
  const totalConversations = count ?? rows.length;
  const unreadIds = await unreadConversationIds(s, user.id);
  const items = await inboxViewsForConversationRows(s, rows, user.id, locale, unreadIds);

  return (
    <AppShell>
      <section className="messages-page container">
        <span className="eyebrow">{t.messages.eyebrow}</span>
        <h1>{t.messages.title}</h1>
        <p className="messages-intro">{t.messages.intro}</p>
        {totalConversations === 0 ? (
          <div className="empty-state">
            <h2>{t.messages.emptyTitle}</h2>
            <p>{t.messages.emptyText}</p>
            <Link className="button" href="/books">
              {t.messages.explore}
            </Link>
          </div>
        ) : (
          <MessagesInboxClient
            items={items}
            totalConversations={totalConversations}
            pageSize={MARKETPLACE_PAGE_SIZE}
            locale={locale}
            loadMoreLabels={loadMoreLabels}
          />
        )}
      </section>
    </AppShell>
  );
}
