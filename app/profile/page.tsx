import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";
import {ProfileStats} from "@/components/ProfileStats";
import {ProfileLogoutButton} from "@/components/ProfileLogoutButton";
import {StarRating} from "@/components/StarRating";
import {messages} from "@/lib/i18n";
import {workspaceT} from "@/lib/i18n-workspace";
import {reviewsT} from "@/lib/i18n-reviews";
import {localeTag} from "@/lib/locale-format";
import {getRequestLocale} from "@/lib/locale-server";
import {oneRelation} from "@/lib/supabase-relations";
import {SchoolCommunityBadge} from "@/components/SchoolCommunityBadge";

export default async function ProfilePage() {
  const locale = await getRequestLocale();
  const t = messages[locale];
  const workspace = workspaceT(locale);
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
            {profile?.school?.trim() ? (
              <SchoolCommunityBadge
                locale={locale}
                schoolName={profile.school.trim()}
                verified={Boolean(profile.school_verified_at)}
              />
            ) : null}
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
        <div className="profile-workspace-cta">
          <Link className="button" href="/workspace">
            {workspace.goToWorkspace}
          </Link>
          <Link className="secondary-button" href="/profile/favorites">
            {workspace.savedFavorites}
          </Link>
          {isStaff && (
            <Link className="secondary-button" href="/admin">
              {t.profile.admin}
            </Link>
          )}
        </div>
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
        <ProfileLogoutButton label={t.profile.logout}/>
      </section>
    </AppShell>
  );
}
