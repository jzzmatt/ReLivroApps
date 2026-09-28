import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import {authLoginUrl} from "@/lib/auth-redirect";
import {AppShell} from "@/components/AppShell";
import {MessageComposer} from "@/components/MessageComposer";
import {MessageThreadClient} from "@/components/MessageThreadClient";
import {fetchThreadMessageBatch} from "@/lib/message-thread-fetch";
import {MESSAGE_THREAD_PAGE_SIZE} from "@/lib/message-thread-query";
import {
  isSellerSide,
  otherParticipantId,
  participantName,
} from "@/lib/conversation-participant";
import {conversationT} from "@/lib/i18n-conversation";
import {localeTag} from "@/lib/locale-format";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";
import {oneRelation} from "@/lib/supabase-relations";

export default async function ConversationPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const locale = await getRequestLocale();
  const t = conversationT(locale);
  const numberLocale = localeTag(locale);

  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect(authLoginUrl(`/messages/${id}`));

  const {data: conversation} = await s
    .from("conversations")
    .select(
      "id,book_id,buyer_id,seller_id,books(id,title,price_kz,city,status), buyer:profiles!conversations_buyer_id_fkey(display_name), seller:profiles!conversations_seller_id_fkey(display_name)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!conversation) notFound();
  if (conversation.buyer_id !== user.id && conversation.seller_id !== user.id) notFound();

  const book = oneRelation(conversation.books);
  const otherId = otherParticipantId(conversation, user.id);
  const otherProfile =
    user.id === conversation.buyer_id
      ? oneRelation(
          conversation.seller as {display_name: string | null} | {display_name: string | null}[],
        )
      : oneRelation(
          conversation.buyer as {display_name: string | null} | {display_name: string | null}[],
        );
  const otherName = participantName(otherProfile, t.memberFallback);
  const otherIsSeller = isSellerSide(conversation, otherId);

  const {messages, hasOlder} = await fetchThreadMessageBatch(s, id, {
    limit: MESSAGE_THREAD_PAGE_SIZE,
  });

  await s.rpc("mark_conversation_messages_read", {p_conversation_id: id});

  return (
    <AppShell>
      <section className="conversation-page container">
        <Link className="back-link" href="/messages">
          {t.back}
        </Link>
        <div className="conversation-header">
          <div>
            <span className="eyebrow">{t.bookEyebrow}</span>
            <h1>{book?.title || t.bookFallback}</h1>
            <p className="conversation-partner-line">
              {t.chatWith}{" "}
              {otherIsSeller ? (
                <Link href={"/seller/" + otherId}>{otherName}</Link>
              ) : (
                <strong>{otherName}</strong>
              )}
            </p>
            <p>
              {Number(book?.price_kz || 0).toLocaleString(numberLocale)} Kz · {book?.city || t.defaultCountry}
            </p>
            {otherIsSeller && user.id === conversation.buyer_id && (
              <Link className="conversation-seller-link" href={"/seller/" + otherId}>
                {t.viewSeller}
              </Link>
            )}
          </div>
          <Link className="secondary-button" href={"/books/" + conversation.book_id}>
            {t.viewBook}
          </Link>
        </div>
        <MessageThreadClient
          conversationId={id}
          messages={messages}
          hasOlder={hasOlder}
          pageSize={MESSAGE_THREAD_PAGE_SIZE}
          userId={user.id}
          locale={locale}
        />
        <MessageComposer conversationId={id} />
      </section>
    </AppShell>
  );
}
