import {redirect} from "next/navigation";
import {authLoginUrl} from "@/lib/auth-redirect";
import {AppShell} from "@/components/AppShell";
import {WorkspaceActivity} from "@/components/workspace/WorkspaceActivity";
import {WorkspaceHeader} from "@/components/workspace/WorkspaceHeader";
import {WorkspaceInboxCards} from "@/components/workspace/WorkspaceInboxCards";
import {WorkspaceKpiGrid} from "@/components/workspace/WorkspaceKpiGrid";
import {WorkspacePublicationSummary} from "@/components/workspace/WorkspacePublicationSummary";
import {WorkspaceRecentListings} from "@/components/workspace/WorkspaceRecentListings";
import {bookImagesPublicBase} from "@/lib/book-image-url";
import {localeTag} from "@/lib/locale-format";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";
import {loadWorkspace} from "@/lib/workspace-query";

export default async function WorkspacePage() {
  const locale = await getRequestLocale();
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) redirect(authLoginUrl("/workspace"));

  const data = await loadWorkspace(supabase, user.id);
  const name = data.displayName || user.email?.split("@")[0] || "ReLivroApps";
  const numberLocale = localeTag(locale);

  return (
    <AppShell>
      <section className="workspace-page container">
        <WorkspaceHeader locale={locale} displayName={name} />
        <WorkspaceKpiGrid
          locale={locale}
          visitors={data.visitors}
          books={data.books}
          favorites={data.favorites}
          messages={data.unreadMessages}
        />
        <WorkspacePublicationSummary
          locale={locale}
          published={data.published}
          paused={data.paused}
          reserved={data.reserved}
          sold={data.sold}
          exchanged={data.exchanged}
          listingValueKz={data.listingValueKz}
          numberLocale={numberLocale}
        />
        <div className="workspace-main-grid">
          <WorkspaceRecentListings
            locale={locale}
            listings={data.recent}
            imagesPublicBase={bookImagesPublicBase()}
            numberLocale={numberLocale}
          />
          <WorkspaceActivity
            locale={locale}
            items={data.activity}
            dateLocale={numberLocale}
            favorites={data.favorites}
          />
        </div>
        <WorkspaceInboxCards
          locale={locale}
          unreadNotifications={data.unreadNotifications}
          unreadMessages={data.unreadMessages}
        />
      </section>
    </AppShell>
  );
}
