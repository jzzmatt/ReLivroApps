import {cookies} from "next/headers";
import {defaultLocale, locales, type Locale} from "@/lib/i18n";

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("relivro-locale")?.value as Locale | undefined;
  if (value && locales.includes(value)) return value;
  return defaultLocale;
}
