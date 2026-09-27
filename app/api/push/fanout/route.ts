import {NextResponse} from "next/server";
import {createAdminClient} from "@/lib/supabase/admin";
import {createClient} from "@/lib/supabase/server";
import {sendWebPush, type PushSubscriptionRow} from "@/lib/web-push-server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error: "auth"}, {status: 401});

  const body = (await request.json().catch(() => null)) as {conversationId?: unknown} | null;
  const conversationId = typeof body?.conversationId === "string" ? body.conversationId : "";
  if (!UUID.test(conversationId)) return NextResponse.json({error: "invalid"}, {status: 400});

  const {data: conversation} = await supabase
    .from("conversations")
    .select("buyer_id,seller_id")
    .eq("id", conversationId)
    .maybeSingle();
  if (!conversation || (conversation.buyer_id !== user.id && conversation.seller_id !== user.id)) {
    return NextResponse.json({error: "forbidden"}, {status: 403});
  }

  const recipientId = conversation.buyer_id === user.id ? conversation.seller_id : conversation.buyer_id;
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({sent: 0});

  const {data: rows} = await admin
    .from("push_subscriptions")
    .select("endpoint,p256dh,auth")
    .eq("user_id", recipientId);
  const subscriptions = (rows || []) as PushSubscriptionRow[];
  let sent = 0;
  for (const subscription of subscriptions) {
    const result = await sendWebPush(subscription, {
      title: "Nova mensagem",
      body: "Recebeu uma nova mensagem.",
      url: `/messages/${conversationId}`,
    });
    if (result === "sent") sent += 1;
    if (result === "gone") {
      await admin.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
    }
  }
  return NextResponse.json({sent});
}
