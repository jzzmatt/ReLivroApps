/**
 * One-time / manual hero banner generation (server-side only).
 * Usage: OPENAI_API_KEY=... npm run generate:hero
 * Never commit the API key. Never call from the Next.js app at runtime.
 */
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

const OUTPUT = path.join(process.cwd(), "public/asset/reLivroApps-hero-banner-16x9.png");

export const HERO_BANNER_PROMPT = `Create a premium 16:9 editorial hero illustration for a modern African educational technology platform focused on school-book discovery, exchange and community.

The scene should communicate reading, learning, sharing, discovery and educational opportunity.

Show a warm contemporary African educational environment inspired by Angola, with diverse young African students naturally interacting with school books, notebooks and subtle digital technology.

Include beautifully designed school books, floating or naturally arranged educational objects, subtle geometric elements and a feeling of movement and discovery.

The visual should feel optimistic, human and community-oriented.

Use a sophisticated contemporary editorial illustration aesthetic with subtle depth, elegant shapes, soft natural lighting and premium product-brand art direction.

Colour palette should harmonize with: deep navy, warm ivory cream, ReLivroApps orange, fresh green, royal blue, soft warm yellow, subtle terracotta.

COMPOSITION: The LEFT third of the image must remain visually calm and relatively empty. The LEFT area is reserved for HTML website content and CTA overlay. The strongest visual storytelling should happen in the CENTER-RIGHT and RIGHT side. Place students, books, educational objects and visual energy primarily toward the RIGHT side. Maintain sufficient negative space around the left area.

IMPORTANT: Generate ZERO readable text. Generate ZERO typography. Generate ZERO letters. Generate ZERO numbers. Generate ZERO logos. Generate ZERO buttons. Generate ZERO navigation. Generate ZERO fake UI. Generate ZERO brand names. Generate ZERO book titles. Do not render words on books, notebooks, screens, signs or objects. Any book covers should use abstract patterns, simple geometric artwork or completely unreadable non-text visual decoration.

The final artwork must function as a pure visual background hero illustration suitable for overlaying real HTML text on top. Premium African educational technology brand aesthetic. Clean composition. High visual quality. Natural human representation. Modern editorial illustration. No watermark. Landscape 16:9 composition.`;

async function main() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    console.error("OPENAI_API_KEY is required. Set it in your environment (never commit it).");
    process.exit(1);
  }

  const model = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";
  const client = new OpenAI({apiKey});

  const size =
    model.startsWith("gpt-image-2") ? "1536x864" : "1536x1024";

  const response = await client.images.generate({
    model,
    prompt: HERO_BANNER_PROMPT,
    n: 1,
    size,
    quality: "high",
    output_format: "png",
  });

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) {
    console.error("No image data returned from the API.");
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUTPUT), {recursive: true});
  fs.writeFileSync(OUTPUT, Buffer.from(b64, "base64"));
  console.log(`Saved hero banner to ${OUTPUT} (${model}, ${size})`);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : "Unknown error";
  console.error("Hero generation failed:", message);
  process.exit(1);
});
