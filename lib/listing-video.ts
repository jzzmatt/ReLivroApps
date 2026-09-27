const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export const MAX_LISTING_VIDEO_BYTES = 20 * 1024 * 1024;

export function videoFileError(file: File): "type" | "size" | null {
  if (!VIDEO_TYPES.has(file.type)) return "type";
  if (file.size > MAX_LISTING_VIDEO_BYTES) return "size";
  return null;
}
