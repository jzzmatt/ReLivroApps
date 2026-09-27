import type {SupabaseClient} from "@supabase/supabase-js";

export type ConversationLastMessage = {
  conversation_id: string;
  body: string;
  sender_id: string;
  created_at: string;
};

/** Latest message per conversation (for inbox previews). */
export async function latestMessagesByConversation(
  supabase: SupabaseClient,
  conversationIds: string[],
): Promise<Map<string, ConversationLastMessage>> {
  const map = new Map<string, ConversationLastMessage>();
  if (conversationIds.length === 0) return map;

  const {data} = await supabase
    .from("messages")
    .select("conversation_id,body,sender_id,created_at")
    .in("conversation_id", conversationIds)
    .order("created_at", {ascending: false});

  for (const row of data || []) {
    if (!map.has(row.conversation_id)) {
      map.set(row.conversation_id, row);
    }
  }
  return map;
}

export function truncatePreview(text: string, max = 72): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max - 1) + "…";
}
