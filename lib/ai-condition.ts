import type {BookCondition} from "@/lib/books";

const CONDITIONS: BookCondition[] = ["Como novo", "Muito bom", "Bom estado", "Usado"];

const ALIASES: Record<string, BookCondition> = {
  "como novo": "Como novo",
  "like new": "Como novo",
  "muito bom": "Muito bom",
  "very good": "Muito bom",
  "bom estado": "Bom estado",
  "good condition": "Bom estado",
  good: "Bom estado",
  usado: "Usado",
  used: "Usado",
};

export function parseSuggestedCondition(value: unknown): BookCondition | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if ((CONDITIONS as string[]).includes(trimmed)) return trimmed as BookCondition;
  return ALIASES[trimmed.toLowerCase()] ?? null;
}

export async function suggestBookCondition(
  images: {mime: string; base64: string}[],
): Promise<{condition: BookCondition; note: string} | {unavailable: true} | {failed: true}> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return {unavailable: true};
  if (images.length === 0) return {failed: true};

  const content: Array<{type: string; text?: string; image_url?: {url: string}}> = [
    {
      type: "text",
      text: [
        "You inspect used school-book photos.",
        "Reply with JSON only: {\"condition\":\"Como novo\"|\"Muito bom\"|\"Bom estado\"|\"Usado\",\"note\":\"one short sentence\"}.",
        "condition must be exactly one of those four Portuguese labels.",
        "This is a suggestion. Do not invent damage you cannot see.",
      ].join(" "),
    },
    ...images.slice(0, 5).map((image) => ({
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
    const parsed = JSON.parse(raw) as {condition?: unknown; note?: unknown};
    const condition = parseSuggestedCondition(parsed.condition);
    if (!condition) return {failed: true};
    const note = typeof parsed.note === "string" ? parsed.note.slice(0, 280) : "";
    return {condition, note};
  } catch {
    return {failed: true};
  }
}
