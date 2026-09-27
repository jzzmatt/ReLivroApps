/** Notifications list shape for SSR and paginated API. */
export const NOTIFICATIONS_LIST_SELECT =
  "id,title,body,conversation_id,book_id,is_read,created_at";

export type NotificationRow = {
  id: string;
  title: string;
  body: string | null;
  conversation_id: string | null;
  book_id: string | null;
  is_read: boolean;
  created_at: string;
};
