import sharp from "sharp";
import {INSPECTION_SLOTS, type InspectionSlot} from "@/lib/inspection-photos";

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1600;
const BACKGROUND = {r: 255, g: 250, b: 241, alpha: 1};

export async function prepareMarketplaceThumbnailBytes(source: Buffer): Promise<Buffer> {
  const image = sharp(source).rotate();
  const metadata = await image.metadata();
  const width = metadata.width ?? MAX_WIDTH;
  const height = metadata.height ?? MAX_HEIGHT;
  const ratio = width / height;
  const targetRatio = 3 / 4;

  if (ratio > targetRatio * 1.15 || ratio < targetRatio / 1.15) {
    return image
      .resize(MAX_WIDTH, MAX_HEIGHT, {fit: "inside", withoutEnlargement: true})
      .flatten({background: BACKGROUND})
      .webp({quality: 86})
      .toBuffer();
  }

  return image
    .resize(MAX_WIDTH, MAX_HEIGHT, {fit: "cover", position: "centre", withoutEnlargement: true})
    .webp({quality: 86})
    .toBuffer();
}

export function defaultThumbnailSlot(): InspectionSlot {
  return INSPECTION_SLOTS[0];
}
