import Link from "next/link";
import {redirect} from "next/navigation";
import {AdminListingAction} from "@/components/AdminListingAction";
import {AppShell} from "@/components/AppShell";
import {adminT} from "@/lib/i18n-admin";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";

export default async function AdminListings() {
  const locale = await getRequestLocale();
  const t = adminT(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");
  const {data: p} = await s.from("profiles").select("role").eq("id", user.id).single();
  if (!p || !["admin", "moderator"].includes(p.role)) redirect("/profile");
  const {data: books} = await s
    .from("books")
    .select("id,title,price_kz,is_published,status,created_at,city,seller_id")
    .order("created_at", {ascending: false})
    .limit(100);

  const numberLocale = locale === "pt" ? "pt-AO" : locale === "fr" ? "fr-FR" : "en-GB";

  return (
    <AppShell>
      <section className="admin-page container">
        <Link className="back-link" href="/admin">
          {t.back}
        </Link>
        <h1>{t.listings.title}</h1>
        <div className="admin-table">
          {books?.map((b) => (
            <article key={b.id}>
              <div>
                <strong>{b.title}</strong>
                <span>
                  {Number(b.price_kz || 0).toLocaleString(numberLocale)} Kz · {b.city || "Angola"} · {b.status}
                </span>
              </div>
              <AdminListingAction id={b.id} published={b.is_published} labels={t.actions}/>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
