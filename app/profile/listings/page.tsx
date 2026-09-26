import Link from "next/link";
import {redirect} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {BookImage} from "@/components/BookImage";
import {ListingActions} from "@/components/ListingActions";
import {ListingStatusActions} from "@/components/ListingStatusActions";
import type {Book} from "@/lib/books";
import {listingsManageT} from "@/lib/i18n-listings-manage";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";

export default async function ListingsPage() {
  const locale = await getRequestLocale();
  const t = listingsManageT(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");
  const {data} = await s
    .from("books")
    .select("*,book_images(id,storage_path,sort_order)")
    .eq("seller_id", user.id)
    .order("created_at", {ascending: false});
  const books = (data || []) as Book[];
  const numberLocale = locale === "pt" ? "pt-AO" : locale === "fr" ? "fr-FR" : "en-GB";

  const statusLabels = {
    statusActive: t.statusActive,
    statusReserved: t.statusReserved,
    statusSold: t.statusSold,
    statusExchanged: t.statusExchanged,
  };

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
        {books.length === 0 ? (
          <div className="empty-state">
            <h2>{t.emptyTitle}</h2>
            <Link className="button" href="/sell">
              {t.emptyCta}
            </Link>
          </div>
        ) : (
          <div className="listing-list">
            {books.map((book) => {
              const image = book.book_images?.[0];
              return (
                <article className="listing-row" key={book.id}>
                  <div className="listing-thumb">
                    <BookImage path={image?.storage_path} title={book.title} className="book-image" />
                  </div>
                  <div className="listing-info">
                    <Link href={"/books/" + book.id}>
                      <h3>{book.title}</h3>
                    </Link>
                    <p>
                      {book.condition} · {book.city || "Angola"} ·{" "}
                      {Number(book.price_kz).toLocaleString(numberLocale)} Kz
                    </p>
                    <div className="listing-status-line">
                      <span className={"listing-status " + (book.is_published ? "live" : "paused")}>
                        {book.is_published ? t.statusPublished : t.statusPaused}
                      </span>
                      <ListingStatusActions id={book.id} status={book.status || "active"} labels={statusLabels} />
                    </div>
                  </div>
                  <ListingActions id={book.id} published={book.is_published} labels={t.actions} />
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
