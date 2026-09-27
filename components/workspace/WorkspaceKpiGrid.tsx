import {workspaceT} from "@/lib/i18n-workspace";
import type {Locale} from "@/lib/i18n";

function Card({icon, value, label}: {icon: string; value: number; label: string}) {
  return (
    <article className="workspace-kpi">
      <span aria-hidden="true">{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </article>
  );
}

export function WorkspaceKpiGrid({
  locale,
  visitors,
  books,
  favorites,
  messages,
}: {
  locale: Locale;
  visitors: number;
  books: number;
  favorites: number;
  messages: number;
}) {
  const t = workspaceT(locale);
  return (
    <div className="workspace-kpi-grid">
      <Card icon="👁" value={visitors} label={t.visitors} />
      <Card icon="▣" value={books} label={t.books} />
      <Card icon="♡" value={favorites} label={t.favorites} />
      <Card icon="✉" value={messages} label={t.messages} />
    </div>
  );
}
