import type {SupabaseClient} from "@supabase/supabase-js";

export async function userCanAccessConversation(
  supabase: SupabaseClient,
  userId: string,
  conversationId: string,
): Promise<boolean> {
  const {data} = await supabase
    .from("conversations")
    .select("buyer_id,seller_id")
    .eq("id", conversationId)
    .maybeSingle();

  if (!data) return false;
  return data.buyer_id === userId || data.seller_id === userId;
}
