import Link from "next/link";
import {redirect} from "next/navigation";
import {AdminListingsClient} from "@/components/AdminListingsClient";
import {AppShell} from "@/components/AppShell";
import {requireStaff} from "@/lib/admin-access";
import {
  ADMIN_LISTINGS_PAGE_SIZE,
  ADMIN_LISTINGS_SELECT,
  type AdminListingRow,
} from "@/lib/admin-listings-query";
import {adminT} from "@/lib/i18n-admin";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";

export default async function AdminListings() {
  const locale = await getRequestLocale();
  const t = adminT(locale);
  const loadMoreLabels = marketplaceT(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");

  const staffRole = await requireStaff(s, user.id);
  if (!staffRole) redirect("/profile");

  const {data, count} = await s
    .from("books")
    .select(ADMIN_LISTINGS_SELECT, {count: "exact"})
    .order("created_at", {ascending: false})
    .range(0, ADMIN_LISTINGS_PAGE_SIZE - 1);

  const books = (data || []) as AdminListingRow[];
  const totalListings = count ?? books.length;

  return (
    <AppShell>
      <section className="admin-page container">
        <Link className="back-link" href="/admin">
          {t.back}
        </Link>
        <h1>{t.listings.title}</h1>
        <AdminListingsClient
          books={books}
          totalListings={totalListings}
          pageSize={ADMIN_LISTINGS_PAGE_SIZE}
          locale={locale}
          actionLabels={t.actions}
          loadMoreLabels={loadMoreLabels}
        />
      </section>
    </AppShell>
  );
}
