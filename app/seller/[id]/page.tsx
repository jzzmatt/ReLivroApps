import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import type {Metadata} from "next";
import {AppShell} from "@/components/AppShell";
import {BookCard} from "@/components/BookCard";
import {ProfileStats} from "@/components/ProfileStats";
import {StarRating} from "@/components/StarRating";
import {bookImagesPublicBase} from "@/lib/book-image-url";
import type {Book} from "@/lib/books";
import {detailT} from "@/lib/i18n-detail";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {formatReviewCount, reviewsT} from "@/lib/i18n-reviews";
import {sellerProfileT} from "@/lib/i18n-seller-profile";
import {localeTag} from "@/lib/locale-format";
import {getRequestLocale} from "@/lib/locale-server";
import {oneRelation} from "@/lib/supabase-relations";
import {createClient} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PageProps = {params: Promise<{id: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {id} = await params;
  const locale = await getRequestLocale();
  const st = sellerProfileT(locale);
  const supabase = await createClient();
  const {data: profile} = await supabase.from("profiles").select("display_name").eq("id", id).maybeSingle();
  const name = profile?.display_name?.trim() || st.metaTitle;
  return {
    title: `${name} · ReLivroApps`,
    description: st.metaDescription,
  };
}

export default async function SellerPublicPage({params}: PageProps) {
  const {id} = await params;
  const locale = await getRequestLocale();
  const st = sellerProfileT(locale);
  const rt = reviewsT(locale);
  const marketLabels = marketplaceT(locale);
  const detailLabels = detailT(locale);
  const dateLocale = localeTag(locale);
  const imagesPublicBase = bookImagesPublicBase();

  const supabase = await createClient();
  const {data: authData} = await supabase.auth.getUser();
  const user = authData?.user ?? null;
  if (user?.id === id) redirect("/profile");

  const {data: profile} = await supabase
    .from("profiles")
    .select("id,display_name,avatar_url,city,municipality,school,bio,created_at")
    .eq("id", id)
    .maybeSingle();
  if (!profile) notFound();

  const {data: listingRows} = await supabase
    .from("books")
    .select("*,book_images(id,storage_path,sort_order),profiles!books_seller_id_fkey(display_name,avatar_url)")
    .eq("seller_id", id)
    .eq("is_published", true)
    .order("created_at", {ascending: false});
  const books = (listingRows || []) as Book[];

  const {data: ratingRows} = await supabase.from("seller_reviews").select("rating").eq("seller_id", id);
  const reviewCount = ratingRows?.length || 0;
  const avgRating = reviewCount
    ? (ratingRows || []).reduce((sum, row) => sum + row.rating, 0) / reviewCount
    : 0;

  const {data: recentReviews} = await supabase
    .from("seller_reviews")
    .select("id,rating,comment,created_at,profiles:reviewer_id(display_name)")
    .eq("seller_id", id)
    .order("created_at", {ascending: false})
    .limit(8);

  const {data: favRows} = user
    ? await supabase.from("favorites").select("book_id").eq("user_id", user.id)
    : {data: []};
  const favorites = (favRows || []).map((f) => f.book_id);

  const displayName = profile.display_name?.trim() || detailLabels.memberDefault;
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(dateLocale, {month: "long", year: "numeric"})
    : null;

  return (
    <AppShell>
      <section className="profile-page seller-public-page container">
        <div className="profile-hero">
          <div className="profile-avatar-large">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" />
            ) : (
              displayName.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="profile-hero-copy">
            <span className="eyebrow">{st.eyebrow}</span>
            <h1>{displayName}</h1>
            <p>
              {[profile.city, profile.municipality].filter(Boolean).join(", ") || detailLabels.defaultCountry}
              {profile.school ? " · " + profile.school : ""}
            </p>
            {memberSince && (
              <p className="seller-member-since">
                {st.memberSince} {memberSince}
              </p>
            )}
            {profile.bio && <div className="profile-bio">{profile.bio}</div>}
            {reviewCount > 0 && (
              <div className="seller-rating-inline">
                <StarRating value={Math.round(avgRating)} label={rt.average} />
                <strong>{avgRating.toFixed(1)}</strong>
                <span>({formatReviewCount(reviewCount, locale)})</span>
              </div>
            )}
          </div>
          <Link className="secondary-button" href="/books">
            {detailLabels.back}
          </Link>
        </div>

        <ProfileStats
          books={books.length}
          reviews={reviewCount}
          rating={avgRating}
          labels={{books: rt.statsBooks, reviews: rt.statsReviews, rating: rt.statsRating}}
        />

        <div className="seller-listings-section">
          <span className="eyebrow">{st.eyebrow}</span>
          <h2>{st.listingsTitle}</h2>
          {books.length === 0 ? (
            <p className="review-hint">{st.listingsEmpty}</p>
          ) : (
            <div className="book-grid">
              {books.map((book, i) => (
                <BookCard
                  key={book.id}
                  book={book}
                  index={i}
                  isFavorite={favorites.includes(book.id)}
                  labels={marketLabels}
                  imagesPublicBase={imagesPublicBase}
                />
              ))}
            </div>
          )}
        </div>

        {recentReviews && recentReviews.length > 0 && (
          <div className="profile-reviews">
            <span className="eyebrow">{rt.sectionEyebrow}</span>
            <h2>{rt.profileRecent}</h2>
            {recentReviews.map((row) => {
              const reviewer = oneRelation(
                row.profiles as {display_name: string | null} | {display_name: string | null}[],
              );
              return (
                <article className="review-card" key={row.id}>
                  <div className="review-card-head">
                    <strong>{reviewer?.display_name || rt.anonymous}</strong>
                    <small>{new Date(row.created_at).toLocaleDateString(dateLocale)}</small>
                  </div>
                  <StarRating value={row.rating} label={`${row.rating}/5`} />
                  {row.comment && <p>{row.comment}</p>}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
