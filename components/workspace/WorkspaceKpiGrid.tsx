import {WorkspaceKpiCard, type WorkspaceKpiAccent} from "@/components/workspace/WorkspaceKpiCard";
import {workspaceT} from "@/lib/i18n-workspace";
import type {Locale} from "@/lib/i18n";
import {localeTag} from "@/lib/locale-format";

const KPI_ORDER: {key: "visitors" | "books" | "favorites" | "messages"; accent: WorkspaceKpiAccent}[] = [
  {key: "visitors", accent: "visitors"},
  {key: "books", accent: "books"},
  {key: "favorites", accent: "favorites"},
  {key: "messages", accent: "messages"},
];

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
  const numberLocale = localeTag(locale);
  const values = {visitors, books, favorites, messages};
  const labels = {
    visitors: t.visitors,
    books: t.books,
    favorites: t.favorites,
    messages: t.messages,
  };

  return (
    <div className="workspace-kpi-grid">
      {KPI_ORDER.map(({key, accent}, index) => (
        <WorkspaceKpiCard
          key={key}
          accent={accent}
          index={index}
          label={labels[key]}
          value={values[key].toLocaleString(numberLocale)}
        />
      ))}
    </div>
  );
}
