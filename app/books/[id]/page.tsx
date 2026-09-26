import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {BookImage, storageImageUrl} from "@/components/BookImage";
import {BookViewTracker} from "@/components/BookViewTracker";
import {ContactSellerButton} from "@/components/ContactSellerButton";
import {FavoriteButton} from "@/components/FavoriteButton";
import {ReportListingButton} from "@/components/ReportListingButton";
import {ShareListingButton} from "@/components/ShareListingButton";
import {formatPrice, type Book, type BookImage as BookImageRow} from "@/lib/books";
import {detailT} from "@/lib/i18n-detail";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://relivroapps.vercel.app").replace(
  /\/$/,
  "",
);

function firstImageUrl(images: BookImageRow[] | undefined): string | null {
  if (!images?.length) return null;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  return storageImageUrl(sorted[0]?.storage_path);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{id: string}>;
}): Promise<Metadata> {
  const {id} = await params;
  const supabase = await createClient();
  const {data} = await supabase
    .from("books")
    .select("title,description,subject,city,grade,book_images(storage_path,sort_order)")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    return {title: "Livro"};
  }

  const description =
    data.description?.slice(0, 160) ||
    `${data.subject} · ${data.grade} · ${data.city || "Angola"}`;

  const ogImage = firstImageUrl((data.book_images || []) as BookImageRow[]);

  return {
    title: data.title,
    description,
    openGraph: {
      title: data.title,
      description,
      url: `${siteUrl}/books/${id}`,
      type: "website",
      siteName: "ReLivroApps",
      ...(ogImage ? {images: [{url: ogImage, alt: data.title}]} : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: data.title,
      description,
      ...(ogImage ? {images: [ogImage]} : {}),
    },
  };
}

export default async function BookDetail({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const locale = await getRequestLocale();
  const t = detailT(locale);
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  const {data} = await supabase
    .from("books")
    .select("*,book_images(id,storage_path,sort_order),profiles(display_name,avatar_url,city,municipality)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const book = data as Book;
  const images = (book.book_images || []).slice().sort((a, b) => a.sort_order - b.sort_order);
  const {data: favorite} = user
    ? await supabase.from("favorites").select("book_id").eq("user_id", user.id).eq("book_id", id).maybeSingle()
    : {data: null};
  const own = user?.id === book.seller_id;
  const sellerName = book.profiles?.display_name || t.memberDefault;
  const modeLabel = t.modes[book.mode] ?? book.mode;
  const conditionLabel = t.conditions[book.condition] ?? book.condition;

  return (
    <AppShell>
      <BookViewTracker bookId={book.id} />
      <section className="detail-page container">
        <Link className="back-link" href="/books">
          {t.back}
        </Link>
        <div className="detail-grid">
          <div>
            <div className="detail-art book-art">
              {images[0] ? (
                <BookImage path={images[0].storage_path} title={book.title} className="detail-image" />
              ) : (
                <span>{book.subject.slice(0, 1)}</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="detail-thumbs">
                {images.map((image) => (
                  <BookImage
                    key={image.id}
                    path={image.storage_path}
                    title={book.title}
                    className="detail-thumb"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="detail-copy">
            <div className="detail-topline">
              <span className={"mode " + book.mode.toLowerCase()}>{modeLabel}</span>
              <FavoriteButton bookId={book.id} initial={!!favorite} />
            </div>
            <h1>{book.title}</h1>
            <p className="detail-price">{formatPrice(book.price_kz)}</p>
            {book.description && <p className="detail-description">{book.description}</p>}
            <div className="seller-mini">
              <div className="seller-avatar">
                {book.profiles?.avatar_url ? (
                  <img src={book.profiles.avatar_url} alt="" />
                ) : (
                  sellerName.slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <small>{t.seller}</small>
                <strong>{sellerName}</strong>
                <span>{[book.profiles?.city, book.profiles?.municipality].filter(Boolean).join(", ")}</span>
              </div>
            </div>
            <div className="detail-info">
              <div>
                <small>{t.condition}</small>
                <strong>{conditionLabel}</strong>
              </div>
              <div>
                <small>{t.location}</small>
                <strong>
                  {book.city || t.defaultCountry}
                  {book.municipality ? ", " + book.municipality : ""}
                </strong>
              </div>
              <div>
                <small>{t.subject}</small>
                <strong>{book.subject}</strong>
              </div>
              <div>
                <small>{t.grade}</small>
                <strong>{book.grade}</strong>
              </div>
              <div>
                <small>{t.seller}</small>
                <strong>{sellerName}</strong>
              </div>
            </div>
            <div className="detail-actions">
              {own ? (
                <Link className="button" href={"/books/" + book.id + "/edit"}>
                  {t.editListing}
                </Link>
              ) : (
                <ContactSellerButton
                  bookId={book.id}
                  labels={{contact: t.contactSeller, busy: t.contactBusy}}
                />
              )}
              <ShareListingButton title={book.title} path={`/books/${book.id}`} locale={locale} />
            </div>
            <div className="safe-note">🛡 {t.safeNote}</div>
            {!own && <ReportListingButton bookId={book.id} />}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
