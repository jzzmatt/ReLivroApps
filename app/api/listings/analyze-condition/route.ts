import {NextResponse} from "next/server";
import {suggestBookCondition} from "@/lib/ai-condition";
import {INSPECTION_SLOTS, inspectionFileError} from "@/lib/inspection-photos";
import {createClient} from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error: "auth"}, {status: 401});

  const form = await request.formData();
  const images: {mime: string; base64: string}[] = [];

  for (const slot of INSPECTION_SLOTS) {
    const value = form.get(slot);
    if (!(value instanceof File)) return NextResponse.json({error: "missing"}, {status: 400});
    const problem = inspectionFileError(value);
    if (problem) return NextResponse.json({error: problem}, {status: 400});
    const bytes = Buffer.from(await value.arrayBuffer());
    images.push({mime: value.type, base64: bytes.toString("base64")});
  }

  const result = await suggestBookCondition(images);
  if ("unavailable" in result) return NextResponse.json({error: "unavailable"}, {status: 503});
  if ("failed" in result) return NextResponse.json({error: "failed"}, {status: 502});
  return NextResponse.json({condition: result.condition, note: result.note});
}
