import {isSellerSide, otherParticipantId, participantName} from "@/lib/conversation-participant";
import type {ConversationInboxRow} from "@/lib/conversation-inbox-query";
import {conversationT} from "@/lib/i18n-conversation";
import type {Locale} from "@/lib/i18n";
import {latestMessagesByConversation, truncatePreview, type ConversationLastMessage} from "@/lib/messages-inbox";
import {oneRelation} from "@/lib/supabase-relations";
import type {SupabaseClient} from "@supabase/supabase-js";

export type InboxConversationView = {
  id: string;
  bookTitle: string;
  otherName: string;
  preview: string;
  whenIso: string;
  priceKz: number;
  hasUnread: boolean;
  showSellerHint: boolean;
};

export function mapInboxRowsToViews({
  rows,
  userId,
  locale,
  lastByConversation,
  unreadIds,
}: {
  rows: ConversationInboxRow[];
  userId: string;
  locale: Locale;
  lastByConversation: Map<string, ConversationLastMessage>;
  unreadIds: Set<string>;
}): InboxConversationView[] {
  const conv = conversationT(locale);

  return rows.map((c) => {
    const book = oneRelation(c.books);
    const hasUnread = unreadIds.has(c.id);
    const last = lastByConversation.get(c.id);
    const otherId = otherParticipantId(c, userId);
    const otherProfile = userId === c.buyer_id ? oneRelation(c.seller) : oneRelation(c.buyer);
    const otherName = participantName(otherProfile, conv.memberFallback);
    const preview = last
      ? last.sender_id === userId
        ? `${conv.previewYou} ${truncatePreview(last.body)}`
        : truncatePreview(last.body)
      : conv.previewEmpty;
    const when = last?.created_at || c.last_message_at;

    return {
      id: c.id,
      bookTitle: book?.title || conv.bookFallback,
      otherName,
      preview,
      whenIso: when,
      priceKz: Number(book?.price_kz || 0),
      hasUnread,
      showSellerHint: isSellerSide(c, otherId) && userId === c.buyer_id,
    };
  });
}

export async function inboxViewsForConversationRows(
  supabase: SupabaseClient,
  rows: ConversationInboxRow[],
  userId: string,
  locale: Locale,
  unreadIds: Set<string>,
): Promise<InboxConversationView[]> {
  const lastByConversation = await latestMessagesByConversation(
    supabase,
    rows.map((c) => c.id),
  );
  return mapInboxRowsToViews({rows, userId, locale, lastByConversation, unreadIds});
}
