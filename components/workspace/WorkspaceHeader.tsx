import Link from "next/link";
import {fillTemplate, workspaceT} from "@/lib/i18n-workspace";
import type {Locale} from "@/lib/i18n";

export function WorkspaceHeader({
  locale,
  displayName,
}: {
  locale: Locale;
  displayName: string;
}) {
  const t = workspaceT(locale);
  return (
    <header className="workspace-header">
      <div>
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{fillTemplate(t.greeting, {name: displayName})}</h1>
        <p>{t.subtitle}</p>
      </div>
      <div className="workspace-header-actions">
        <Link className="button" href="/sell">
          {t.publish}
        </Link>
        <Link className="secondary-button" href="/books">
          {t.viewMarket}
        </Link>
        <Link className="secondary-button" href="/profile/edit">
          {t.editProfile}
        </Link>
      </div>
    </header>
  );
}
