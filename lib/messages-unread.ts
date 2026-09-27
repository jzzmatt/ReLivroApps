import type {SupabaseClient} from "@supabase/supabase-js";

/** Conversation ids with at least one unread incoming message for this user. */
export async function unreadConversationIds(
  supabase: SupabaseClient,
  userId: string,
): Promise<Set<string>> {
  const {data: conversations} = await supabase
    .from("conversations")
    .select("id")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

  const ids = (conversations || []).map((c) => c.id);
  if (ids.length === 0) return new Set();

  const {data: unreadRows} = await supabase
    .from("messages")
    .select("conversation_id")
    .in("conversation_id", ids)
    .neq("sender_id", userId)
    .is("read_at", null);

  return new Set((unreadRows || []).map((row) => row.conversation_id));
}

export async function unreadMessageCount(supabase: SupabaseClient, userId: string): Promise<number> {
  const {data: conversations} = await supabase
    .from("conversations")
    .select("id")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

  const ids = (conversations || []).map((c) => c.id);
  if (ids.length === 0) return 0;

  const {count} = await supabase
    .from("messages")
    .select("id", {count: "exact", head: true})
    .in("conversation_id", ids)
    .neq("sender_id", userId)
    .is("read_at", null);

  return count || 0;
}
