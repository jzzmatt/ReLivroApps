import {shellT} from "@/lib/i18n-shell";
import {getRequestLocale} from "@/lib/locale-server";

export default async function Loading() {
  const locale = await getRequestLocale();
  const message = shellT(locale).routeLoading;

  return (
    <main className="route-state">
      <div className="loading-mark">
        <span/>
      </div>
      <p>{message}</p>
    </main>
  );
}
