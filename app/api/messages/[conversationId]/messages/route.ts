import {NextRequest, NextResponse} from "next/server";
import {publicApiErrorMessage} from "@/lib/api-errors";
import {userCanAccessConversation} from "@/lib/conversation-access";
import {fetchThreadMessageBatch} from "@/lib/message-thread-fetch";
import {MESSAGE_THREAD_PAGE_SIZE} from "@/lib/message-thread-query";
import {createClient} from "@/lib/supabase/server";

type RouteContext = {params: Promise<{conversationId: string}>};

export async function GET(request: NextRequest, context: RouteContext) {
  const {conversationId} = await context.params;
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error: "Authentication required"}, {status: 401});

  const allowed = await userCanAccessConversation(supabase, user.id, conversationId);
  if (!allowed) return NextResponse.json({error: "Not found"}, {status: 404});

  const {searchParams} = request.nextUrl;
  const before = searchParams.get("before");
  const limit = Math.min(
    80,
    Math.max(
      1,
      Number.parseInt(searchParams.get("limit") || String(MESSAGE_THREAD_PAGE_SIZE), 10) ||
        MESSAGE_THREAD_PAGE_SIZE,
    ),
  );

  try {
    const result = await fetchThreadMessageBatch(supabase, conversationId, {
      limit,
      before: before || undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({error: publicApiErrorMessage(error)}, {status: 500});
  }
}
