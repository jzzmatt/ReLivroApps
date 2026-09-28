import Link from "next/link";
import {redirect} from "next/navigation";
import {authLoginUrl} from "@/lib/auth-redirect";
import {AppShell} from "@/components/AppShell";
import {MyListingsClient} from "@/components/MyListingsClient";
import type {Book} from "@/lib/books";
import {bookImagesPublicBase} from "@/lib/book-image-url";
import {listingsManageT} from "@/lib/i18n-listings-manage";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {MARKETPLACE_PAGE_SIZE, MY_LISTINGS_SELECT} from "@/lib/marketplace-query";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";

export default async function ListingsPage() {
  const locale = await getRequestLocale();
  const t = listingsManageT(locale);
  const loadMoreLabels = marketplaceT(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect(authLoginUrl("/profile/listings"));

  const {data, count} = await s
    .from("books")
    .select(MY_LISTINGS_SELECT, {count: "exact"})
    .eq("seller_id", user.id)
    .order("created_at", {ascending: false})
    .range(0, MARKETPLACE_PAGE_SIZE - 1);

  const books = (data || []) as Book[];
  const totalListings = count ?? books.length;
  const imagesPublicBase = bookImagesPublicBase();

  return (
    <AppShell>
      <section className="profile-page container">
        <span className="eyebrow">{t.eyebrow}</span>
        <div className="listing-heading">
          <div>
            <h1>{t.title}</h1>
            <p>{t.lead}</p>
          </div>
          <Link className="button" href="/sell">
            {t.publish}
          </Link>
        </div>
        {totalListings === 0 ? (
          <div className="empty-state">
            <h2>{t.emptyTitle}</h2>
            <Link className="button" href="/sell">
              {t.emptyCta}
            </Link>
          </div>
        ) : (
          <MyListingsClient
            books={books}
            totalListings={totalListings}
            pageSize={MARKETPLACE_PAGE_SIZE}
            locale={locale}
            imagesPublicBase={imagesPublicBase}
            labels={t}
            loadMoreLabels={loadMoreLabels}
          />
        )}
      </section>
    </AppShell>
  );
}
