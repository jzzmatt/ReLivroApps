import type {BookImage} from "@/lib/books";
import {INSPECTION_SLOTS, type InspectionSlot} from "@/lib/inspection-photos";

export function parseThumbnailSource(value: unknown): InspectionSlot | null {
  if (typeof value !== "string") return null;
  return (INSPECTION_SLOTS as readonly string[]).includes(value) ? (value as InspectionSlot) : null;
}

/** Storage path for marketplace cards, detail hero, and social previews. */
export function resolveListingImagePath(book: {
  thumbnail_path?: string | null;
  book_images?: BookImage[] | null;
}): string | null {
  if (book.thumbnail_path?.trim()) return book.thumbnail_path.trim();
  const images = book.book_images?.slice() ?? [];
  if (!images.length) return null;
  const bySlot = new Map<string, BookImage>();
  for (const image of images) {
    if (image.slot) bySlot.set(image.slot, image);
  }
  for (const slot of INSPECTION_SLOTS) {
    const match = bySlot.get(slot);
    if (match?.storage_path) return match.storage_path;
  }
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  return sorted[0]?.storage_path ?? null;
}
