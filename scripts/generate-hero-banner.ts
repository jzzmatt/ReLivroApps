/**
 * One-time / manual hero banner generation (server-side only).
 * Usage: OPENAI_API_KEY=... npm run generate:hero
 * Never commit the API key. Never call from the Next.js app at runtime.
 */
import fs from "node:fs";
import path from "node:path";
import OpenAI, {type Uploadable} from "openai";

const OUTPUT = path.join(process.cwd(), "public/asset/reLivroApps-hero-banner-16x9.png");

const DEFAULT_REFERENCE = path.join(
  process.cwd(),
  "scripts/reference/reLivroApps-hero-reference.png",
);

export const HERO_BANNER_PROMPT = `Create a premium 16:9 landscape hero illustration based strongly on the supplied reference image.

Preserve the reference image's visual identity: young African students, school books, reading, school environment, warm sunlight, green vegetation, joyful expressions, contemporary African educational atmosphere and polished editorial illustration style.

Create a refined and premium version specifically for a modern African educational technology platform called ReLivroApps.

The visual story should communicate reading, learning, sharing, knowledge and community through imagery only.

Show two or three young African students naturally interacting with school books in a contemporary school environment. At least one student should be reading while another student holds or carries school books.

Preserve the authentic warmth and optimism of the reference image.

Use elegant educational objects, books, notebooks, subtle geometric educational shapes and very subtle digital technology elements.

Create a sophisticated premium editorial illustration with realistic-but-stylized African characters, natural facial expressions, warm sunlight, soft depth, elegant composition and high-quality digital painting.

The colour palette should harmonize with deep navy, warm ivory, cream, orange, green, royal blue, soft yellow and terracotta.

COMPOSITION:

The left 35–40 percent of the image must remain visually calm and relatively low-detail because real HTML website text will be placed over this area.

Place the strongest visual storytelling in the centre-right and right side.

Place the students and books primarily toward the right.

Maintain strong negative space on the left.

The image must work as a landing-page hero background behind real HTML typography.

CRITICAL:

Do not generate any readable text.

Do not generate letters.

Do not generate numbers.

Do not generate slogans.

Do not generate logos.

Do not generate brand names.

Do not generate book titles.

Do not generate school signs containing words.

Do not generate interface elements.

Do not generate buttons.

Do not generate navigation.

Do not reproduce any readable text from the reference image.

Books may contain only abstract, non-readable graphic artwork.

The final image must be language-neutral.

No watermark.

No text.

No logo.

Premium African educational technology visual identity.

High-end editorial landing-page hero artwork.

16:9 landscape composition.`;

function resolveReferencePath(): string | null {
  const fromEnv = process.env.HERO_REFERENCE_IMAGE?.trim();
  const candidate = fromEnv
    ? path.isAbsolute(fromEnv)
      ? fromEnv
      : path.join(process.cwd(), fromEnv)
    : DEFAULT_REFERENCE;

  if (!fs.existsSync(candidate)) {
    if (fromEnv) {
      console.warn(`HERO_REFERENCE_IMAGE not found: ${candidate}. Generating from prompt only.`);
    } else {
      console.warn(
        `Default reference not found at ${candidate}. Generating from prompt only (add scripts/reference/reLivroApps-hero-reference.png).`,
      );
    }
    return null;
  }
  return candidate;
}

function toUploadable(filePath: string): Uploadable {
  return fs.createReadStream(filePath);
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    console.error("OPENAI_API_KEY is required. Set it in your environment (never commit it).");
    process.exit(1);
  }

  const model = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";
  const client = new OpenAI({apiKey});
  const size = model.startsWith("gpt-image-2") ? "1536x864" : "1536x1024";
  const referencePath = resolveReferencePath();

  const response = referencePath
    ? await client.images.edit({
        model,
        image: toUploadable(referencePath),
        prompt: HERO_BANNER_PROMPT,
        n: 1,
        size,
        quality: "high",
        output_format: "png",
        input_fidelity: "high",
      })
    : await client.images.generate({
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
  console.log(
    `Saved hero banner to ${OUTPUT} (${model}, ${size}${referencePath ? ", reference edit" : ", prompt only"})`,
  );
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : "Unknown error";
  console.error("Hero generation failed:", message);
  process.exit(1);
});
