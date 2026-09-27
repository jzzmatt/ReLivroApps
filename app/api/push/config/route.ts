import {NextResponse} from "next/server";
import {vapidPublicKey} from "@/lib/web-push-server";

export async function GET() {
  const publicKey = vapidPublicKey();
  if (!publicKey) return NextResponse.json({error: "unconfigured"}, {status: 503});
  return NextResponse.json({publicKey});
}
