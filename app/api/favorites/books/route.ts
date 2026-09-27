import {NextRequest, NextResponse} from "next/server";
import {publicApiErrorMessage} from "@/lib/api-errors";
import {booksFromFavoriteRows} from "@/lib/favorites-books";
import {FAVORITES_LIST_SELECT, MARKETPLACE_PAGE_SIZE} from "@/lib/marketplace-query";
import {createClient} from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error: "Authentication required"}, {status: 401});

  const {searchParams} = request.nextUrl;
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    48,
    Math.max(1, Number.parseInt(searchParams.get("limit") || String(MARKETPLACE_PAGE_SIZE), 10) || MARKETPLACE_PAGE_SIZE),
  );
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {data, error, count} = await supabase
    .from("favorites")
    .select(FAVORITES_LIST_SELECT, {count: "exact"})
    .eq("user_id", user.id)
    .order("created_at", {ascending: false})
    .range(from, to);

  if (error) return NextResponse.json({error: publicApiErrorMessage(error)}, {status: 500});

  const total = count ?? 0;
  const books = booksFromFavoriteRows(data);

  return NextResponse.json({
    books,
    page,
    limit,
    total,
    hasMore: to + 1 < total,
  });
}
