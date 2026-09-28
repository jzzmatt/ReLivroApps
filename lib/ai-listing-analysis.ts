import {parseSuggestedCondition} from "@/lib/ai-condition";
import type {BookCondition} from "@/lib/books";
import {INSPECTION_SLOTS, type InspectionSlot} from "@/lib/inspection-photos";

export type ListingPhotoAnalysis = {
  condition: BookCondition;
  note: string;
  selected_image: InspectionSlot;
  confidence: number;
  reason: string;
};

export async function analyzeListingPhotos(
  images: {mime: string; base64: string}[],
): Promise<ListingPhotoAnalysis | {unavailable: true} | {failed: true}> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return {unavailable: true};
  if (images.length < INSPECTION_SLOTS.length) return {failed: true};

  const slotList = INSPECTION_SLOTS.join(", ");
  const content: Array<{type: string; text?: string; image_url?: {url: string}}> = [
    {
      type: "text",
      text: [
        "You inspect used school-book listing photos in order:",
        slotList + ".",
        "Reply with JSON only:",
        '{"condition":"Como novo"|"Muito bom"|"Bom estado"|"Usado","note":"one short sentence in Portuguese",',
        '"selected_image":"front_cover"|"back_cover"|"first_page"|"middle_page"|"last_page",',
        '"confidence":0.0-1.0,"reason":"short English reason for thumbnail choice"}.',
        "condition must be exactly one of the four Portuguese labels.",
        "selected_image must be the best marketplace thumbnail: clarity, lighting, composition, readable at small size.",
        "Prefer front_cover when suitable; pick another slot if front cover is blurry, dark, or cluttered.",
        "Do not invent damage you cannot see.",
      ].join(" "),
    },
    ...images.slice(0, INSPECTION_SLOTS.length).map((image) => ({
      type: "image_url",
      image_url: {url: `data:${image.mime};base64,${image.base64}`},
    })),
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CONDITION_MODEL?.trim() || "gpt-4o-mini",
        response_format: {type: "json_object"},
        messages: [{role: "user", content}],
      }),
    });
    if (!response.ok) return {failed: true};
    const payload = (await response.json()) as {
      choices?: {message?: {content?: string}}[];
    };
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) return {failed: true};
    const parsed = JSON.parse(raw) as {
      condition?: unknown;
      note?: unknown;
      selected_image?: unknown;
      confidence?: unknown;
      reason?: unknown;
    };
    const condition = parseSuggestedCondition(parsed.condition);
    const selected_image =
      typeof parsed.selected_image === "string" &&
      (INSPECTION_SLOTS as readonly string[]).includes(parsed.selected_image)
        ? (parsed.selected_image as InspectionSlot)
        : null;
    if (!condition || !selected_image) return {failed: true};
    const note = typeof parsed.note === "string" ? parsed.note.slice(0, 280) : "";
    const confidence =
      typeof parsed.confidence === "number" && Number.isFinite(parsed.confidence)
        ? Math.min(1, Math.max(0, parsed.confidence))
        : 0.5;
    const reason =
      typeof parsed.reason === "string" ? parsed.reason.slice(0, 400) : "Selected for marketplace display.";
    return {condition, note, selected_image, confidence, reason};
  } catch {
    return {failed: true};
  }
}
