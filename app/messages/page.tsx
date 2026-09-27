import Link from "next/link";
import {redirect} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {
  isSellerSide,
  otherParticipantId,
  participantName,
} from "@/lib/conversation-participant";
import {conversationT} from "@/lib/i18n-conversation";
import {messages} from "@/lib/i18n";
import {latestMessagesByConversation, truncatePreview} from "@/lib/messages-inbox";
import {localeTag} from "@/lib/locale-format";
import {getRequestLocale} from "@/lib/locale-server";
import {unreadConversationIds} from "@/lib/messages-unread";
import {oneRelation} from "@/lib/supabase-relations";
import {createClient} from "@/lib/supabase/server";

type ConversationRow = {
  id: string;
  book_id: string;
  last_message_at: string;
  buyer_id: string;
  seller_id: string;
  books: {title: string; price_kz: number} | {title: string; price_kz: number}[] | null;
  buyer: {display_name: string | null} | {display_name: string | null}[] | null;
  seller: {display_name: string | null} | {display_name: string | null}[] | null;
};

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
    .select(
      "id,book_id,last_message_at,books(title,price_kz),buyer_id,seller_id, buyer:profiles!conversations_buyer_id_fkey(display_name), seller:profiles!conversations_seller_id_fkey(display_name)",
    )
    .or("buyer_id.eq." + user.id + ",seller_id.eq." + user.id)
    .order("last_message_at", {ascending: false});

  const rows = (data || []) as ConversationRow[];
  const unreadIds = await unreadConversationIds(s, user.id);
  const lastByConversation = await latestMessagesByConversation(
    s,
    rows.map((c) => c.id),
  );

  return (
    <AppShell>
      <section className="messages-page container">
        <span className="eyebrow">{t.messages.eyebrow}</span>
        <h1>{t.messages.title}</h1>
        <p className="messages-intro">{t.messages.intro}</p>
        <div className="conversation-list">
          {rows.length ? (
            rows.map((c) => {
              const book = oneRelation(c.books);
              const hasUnread = unreadIds.has(c.id);
              const last = lastByConversation.get(c.id);
              const otherId = otherParticipantId(c, user.id);
              const otherProfile =
                user.id === c.buyer_id ? oneRelation(c.seller) : oneRelation(c.buyer);
              const otherName = participantName(otherProfile, conv.memberFallback);
              const preview = last
                ? last.sender_id === user.id
                  ? `${conv.previewYou} ${truncatePreview(last.body)}`
                  : truncatePreview(last.body)
                : conv.previewEmpty;
              const when = last?.created_at || c.last_message_at;
              return (
                <Link
                  href={"/messages/" + c.id}
                  className={"conversation-row" + (hasUnread ? " unread" : "")}
                  key={c.id}
                >
                  <div className="conversation-icon">💬</div>
                  <div className="conversation-row-main">
                    <div className="conversation-row-top">
                      <strong>{book?.title || conv.bookFallback}</strong>
                      {when && (
                        <small className="conversation-time">
                          {new Date(when).toLocaleDateString(numberLocale)}
                        </small>
                      )}
                    </div>
                    <p className="conversation-participant-name">{otherName}</p>
                    <p className="conversation-preview">{preview}</p>
                    <p className="conversation-price">
                      {Number(book?.price_kz || 0).toLocaleString(numberLocale)} Kz
                    </p>
                    {hasUnread && <span className="conversation-unread-label">{conv.unread}</span>}
                    {isSellerSide(c, otherId) && user.id === c.buyer_id && (
                      <span className="conversation-seller-hint">{conv.viewSeller}</span>
                    )}
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
