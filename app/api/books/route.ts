import {NextRequest, NextResponse} from "next/server";
import {publicApiErrorMessage} from "@/lib/api-errors";
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

  const {data, error, count} = await supabase
    .from("books")
    .select(MARKETPLACE_BOOK_SELECT, {count: "exact"})
    .eq("is_published", true)
    .order("created_at", {ascending: false})
    .range(from, to);

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
