import type {Metadata} from "next";
import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {BreadcrumbJsonLd} from "@/components/BreadcrumbJsonLd";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {MarketplaceClient} from "@/components/MarketplaceClient";
import {MarketplaceItemListJsonLd} from "@/components/MarketplaceItemListJsonLd";
import {messages} from "@/lib/i18n";
import {breadcrumbsT} from "@/lib/i18n-breadcrumbs";
import {getSiteUrl} from "@/lib/site-url";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {getRequestLocale} from "@/lib/locale-server";
import type {Book} from "@/lib/books";
import {bookImagesPublicBase} from "@/lib/book-image-url";
import {MARKETPLACE_BOOK_SELECT, MARKETPLACE_PAGE_SIZE} from "@/lib/marketplace-query";
import {normalizeCity} from "@/lib/nearby-city";
import {createClient} from "@/lib/supabase/server";
import {isSupabaseConfigured} from "@/lib/supabase/public-env";

/** Always read Supabase env at request time (Vercel runtime vars). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = messages[locale];
  const canonical = `${getSiteUrl()}/books`;

  return {
    title: t.market.title,
    description: t.market.description,
    alternates: {canonical},
    openGraph: {
      title: t.market.title,
      description: t.market.description,
      url: canonical,
      type: "website",
      siteName: "ReLivroApps",
    },
    twitter: {
      card: "summary",
      title: t.market.title,
      description: t.market.description,
    },
  };
}

export default async function BooksPage() {
  const locale = await getRequestLocale();
  const t = messages[locale];
  const bc = breadcrumbsT(locale);
  const marketLabels = marketplaceT(locale);
  const imagesPublicBase = bookImagesPublicBase();
  const breadcrumbItems = [{label: bc.books}];

  let books: Book[] = [];
  let totalPublished = 0;
  let favorites: string[] = [];
  let loadError: unknown = null;
  let signedIn = false;
  let viewerCity: string | null = null;

  try {
    if (!isSupabaseConfigured()) {
      return (
        <AppShell>
          <section className="marketplace container">
            <div className="empty-state">{t.market.error}</div>
          </section>
        </AppShell>
      );
    }

    const supabase = await createClient();
    const {data: authData} = await supabase.auth.getUser();
    const user = authData?.user ?? null;
    const {data, error, count} = await supabase
      .from("books")
      .select(MARKETPLACE_BOOK_SELECT, {count: "exact"})
      .eq("is_published", true)
      .order("created_at", {ascending: false})
      .range(0, MARKETPLACE_PAGE_SIZE - 1);
    if (error) loadError = error;
    else {
      books = (data || []) as Book[];
      totalPublished = count ?? books.length;
    }
    const {data: favRows} = user
      ? await supabase.from("favorites").select("book_id").eq("user_id", user.id)
      : {data: []};
    favorites = (favRows || []).map((f) => f.book_id);
    if (user) {
      signedIn = true;
      const {data: profile} = await supabase.from("profiles").select("city").eq("id", user.id).maybeSingle();
      viewerCity = normalizeCity(profile?.city);
    }
  } catch (err) {
    console.error("[books] load failed", err);
    loadError = err;
  }

  return (
    <AppShell>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {books.length > 0 ? (
        <MarketplaceItemListJsonLd books={books.map((b) => ({id: b.id, title: b.title}))} />
      ) : null}
      <section className="marketplace container">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="marketplace-head">
          <div>
            <span className="eyebrow">{t.market.eyebrow}</span>
            <h1>{t.market.title}</h1>
            <p>{t.market.description}</p>
          </div>
          <Link className="button button-small" href="/sell">
            {t.market.publish}
          </Link>
        </div>
        {loadError ? (
          <div className="empty-state">{t.market.error}</div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <h2>{t.market.emptyTitle}</h2>
            <p>{t.market.emptyText}</p>
            <Link className="button" href="/sell">
              {t.market.publish}
            </Link>
          </div>
        ) : (
          <MarketplaceClient
            books={books}
            totalPublished={totalPublished}
            pageSize={MARKETPLACE_PAGE_SIZE}
            favorites={favorites}
            labels={marketLabels}
            locale={locale}
            imagesPublicBase={imagesPublicBase}
            viewerCity={viewerCity}
            signedIn={signedIn}
          />
        )}
      </section>
    </AppShell>
  );
}
