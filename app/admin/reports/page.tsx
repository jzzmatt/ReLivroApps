import Link from "next/link";
import {redirect} from "next/navigation";
import {AdminReportsClient} from "@/components/AdminReportsClient";
import {AppShell} from "@/components/AppShell";
import {requireStaff} from "@/lib/admin-access";
import {
  ADMIN_REPORTS_PAGE_SIZE,
  ADMIN_REPORTS_SELECT,
  type AdminReportRow,
} from "@/lib/admin-reports-query";
import {adminT} from "@/lib/i18n-admin";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {getRequestLocale} from "@/lib/locale-server";
import {localeTag} from "@/lib/locale-format";
import {createClient} from "@/lib/supabase/server";

export default async function AdminReports() {
  const locale = await getRequestLocale();
  const t = adminT(locale);
  const loadMoreLabels = marketplaceT(locale);
  const dateLocale = localeTag(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");

  if (!(await requireStaff(s, user.id))) redirect("/profile");

  const {data, count} = await s
    .from("listing_reports")
    .select(ADMIN_REPORTS_SELECT, {count: "exact"})
    .order("created_at", {ascending: false})
    .range(0, ADMIN_REPORTS_PAGE_SIZE - 1);

  const rows = (data || []) as AdminReportRow[];
  const totalReports = count ?? rows.length;

  return (
    <AppShell>
      <section className="admin-page container">
        <Link className="back-link" href="/admin">
          {t.back}
        </Link>
        <h1>{t.reports.title}</h1>
        {totalReports === 0 ? (
          <div className="empty-state">
            <h2>{t.reports.emptyTitle}</h2>
            <p>{t.reports.emptyText}</p>
          </div>
        ) : (
          <AdminReportsClient
            reports={rows}
            totalReports={totalReports}
            pageSize={ADMIN_REPORTS_PAGE_SIZE}
            locale={locale}
            removedBookLabel={t.reports.removedBook}
            actionLabels={t.actions}
            loadMoreLabels={loadMoreLabels}
            dateLocale={dateLocale}
          />
        )}
      </section>
    </AppShell>
  );
}
