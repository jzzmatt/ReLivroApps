import Link from "next/link";
import {redirect} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {adminT} from "@/lib/i18n-admin";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";

export default async function AdminUsers() {
  const locale = await getRequestLocale();
  const t = adminT(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");
  const {data: p} = await s.from("profiles").select("role").eq("id", user.id).single();
  if (!p || p.role !== "admin") redirect("/profile");
  const {data: users} = await s
    .from("profiles")
    .select("id,display_name,city,school,role,created_at")
    .order("created_at", {ascending: false})
    .limit(100);

  return (
    <AppShell>
      <section className="admin-page container">
        <Link className="back-link" href="/admin">
          {t.back}
        </Link>
        <h1>{t.users.title}</h1>
        <div className="admin-table">
          {users?.map((u) => (
            <article key={u.id}>
              <div>
                <strong>{u.display_name || t.users.noName}</strong>
                <span>
                  {u.city || "Angola"} {u.school ? `· ${u.school}` : ""}
                </span>
              </div>
              <span className="admin-role">{u.role}</span>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
