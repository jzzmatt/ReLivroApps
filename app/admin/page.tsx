import Link from "next/link";
import {redirect} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {adminT} from "@/lib/i18n-admin";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";

export default async function AdminPage() {
  const locale = await getRequestLocale();
  const t = adminT(locale).dashboard;
  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");
  const {data: profile} = await s.from("profiles").select("role,display_name").eq("id", user.id).single();
  if (!profile || !["admin", "moderator"].includes(profile.role)) redirect("/profile");
  const {data} = await s.rpc("admin_dashboard_stats");
  const {data: analytics} = await s.from("admin_analytics_summary").select("*").single();
  const {data: breakdown} = await s.rpc("admin_analytics_breakdown");
  const stats = data || {};
  const activity = (breakdown || {}) as {
    events?: {name?: string; events?: number}[];
    paths?: {path?: string; events?: number}[];
  };
  const eventRows = Array.isArray(activity.events) ? activity.events : [];
  const pathRows = Array.isArray(activity.paths) ? activity.paths : [];
  const eventLabel: Record<string, string> = {
    page_view: t.eventPageView,
    favorite_add: t.eventFavoriteAdd,
    favorite_remove: t.eventFavoriteRemove,
    seller_contact: t.eventSellerContact,
    listing_published: t.eventListingPublished,
  };
  const numberFormat = locale === "pt" ? "pt-AO" : locale === "fr" ? "fr-FR" : "en-GB";

  const kpis: [string, number][] = [
    [t.users, stats.users || 0],
    [t.books, stats.books || 0],
    [t.published, stats.published_books || 0],
    [t.sold, stats.sold_books || 0],
    [t.exchanged, stats.exchanged_books || 0],
    [t.views, stats.views || 0],
    [t.conversations, stats.conversations || 0],
    [t.reports, stats.reports || 0],
  ];

  const analyticsKpis: [string, number][] = [
    [t.events, analytics?.total_events || 0],
    [t.sessions, analytics?.sessions || 0],
    [t.events24h, analytics?.events_24h || 0],
    [t.events30d, analytics?.events_30d || 0],
  ];

  return (
    <AppShell>
      <section className="admin-page container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p>{t.lead}</p>
          </div>
          <span className="admin-role">{profile.role}</span>
        </div>
        <div className="admin-kpis">
          {kpis.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{Number(value).toLocaleString(numberFormat)}</strong>
            </div>
          ))}
        </div>
        <div className="admin-kpis analytics-kpis">
          {analyticsKpis.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{Number(value).toLocaleString(numberFormat)}</strong>
            </div>
          ))}
        </div>
        <div className="admin-activity">
          <section>
            <h2>{t.activityTitle}</h2>
            {eventRows.length === 0 ? (
              <p>{t.activityEmpty}</p>
            ) : (
              <ul>
                {eventRows.map((row) => (
                  <li key={row.name || "event"}>
                    <span>{eventLabel[row.name || ""] || row.name}</span>
                    <strong>{Number(row.events || 0).toLocaleString(numberFormat)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2>{t.topPages}</h2>
            {pathRows.length === 0 ? (
              <p>{t.activityEmpty}</p>
            ) : (
              <ul>
                {pathRows.map((row) => (
                  <li key={row.path || "path"}>
                    <span>{row.path}</span>
                    <strong>{Number(row.events || 0).toLocaleString(numberFormat)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        <div className="admin-actions">
          <Link href="/admin/listings">
            ▣ {t.moderateListings} <span>→</span>
          </Link>
          <Link href="/admin/reports">
            ⚑ {t.reportsLink} <span>→</span>
          </Link>
          <Link href="/admin/users">
            ♙ {t.usersLink} <span>→</span>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
