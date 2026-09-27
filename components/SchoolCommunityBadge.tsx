import {schoolTrustT} from "@/lib/i18n-school-trust";
import type {Locale} from "@/lib/i18n";

export function SchoolCommunityBadge({
  locale,
  schoolName,
  verified = false,
}: {
  locale: Locale;
  schoolName: string;
  verified?: boolean;
}) {
  const t = schoolTrustT(locale);
  return (
    <div className={"school-trust-badge" + (verified ? " verified" : "")} title={verified ? t.verifiedHint : t.hint}>
      <span className="school-trust-badge-label">{verified ? t.verifiedBadge : t.badge}</span>
      <span className="school-trust-badge-school">{schoolName}</span>
    </div>
  );
}
