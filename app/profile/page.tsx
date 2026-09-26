import Link from "next/link";
import {cookies} from "next/headers";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";
import {ProfileStats} from "@/components/ProfileStats";
import {ProfileLogoutButton} from "@/components/ProfileLogoutButton";
import {StarRating} from "@/components/StarRating";
import {messages, type Locale} from "@/lib/i18n";
import {reviewsT} from "@/lib/i18n-reviews";
import {localeTag} from "@/lib/locale-format";
import {oneRelation} from "@/lib/supabase-relations";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("relivro-locale")?.value as Locale) || "pt";
  const t = messages[locale];
  const rt = reviewsT(locale);
  const dateLocale = localeTag(locale);
  const s = await createClient();
  const {data: {user}} = await s.auth.getUser();

  if (!user) {
    return (
      <AppShell>
        <section className="profile-page container">
          <h1>{t.profile.loginTitle}</h1>
          <Link className="button" href="/auth">{t.profile.login}</Link>
        </section>
      </AppShell>
    );
  }

  const {data: profile} = await s.from("profiles").select("*").eq("id", user.id).single();
  const {count: books} = await s.from("books").select("id", {count: "exact", head: true}).eq("seller_id", user.id);
  const {data: reviews} = await s.from("seller_reviews").select("rating").eq("seller_id", user.id);
  const rating = reviews?.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const {data: recentReviews} = await s
    .from("seller_reviews")
    .select("id,rating,comment,created_at,profiles:reviewer_id(display_name)")
    .eq("seller_id", user.id)
    .order("created_at", {ascending: false})
    .limit(5);
  const isStaff = profile?.role === "admin" || profile?.role === "moderator";

  return (
    <AppShell>
      <section className="profile-page container">
        <div className="profile-hero">
          <div className="profile-avatar-large">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt=""/>
            ) : (
              (profile?.display_name || user.email || "U").slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="profile-hero-copy">
            <span className="eyebrow">{t.profile.account}</span>
            <h1>{profile?.display_name || user.email?.split("@")[0]}</h1>
            <p>
              {[profile?.city, profile?.municipality].filter(Boolean).join(", ") || "Angola"}
              {profile?.school ? " · " + profile.school : ""}
            </p>
            {profile?.bio && <div className="profile-bio">{profile.bio}</div>}
          </div>
          <Link className="secondary-button" href="/profile/edit">{t.profile.edit}</Link>
        </div>
        <ProfileStats
          books={books || 0}
          reviews={reviews?.length || 0}
          rating={rating}
          labels={{books: rt.statsBooks, reviews: rt.statsReviews, rating: rt.statsRating}}
        />
        {recentReviews && recentReviews.length > 0 && (
          <div className="profile-reviews">
            <span className="eyebrow">{rt.sectionEyebrow}</span>
            <h2>{rt.profileRecent}</h2>
            {recentReviews.map(row => {
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
        <div className="profile-links-grid">
          <Link href="/sell">{t.profile.publish}</Link>
          <Link href="/profile/listings">{t.profile.listings}</Link>
          <Link href="/profile/favorites">{t.profile.favorites}</Link>
          <Link href="/messages">{t.profile.messages}</Link>
          <Link href="/notifications">{t.profile.notifications}</Link>
          <Link href="/books">{t.profile.explore}</Link>
          {isStaff && <Link href="/admin">{t.profile.admin}</Link>}
        </div>
        <ProfileLogoutButton label={t.profile.logout}/>
      </section>
    </AppShell>
  );
}
