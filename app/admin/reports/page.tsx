import Link from "next/link";
import {redirect} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";
import {AdminReportAction} from "@/components/AdminReportAction";

type ReportRow = {
  id: string;
  book_id: string;
  reason: string;
  details: string | null;
  created_at: string;
  books: {title: string; is_published: boolean; status: string} | {title: string; is_published: boolean; status: string}[] | null;
};

function reportBookTitle(books: ReportRow["books"]): string {
  if (!books) return "Livro removido";
  const book = Array.isArray(books) ? books[0] : books;
  return book?.title || "Livro removido";
}

export default async function AdminReports() {
  const s = await createClient();
  const {data: {user}} = await s.auth.getUser();
  if (!user) redirect("/auth");
  const {data: p} = await s.from("profiles").select("role").eq("id", user.id).single();
  if (!p || !["admin", "moderator"].includes(p.role)) redirect("/profile");
  const {data: reports} = await s.from("listing_reports")
    .select("id,book_id,reason,details,created_at,books(title,is_published,status)")
    .order("created_at", {ascending: false});
  const rows = (reports || []) as ReportRow[];

  return (
    <AppShell>
      <section className="admin-page container">
        <Link className="back-link" href="/admin">← Administração</Link>
        <h1>Denúncias.</h1>
        <div className="admin-table">
          {rows.length ? rows.map(r => (
            <article key={r.id}>
              <div>
                <strong>{reportBookTitle(r.books)}</strong>
                <span>{r.reason} · {new Date(r.created_at).toLocaleDateString("pt-AO")}</span>
                <small>{r.details || ""}</small>
              </div>
              <AdminReportAction id={r.id}/>
            </article>
          )) : (
            <div className="empty-state">
              <h2>Sem denúncias.</h2>
              <p>Não existem denúncias pendentes.</p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
