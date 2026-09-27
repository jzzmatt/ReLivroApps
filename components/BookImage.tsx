"use client";

import {useState} from "react";
import {storageImageUrl} from "@/lib/book-image-url";

export {storageImageUrl} from "@/lib/book-image-url";

export function BookImage({
  path,
  title,
  className = "",
  imagesPublicBase,
}: {
  path?: string | null;
  title: string;
  className?: string;
  /** Pass from Server Components so Vercel runtime env works in the client grid. */
  imagesPublicBase?: string | null;
}) {
  const src = storageImageUrl(path, imagesPublicBase);
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div className={className + " book-art-fallback"}>
        <span>{title.slice(0, 1).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className={className}
      onError={() => setBroken(true)}
    />
  );
}
