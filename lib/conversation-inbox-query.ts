/** Inbox list query shape for SSR and paginated API. */
export const CONVERSATIONS_INBOX_SELECT =
  "id,book_id,last_message_at,books(title,price_kz),buyer_id,seller_id, buyer:profiles!conversations_buyer_id_fkey(display_name), seller:profiles!conversations_seller_id_fkey(display_name)";

export type ConversationInboxRow = {
  id: string;
  book_id: string;
  last_message_at: string;
  buyer_id: string;
  seller_id: string;
  books: {title: string; price_kz: number} | {title: string; price_kz: number}[] | null;
  buyer: {display_name: string | null} | {display_name: string | null}[] | null;
  seller: {display_name: string | null} | {display_name: string | null}[] | null;
};
