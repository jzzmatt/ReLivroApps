import {getSupabasePublicEnv} from "@/lib/supabase/public-env";

/** Runtime-safe base for public book-images URLs (use from Server Components). */
export function bookImagesPublicBase(): string | null {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  return `${env.url.replace(/\/$/, "")}/storage/v1/object/public/book-images/`;
}

export function storageImageUrl(path?: string | null, imagesPublicBase?: string | null): string | null {
  const prefix =
    imagesPublicBase ??
    (process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/book-images/`
      : null);
  if (!path || !prefix) return null;
  return prefix + path.replace(/^\//, "");
}
