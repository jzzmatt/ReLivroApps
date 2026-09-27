import {NextRequest, NextResponse} from "next/server";
import {publicApiErrorMessage} from "@/lib/api-errors";
import {cityIlikePattern, normalizeCity} from "@/lib/nearby-city";
import {MARKETPLACE_BOOK_SELECT, MARKETPLACE_PAGE_SIZE} from "@/lib/marketplace-query";
import {createClient} from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {searchParams} = request.nextUrl;
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    48,
    Math.max(1, Number.parseInt(searchParams.get("limit") || String(MARKETPLACE_PAGE_SIZE), 10) || MARKETPLACE_PAGE_SIZE),
  );
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const city = normalizeCity(searchParams.get("city"));
  let query = supabase
    .from("books")
    .select(MARKETPLACE_BOOK_SELECT, {count: "exact"})
    .eq("is_published", true);
  if (city) query = query.ilike("city", cityIlikePattern(city));
  const {data, error, count} = await query.order("created_at", {ascending: false}).range(from, to);

  if (error) return NextResponse.json({error: publicApiErrorMessage(error)}, {status: 500});

  const total = count ?? 0;
  return NextResponse.json({
    books: data ?? [],
    page,
    limit,
    total,
    hasMore: to + 1 < total,
  });
}
