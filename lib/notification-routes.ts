export type NotificationLinkFields = {
  conversation_id?: string | null;
  book_id?: string | null;
};

/** Deep link for in-app notification rows. */
export function notificationTargetPath(n: NotificationLinkFields): string {
  if (n.conversation_id) return `/messages/${n.conversation_id}`;
  if (n.book_id) return `/books/${n.book_id}`;
  return "/notifications";
}
