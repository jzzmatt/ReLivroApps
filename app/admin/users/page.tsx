import Link from "next/link";
import {redirect} from "next/navigation";
import {AdminUsersClient} from "@/components/AdminUsersClient";
import {AppShell} from "@/components/AppShell";
import {requireStaff} from "@/lib/admin-access";
import {
  ADMIN_USERS_PAGE_SIZE,
  ADMIN_USERS_SELECT,
  type AdminUserRow,
} from "@/lib/admin-users-query";
import {adminT} from "@/lib/i18n-admin";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";

export default async function AdminUsers() {
  const locale = await getRequestLocale();
  const t = adminT(locale);
  const loadMoreLabels = marketplaceT(locale);
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");

  if (!(await requireStaff(s, user.id, {adminOnly: true}))) redirect("/profile");

  const {data, count} = await s
    .from("profiles")
    .select(ADMIN_USERS_SELECT, {count: "exact"})
    .order("created_at", {ascending: false})
    .range(0, ADMIN_USERS_PAGE_SIZE - 1);

  const users = (data || []) as AdminUserRow[];
  const totalUsers = count ?? users.length;

  return (
    <AppShell>
      <section className="admin-page container">
        <Link className="back-link" href="/admin">
          {t.back}
        </Link>
        <h1>{t.users.title}</h1>
        <AdminUsersClient
          users={users}
          totalUsers={totalUsers}
          pageSize={ADMIN_USERS_PAGE_SIZE}
          locale={locale}
          noNameLabel={t.users.noName}
          loadMoreLabels={loadMoreLabels}
        />
      </section>
    </AppShell>
  );
}
