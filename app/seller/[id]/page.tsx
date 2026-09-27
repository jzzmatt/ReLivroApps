import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import type {Metadata} from "next";
import {AppShell} from "@/components/AppShell";
import {SellerListingsClient} from "@/components/SellerListingsClient";
import {ProfileStats} from "@/components/ProfileStats";
import {BreadcrumbJsonLd} from "@/components/BreadcrumbJsonLd";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {SellerProfileJsonLd} from "@/components/SellerProfileJsonLd";
import {SchoolCommunityBadge} from "@/components/SchoolCommunityBadge";
import {ShareListingButton} from "@/components/ShareListingButton";
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
import {breadcrumbsT} from "@/lib/i18n-breadcrumbs";
import {getSiteUrl} from "@/lib/site-url";
import {MARKETPLACE_BOOK_SELECT, MARKETPLACE_PAGE_SIZE} from "@/lib/marketplace-query";

export const dynamic = "force-dynamic";

type PageProps = {params: Promise<{id: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {id} = await params;
  const locale = await getRequestLocale();
  const st = sellerProfileT(locale);
  const supabase = await createClient();
  const {data: profile} = await supabase
    .from("profiles")
    .select("display_name,avatar_url,bio,city,municipality")
    .eq("id", id)
    .maybeSingle();
  const name = profile?.display_name?.trim() || st.metaTitle;
  const description =
    profile?.bio?.slice(0, 160) ||
    [profile?.city, profile?.municipality].filter(Boolean).join(", ") ||
    st.metaDescription;
  const ogImage =
    profile?.avatar_url?.startsWith("http") ? profile.avatar_url : undefined;
  const canonical = `${getSiteUrl()}/seller/${id}`;

  return {
    title: `${name} · ReLivroApps`,
    description,
    alternates: {canonical},
    openGraph: {
      title: name,
      description,
      url: canonical,
      type: "profile",
      siteName: "ReLivroApps",
      ...(ogImage ? {images: [{url: ogImage, alt: name}]} : {}),
    },
    twitter: {
      card: ogImage ? "summary" : "summary",
      title: name,
      description,
      ...(ogImage ? {images: [ogImage]} : {}),
    },
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

  const {data: listingRows, count: listingCount} = await supabase
    .from("books")
    .select(MARKETPLACE_BOOK_SELECT, {count: "exact"})
    .eq("seller_id", id)
    .eq("is_published", true)
    .order("created_at", {ascending: false})
    .range(0, MARKETPLACE_PAGE_SIZE - 1);
  const books = (listingRows || []) as Book[];
  const totalListings = listingCount ?? books.length;

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

  const profileDescription =
    profile.bio ||
    [profile.city, profile.municipality].filter(Boolean).join(", ") ||
    st.metaDescription;
  const bc = breadcrumbsT(locale);
  const breadcrumbItems = [
    {href: "/books", label: bc.books},
    {label: displayName},
  ];

  return (
    <AppShell>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <SellerProfileJsonLd
        sellerId={id}
        name={displayName}
        description={profileDescription}
        imageUrl={profile.avatar_url?.startsWith("http") ? profile.avatar_url : null}
      />
      <section className="profile-page seller-public-page container">
        <Breadcrumbs items={breadcrumbItems} />
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
            {profile.school?.trim() ? (
              <SchoolCommunityBadge locale={locale} schoolName={profile.school.trim()} />
            ) : null}
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
          <div className="seller-hero-actions">
            <ShareListingButton
              variant="seller"
              title={displayName}
              path={"/seller/" + id}
              locale={locale}
            />
            <Link className="secondary-button" href="/books">
              {detailLabels.back}
            </Link>
          </div>
        </div>

        <ProfileStats
          books={totalListings}
          reviews={reviewCount}
          rating={avgRating}
          labels={{books: rt.statsBooks, reviews: rt.statsReviews, rating: rt.statsRating}}
        />

        <div className="seller-listings-section">
          <span className="eyebrow">{st.eyebrow}</span>
          <h2>{st.listingsTitle}</h2>
          {totalListings === 0 ? (
            <p className="review-hint">{st.listingsEmpty}</p>
          ) : (
            <SellerListingsClient
              sellerId={id}
              books={books}
              totalListings={totalListings}
              pageSize={MARKETPLACE_PAGE_SIZE}
              favorites={favorites}
              labels={marketLabels}
              locale={locale}
              imagesPublicBase={imagesPublicBase}
            />
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
