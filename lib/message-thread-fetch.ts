import type {SupabaseClient} from "@supabase/supabase-js";
import {
  MESSAGE_THREAD_PAGE_SIZE,
  MESSAGE_THREAD_SELECT,
  type ThreadMessage,
} from "@/lib/message-thread-query";

export async function fetchThreadMessageBatch(
  supabase: SupabaseClient,
  conversationId: string,
  options?: {limit?: number; before?: string | null},
): Promise<{messages: ThreadMessage[]; total: number; hasOlder: boolean}> {
  const limit = options?.limit ?? MESSAGE_THREAD_PAGE_SIZE;
  const before = options?.before;

  const {count: totalCount} = await supabase
    .from("messages")
    .select("id", {count: "exact", head: true})
    .eq("conversation_id", conversationId);

  const total = totalCount ?? 0;

  let query = supabase
    .from("messages")
    .select(MESSAGE_THREAD_SELECT)
    .eq("conversation_id", conversationId)
    .order("created_at", {ascending: false})
    .limit(limit);

  if (before) query = query.lt("created_at", before);

  const {data, error} = await query;
  if (error) throw error;

  const messages = ((data || []) as ThreadMessage[]).slice().reverse();
  const oldest = messages[0]?.created_at ?? null;

  let hasOlder = false;
  if (oldest) {
    const {count: olderCount} = await supabase
      .from("messages")
      .select("id", {count: "exact", head: true})
      .eq("conversation_id", conversationId)
      .lt("created_at", oldest);
    hasOlder = (olderCount ?? 0) > 0;
  }

  return {messages, total, hasOlder};
}
