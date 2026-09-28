import {NextResponse} from "next/server";
import {defaultThumbnailSlot, prepareMarketplaceThumbnailBytes} from "@/lib/thumbnail-prepare";
import {parseThumbnailSource} from "@/lib/listing-image";
import {INSPECTION_SLOTS} from "@/lib/inspection-photos";
import {createClient} from "@/lib/supabase/server";

export const maxDuration = 60;
export const runtime = "nodejs";

type Body = {
  bookId?: string;
  selected_image?: string;
  publish?: boolean;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error: "auth"}, {status: 401});

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({error: "invalid"}, {status: 400});
  }

  const bookId = body.bookId?.trim();
  if (!bookId) return NextResponse.json({error: "missing"}, {status: 400});

  const {data: book, error: bookError} = await supabase
    .from("books")
    .select("id,seller_id,is_published")
    .eq("id", bookId)
    .maybeSingle();
  if (bookError || !book || book.seller_id !== user.id) {
    return NextResponse.json({error: "forbidden"}, {status: 403});
  }

  const {data: images, error: imagesError} = await supabase
    .from("book_images")
    .select("storage_path,slot,sort_order")
    .eq("book_id", bookId);
  if (imagesError || !images?.length) {
    return NextResponse.json({error: "images"}, {status: 400});
  }

  const slot =
    parseThumbnailSource(body.selected_image) ??
    defaultThumbnailSlot();

  const bySlot = new Map(images.map((row) => [row.slot, row.storage_path]));
  let sourcePath = bySlot.get(slot) ?? null;
  if (!sourcePath) {
    for (const fallback of INSPECTION_SLOTS) {
      const path = bySlot.get(fallback);
      if (path) {
        sourcePath = path;
        break;
      }
    }
  }
  if (!sourcePath) {
    const sorted = [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    sourcePath = sorted[0]?.storage_path ?? null;
  }
  if (!sourcePath) return NextResponse.json({error: "images"}, {status: 400});

  const {data: fileBlob, error: downloadError} = await supabase.storage
    .from("book-images")
    .download(sourcePath);
  if (downloadError || !fileBlob) {
    return NextResponse.json({error: "download"}, {status: 502});
  }

  let prepared: Buffer;
  try {
    prepared = await prepareMarketplaceThumbnailBytes(Buffer.from(await fileBlob.arrayBuffer()));
  } catch {
    return NextResponse.json({error: "process"}, {status: 502});
  }

  const thumbnailPath = `${user.id}/${bookId}/thumbnail.webp`;
  const upload = await supabase.storage.from("book-images").upload(thumbnailPath, prepared, {
    upsert: true,
    contentType: "image/webp",
  });
  if (upload.error) {
    return NextResponse.json({error: "upload"}, {status: 502});
  }

  const sourceRow = images.find((row) => row.storage_path === sourcePath);
  const resolvedSlot = parseThumbnailSource(sourceRow?.slot) ?? slot;

  const shouldPublish = body.publish !== false;
  const {error: updateError} = await supabase
    .from("books")
    .update({
      thumbnail_path: thumbnailPath,
      thumbnail_source: resolvedSlot,
      ...(shouldPublish ? {is_published: true} : {}),
    })
    .eq("id", bookId)
    .eq("seller_id", user.id);

  if (updateError) {
    return NextResponse.json({error: "save"}, {status: 502});
  }

  return NextResponse.json({
    thumbnail_path: thumbnailPath,
    thumbnail_source: resolvedSlot,
    published: shouldPublish,
  });
}
