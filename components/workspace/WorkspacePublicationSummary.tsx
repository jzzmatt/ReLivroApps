import {workspaceT} from "@/lib/i18n-workspace";
import type {Locale} from "@/lib/i18n";

export function WorkspacePublicationSummary({
  locale,
  published,
  paused,
  reserved,
  sold,
  exchanged,
  listingValueKz,
  numberLocale,
}: {
  locale: Locale;
  published: number;
  paused: number;
  reserved: number;
  sold: number;
  exchanged: number;
  listingValueKz: number;
  numberLocale: string;
}) {
  const t = workspaceT(locale);
  const items = [
    [t.published, published],
    [t.paused, paused],
    [t.reserved, reserved],
    [t.sold, sold],
    [t.exchanged, exchanged],
  ] as const;

  return (
    <section className="workspace-panel" aria-labelledby="workspace-publications">
      <h2 id="workspace-publications">{t.publicationsTitle}</h2>
      <ul className="workspace-status-row">
        {items.map(([label, value]) => (
          <li key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>
      <p className="workspace-listing-value">
        {t.listingValue}: {listingValueKz.toLocaleString(numberLocale)} Kz
      </p>
    </section>
  );
}
