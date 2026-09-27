/** Message rows for conversation thread SSR and API. */
export const MESSAGE_THREAD_PAGE_SIZE = 40;

export const MESSAGE_THREAD_SELECT = "id,sender_id,body,created_at";

export type ThreadMessage = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};
