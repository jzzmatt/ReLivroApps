import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error: "auth"}, {status: 401});

  const body = (await request.json().catch(() => null)) as {
    endpoint?: unknown;
    keys?: {p256dh?: unknown; auth?: unknown};
  } | null;
  const endpoint = typeof body?.endpoint === "string" ? body.endpoint : "";
  const p256dh = typeof body?.keys?.p256dh === "string" ? body.keys.p256dh : "";
  const auth = typeof body?.keys?.auth === "string" ? body.keys.auth : "";

  const {error} = await supabase.rpc("save_push_subscription", {
    p_endpoint: endpoint,
    p_p256dh: p256dh,
    p_auth: auth,
  });
  if (error) return NextResponse.json({error: "invalid"}, {status: 400});
  return NextResponse.json({ok: true});
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error: "auth"}, {status: 401});

  const body = (await request.json().catch(() => null)) as {endpoint?: unknown} | null;
  const endpoint = typeof body?.endpoint === "string" ? body.endpoint : "";
  if (!endpoint) return NextResponse.json({error: "invalid"}, {status: 400});

  const {error} = await supabase.from("push_subscriptions").delete().eq("user_id", user.id).eq("endpoint", endpoint);
  if (error) return NextResponse.json({error: "invalid"}, {status: 400});
  return NextResponse.json({ok: true});
}
