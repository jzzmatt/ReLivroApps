import {NextRequest, NextResponse} from "next/server";
import {publicApiErrorMessage} from "@/lib/api-errors";
import {requireStaff} from "@/lib/admin-access";
import {ADMIN_LISTINGS_PAGE_SIZE, ADMIN_LISTINGS_SELECT} from "@/lib/admin-listings-query";
import {createClient} from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({error: "Authentication required"}, {status: 401});

  const staffRole = await requireStaff(supabase, user.id);
  if (!staffRole) return NextResponse.json({error: "Forbidden"}, {status: 403});

  const {searchParams} = request.nextUrl;
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    48,
    Math.max(
      1,
      Number.parseInt(searchParams.get("limit") || String(ADMIN_LISTINGS_PAGE_SIZE), 10) ||
        ADMIN_LISTINGS_PAGE_SIZE,
    ),
  );
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {data, error, count} = await supabase
    .from("books")
    .select(ADMIN_LISTINGS_SELECT, {count: "exact"})
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
