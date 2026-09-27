import Link from "next/link";
import {BookImage} from "@/components/BookImage";
import {ListingActions} from "@/components/ListingActions";
import {ListingStatusActions} from "@/components/ListingStatusActions";
import {listingsManageT} from "@/lib/i18n-listings-manage";
import {inspectionT} from "@/lib/i18n-inspection";
import {fillTemplate, workspaceT} from "@/lib/i18n-workspace";
import type {Locale} from "@/lib/i18n";
import type {WorkspaceListing} from "@/lib/workspace-query";
import {getSiteUrl} from "@/lib/site-url";

export function WorkspaceRecentListings({
  locale,
  listings,
  imagesPublicBase,
  numberLocale,
}: {
  locale: Locale;
  listings: WorkspaceListing[];
  imagesPublicBase: string | null;
  numberLocale: string;
}) {
  const t = workspaceT(locale);
  const photos = inspectionT(locale);
  const manage = listingsManageT(locale);

  if (listings.length === 0) {
    return (
      <section className="workspace-panel">
        <h2>{t.recentTitle}</h2>
        <div className="empty-state">
          <h3>{t.emptyBooksTitle}</h3>
          <Link className="button" href="/sell">
            {t.publishFirst}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="workspace-panel" aria-labelledby="workspace-recent">
      <div className="workspace-panel-head">
        <h2 id="workspace-recent">{t.recentTitle}</h2>
        <Link href="/profile/listings">{t.viewAll}</Link>
      </div>
      <div className="listing-list">
        {listings.map((book) => {
          const shareUrl = `${getSiteUrl()}/books/${book.id}`;
          const whatsapp = `https://wa.me/?text=${encodeURIComponent(
            `${fillTemplate(t.whatsappText, {title: book.title})} ${shareUrl}`,
          )}`;
          return (
            <article className="listing-row" key={book.id}>
              <div className="listing-thumb">
                <BookImage
                  path={book.imagePath}
                  title={book.title}
                  className="book-image"
                  imagesPublicBase={imagesPublicBase}
                />
              </div>
              <div className="listing-info">
                <Link href={"/books/" + book.id}>
                  <h3>{book.title}</h3>
                </Link>
                <p>
                  {book.condition} · {book.city || "Angola"} · {book.priceKz.toLocaleString(numberLocale)} Kz
                </p>
                <p className="workspace-listing-meta">
                  {fillTemplate(photos.photoProgress, {count: Math.min(book.photoCount, 5)})}
                  {" · "}
                  {fillTemplate(t.views, {count: book.viewCount})}
                  {" · "}
                  {fillTemplate(t.favs, {count: book.favoriteCount})}
                </p>
                <div className="listing-status-line">
                  <span className={"listing-status " + (book.isPublished ? "live" : "paused")}>
                    {book.isPublished ? manage.statusPublished : manage.statusPaused}
                  </span>
                  <ListingStatusActions
                    id={book.id}
                    status={book.status}
                    labels={{
                      statusActive: manage.statusActive,
                      statusReserved: manage.statusReserved,
                      statusSold: manage.statusSold,
                      statusExchanged: manage.statusExchanged,
                    }}
                  />
                </div>
                <div className="workspace-listing-links">
                  <Link href={"/books/" + book.id}>{t.view}</Link>
                  {book.isPublished ? (
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                      {t.whatsapp}
                    </a>
                  ) : null}
                </div>
              </div>
              <ListingActions id={book.id} published={book.isPublished} labels={manage.actions} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
