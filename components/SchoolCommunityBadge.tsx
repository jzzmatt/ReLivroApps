import {schoolTrustT} from "@/lib/i18n-school-trust";
import type {Locale} from "@/lib/i18n";

export function SchoolCommunityBadge({
  locale,
  schoolName,
}: {
  locale: Locale;
  schoolName: string;
}) {
  const t = schoolTrustT(locale);
  return (
    <div className="school-trust-badge" title={t.hint}>
      <span className="school-trust-badge-label">{t.badge}</span>
      <span className="school-trust-badge-school">{schoolName}</span>
    </div>
  );
}
