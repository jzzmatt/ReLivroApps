import {NextRequest, NextResponse} from "next/server";
import {publicApiErrorMessage} from "@/lib/api-errors";
import {
  CONVERSATIONS_INBOX_SELECT,
  type ConversationInboxRow,
} from "@/lib/conversation-inbox-query";
import {inboxViewsForConversationRows} from "@/lib/inbox-view-model";
import {getRequestLocale} from "@/lib/locale-server";
import {MARKETPLACE_PAGE_SIZE} from "@/lib/marketplace-query";
import {unreadConversationIds} from "@/lib/messages-unread";
import {createClient} from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error: "Authentication required"}, {status: 401});

  const locale = await getRequestLocale();
  const {searchParams} = request.nextUrl;
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    48,
    Math.max(1, Number.parseInt(searchParams.get("limit") || String(MARKETPLACE_PAGE_SIZE), 10) || MARKETPLACE_PAGE_SIZE),
  );
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {data, error, count} = await supabase
    .from("conversations")
    .select(CONVERSATIONS_INBOX_SELECT, {count: "exact"})
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", {ascending: false})
    .range(from, to);

  if (error) return NextResponse.json({error: publicApiErrorMessage(error)}, {status: 500});

  const rows = (data || []) as ConversationInboxRow[];
  const unreadIds = await unreadConversationIds(supabase, user.id);
  const items = await inboxViewsForConversationRows(supabase, rows, user.id, locale, unreadIds);

  const total = count ?? 0;
  return NextResponse.json({
    items,
    page,
    limit,
    total,
    hasMore: to + 1 < total,
  });
}
