import Link from "next/link";
import {redirect} from "next/navigation";
import {AdminReportAction} from "@/components/AdminReportAction";
import {AppShell} from "@/components/AppShell";
import {adminT} from "@/lib/i18n-admin";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";

type ReportRow = {
  id: string;
  book_id: string;
  reason: string;
  details: string | null;
  created_at: string;
  books: {title: string; is_published: boolean; status: string} | {title: string; is_published: boolean; status: string}[] | null;
};

function reportBookTitle(books: ReportRow["books"], fallback: string): string {
  if (!books) return fallback;
  const book = Array.isArray(books) ? books[0] : books;
  return book?.title || fallback;
}

export default async function AdminReports() {
  const locale = await getRequestLocale();
  const t = adminT(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");
  const {data: p} = await s.from("profiles").select("role").eq("id", user.id).single();
  if (!p || !["admin", "moderator"].includes(p.role)) redirect("/profile");
  const {data: reports} = await s
    .from("listing_reports")
    .select("id,book_id,reason,details,created_at,books(title,is_published,status)")
    .order("created_at", {ascending: false});
  const rows = (reports || []) as ReportRow[];
  const dateLocale = locale === "pt" ? "pt-AO" : locale === "fr" ? "fr-FR" : "en-GB";

  return (
    <AppShell>
      <section className="admin-page container">
        <Link className="back-link" href="/admin">
          {t.back}
        </Link>
        <h1>{t.reports.title}</h1>
        <div className="admin-table">
          {rows.length ? (
            rows.map((r) => (
              <article key={r.id}>
                <div>
                  <strong>{reportBookTitle(r.books, t.reports.removedBook)}</strong>
                  <span>
                    {r.reason} · {new Date(r.created_at).toLocaleDateString(dateLocale)}
                  </span>
                  <small>{r.details || ""}</small>
                </div>
                <AdminReportAction id={r.id} labels={t.actions}/>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h2>{t.reports.emptyTitle}</h2>
              <p>{t.reports.emptyText}</p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
