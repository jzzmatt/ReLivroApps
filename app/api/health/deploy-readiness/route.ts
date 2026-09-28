import {NextResponse} from "next/server";
import {getDeployReadiness} from "@/lib/deploy-readiness";

/** Safe pre-beta checklist for operators (no secrets). */
export async function GET(request: Request) {
  const origin = request.headers.get("origin") || request.headers.get("x-forwarded-host");
  const requestOrigin =
    origin && !origin.startsWith("http")
      ? `https://${origin}`
      : origin || new URL(request.url).origin;
  const report = getDeployReadiness(requestOrigin);
  return NextResponse.json(report, {status: report.ready ? 200 : 503});
}
