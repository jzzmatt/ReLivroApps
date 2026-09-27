export const INSPECTION_SLOTS = [
  "front_cover",
  "back_cover",
  "first_page",
  "middle_page",
  "last_page",
] as const;

export type InspectionSlot = (typeof INSPECTION_SLOTS)[number];

export const INSPECTION_SLOT_ORDER: Record<InspectionSlot, number> = {
  front_cover: 0,
  back_cover: 1,
  first_page: 2,
  middle_page: 3,
  last_page: 4,
};

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export function inspectionFileError(file: File): "type" | "size" | null {
  if (!ALLOWED_TYPES.has(file.type)) return "type";
  if (file.size > MAX_BYTES) return "size";
  return null;
}
