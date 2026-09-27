import {workspaceT} from "@/lib/i18n-workspace";
import type {Locale} from "@/lib/i18n";
import type {WorkspaceActivity as ActivityItem} from "@/lib/workspace-query";

export function WorkspaceActivity({
  locale,
  items,
  dateLocale,
  favorites,
}: {
  locale: Locale;
  items: ActivityItem[];
  dateLocale: string;
  favorites: number;
}) {
  const t = workspaceT(locale);
  const kindLabel = {
    published: t.activityPublished,
    paused: t.activityPaused,
    review: t.activityReview,
    notification: t.activityNotification,
    favorite: t.activityFavorite,
  };

  return (
    <section className="workspace-panel" aria-labelledby="workspace-activity">
      <h2 id="workspace-activity">{t.activityTitle}</h2>
      {items.length === 0 ? (
        <p className="workspace-muted">{t.activityEmpty}</p>
      ) : (
        <ul className="workspace-activity">
          {items.map((item) => (
            <li key={item.id}>
              <strong>{kindLabel[item.kind]}</strong>
              {item.label ? <span>{item.label}</span> : null}
              <time dateTime={item.at}>
                {new Date(item.at).toLocaleDateString(dateLocale)}
              </time>
            </li>
          ))}
        </ul>
      )}
      {favorites === 0 ? <p className="workspace-muted">{t.emptyFavorites}</p> : null}
    </section>
  );
}
