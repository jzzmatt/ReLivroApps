import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {BookCard} from "@/components/BookCard";
import {BookImage} from "@/components/BookImage";
import {bookImagesPublicBase, storageImageUrl} from "@/lib/book-image-url";
import {BreadcrumbJsonLd} from "@/components/BreadcrumbJsonLd";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {BookListingJsonLd} from "@/components/BookListingJsonLd";
import {BookViewTracker} from "@/components/BookViewTracker";
import {ContactSellerButton} from "@/components/ContactSellerButton";
import {SchoolCommunityBadge} from "@/components/SchoolCommunityBadge";
import {FavoriteButton} from "@/components/FavoriteButton";
import {ReportListingButton} from "@/components/ReportListingButton";
import {SellerReviewForm} from "@/components/SellerReviewForm";
import {ShareListingButton} from "@/components/ShareListingButton";
import {StarRating} from "@/components/StarRating";
import {formatPrice, type Book, type BookImage as BookImageRow} from "@/lib/books";
import {detailT} from "@/lib/i18n-detail";
import {labelGrade, labelSubject} from "@/lib/i18n-catalog";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {formatReviewCount, reviewsT} from "@/lib/i18n-reviews";
import {localeTag} from "@/lib/locale-format";
import {getRequestLocale} from "@/lib/locale-server";
import {oneRelation} from "@/lib/supabase-relations";
import {createClient} from "@/lib/supabase/server";
import {breadcrumbsT} from "@/lib/i18n-breadcrumbs";
import {getSiteUrl} from "@/lib/site-url";

function firstImageUrl(images: BookImageRow[] | undefined, imagesPublicBase: string | null): string | null {
  if (!images?.length) return null;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  return storageImageUrl(sorted[0]?.storage_path, imagesPublicBase);
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

  const ogImage = firstImageUrl((data.book_images || []) as BookImageRow[], bookImagesPublicBase());
  const canonical = `${getSiteUrl()}/books/${id}`;

  return {
    title: data.title,
    description,
    alternates: {canonical},
    openGraph: {
      title: data.title,
      description,
      url: canonical,
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
  const rt = reviewsT(locale);
  const market = marketplaceT(locale);
  const dateLocale = localeTag(locale);
  const imagesPublicBase = bookImagesPublicBase();
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  const {data} = await supabase
    .from("books")
    .select("*,book_images(id,storage_path,sort_order),profiles!books_seller_id_fkey(display_name,avatar_url,city,municipality,school)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const book = data as Book;
  const images = (book.book_images || []).slice().sort((a, b) => a.sort_order - b.sort_order);
  const {data: favorite} = user
    ? await supabase.from("favorites").select("book_id").eq("user_id", user.id).eq("book_id", id).maybeSingle()
    : {data: null};
  const own = user?.id === book.seller_id;
  const {data: ratingRows} = await supabase.from("seller_reviews").select("rating").eq("seller_id", book.seller_id);
  const reviewCount = ratingRows?.length || 0;
  const avgRating = reviewCount
    ? (ratingRows?.reduce((sum, r) => sum + r.rating, 0) || 0) / reviewCount
    : 0;
  const {data: reviewList} = await supabase
    .from("seller_reviews")
    .select("id,rating,comment,created_at,reviewer_id,profiles:reviewer_id(display_name)")
    .eq("seller_id", book.seller_id)
    .order("created_at", {ascending: false})
    .limit(8);
  const {data: myReview} = user
    ? await supabase
        .from("seller_reviews")
        .select("rating,comment")
        .eq("seller_id", book.seller_id)
        .eq("book_id", id)
        .eq("reviewer_id", user.id)
        .maybeSingle()
    : {data: null};

  const {data: moreListings} = await supabase
    .from("books")
    .select("*,book_images(id,storage_path,sort_order),profiles!books_seller_id_fkey(display_name,avatar_url)")
    .eq("seller_id", book.seller_id)
    .eq("is_published", true)
    .neq("id", book.id)
    .order("created_at", {ascending: false})
    .limit(4);
  const moreBooks = (moreListings || []) as Book[];
  const {data: favRows} = user
    ? await supabase.from("favorites").select("book_id").eq("user_id", user.id)
    : {data: []};
  const favoriteIds = (favRows || []).map((f) => f.book_id);

  const sellerName = book.profiles?.display_name || t.memberDefault;
  const modeLabel = t.modes[book.mode] ?? book.mode;
  const conditionLabel = t.conditions[book.condition] ?? book.condition;

  const listingImage = firstImageUrl(images as BookImageRow[], imagesPublicBase);
  const bc = breadcrumbsT(locale);
  const breadcrumbItems = [
    {href: "/books", label: bc.books},
    {label: book.title},
  ];

  return (
    <AppShell>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <BookListingJsonLd
        bookId={book.id}
        title={book.title}
        description={book.description}
        priceKz={Number(book.price_kz)}
        imageUrl={listingImage}
        sellerName={sellerName}
      />
      <BookViewTracker bookId={book.id} />
      <section className="detail-page container">
        <Breadcrumbs items={breadcrumbItems} />
        <Link className="back-link" href="/books">
          {t.back}
        </Link>
        <div className="detail-grid">
          <div>
            <div className="detail-art book-art">
              {images[0] ? (
                <BookImage
                  path={images[0].storage_path}
                  title={book.title}
                  className="detail-image"
                  imagesPublicBase={imagesPublicBase}
                />
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
                    imagesPublicBase={imagesPublicBase}
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
            <Link className="seller-mini seller-mini-link" href={"/seller/" + book.seller_id}>
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
                {reviewCount > 0 && (
                  <div className="seller-rating-inline">
                    <StarRating value={Math.round(avgRating)} label={rt.average}/>
                    <strong>{avgRating.toFixed(1)}</strong>
                    <span>({formatReviewCount(reviewCount, locale)})</span>
                  </div>
                )}
                <span className="seller-profile-cta">{t.viewSellerProfile}</span>
              </div>
            </Link>
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
                <strong>{labelSubject(book.subject, locale)}</strong>
              </div>
              <div>
                <small>{t.grade}</small>
                <strong>{labelGrade(book.grade, locale)}</strong>
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
            <div className="payment-note">{t.paymentNote}</div>
            {book.profiles?.school?.trim() ? (
              <SchoolCommunityBadge locale={locale} schoolName={book.profiles.school.trim()} />
            ) : null}
            {!own && <ReportListingButton bookId={book.id} labels={market.report} />}
            {moreBooks.length > 0 && (
              <section className="seller-more-section" aria-labelledby="seller-more-heading">
                <div className="seller-more-head">
                  <div>
                    <span className="eyebrow">{t.seller}</span>
                    <h2 id="seller-more-heading">{t.moreFromSeller}</h2>
                  </div>
                  <Link className="secondary-button" href={"/seller/" + book.seller_id}>
                    {t.viewAllSellerListings}
                  </Link>
                </div>
                <div className="book-grid seller-more-grid">
                  {moreBooks.map((b, i) => (
                    <BookCard
                      key={b.id}
                      book={b}
                      index={i}
                      isFavorite={favoriteIds.includes(b.id)}
                      labels={market}
                      imagesPublicBase={imagesPublicBase}
                    />
                  ))}
                </div>
              </section>
            )}
            <section className="reviews-section" aria-labelledby="seller-reviews-heading">
              <span className="eyebrow">{rt.sectionEyebrow}</span>
              <h2 id="seller-reviews-heading">{rt.sectionTitle}</h2>
              {reviewCount > 0 ? (
                <div className="reviews-summary">
                  <StarRating value={Math.round(avgRating)} label={rt.average}/>
                  <div>
                    <strong>{avgRating.toFixed(1)}</strong> · {formatReviewCount(reviewCount, locale)}
                  </div>
                </div>
              ) : (
                <p className="review-hint">{rt.empty}</p>
              )}
              {reviewList && reviewList.length > 0 && (
                <div className="reviews-list">
                  {reviewList.map(row => {
                    const reviewer = oneRelation(row.profiles as {display_name: string | null} | {display_name: string | null}[]);
                    return (
                      <article className="review-card" key={row.id}>
                        <div className="review-card-head">
                          <strong>{reviewer?.display_name || rt.anonymous}</strong>
                          <small>{new Date(row.created_at).toLocaleDateString(dateLocale)}</small>
                        </div>
                        <StarRating value={row.rating} label={`${row.rating}/5`}/>
                        {row.comment && <p>{row.comment}</p>}
                      </article>
                    );
                  })}
                </div>
              )}
              <SellerReviewForm
                locale={locale}
                sellerId={book.seller_id}
                bookId={book.id}
                loggedIn={!!user}
                ownListing={own}
                initialRating={myReview?.rating || 0}
                initialComment={myReview?.comment || ""}
              />
            </section>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
