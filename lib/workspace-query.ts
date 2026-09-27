import type {SupabaseClient} from "@supabase/supabase-js";
import {unreadMessageCount} from "@/lib/messages-unread";
import {MY_LISTINGS_SELECT} from "@/lib/marketplace-query";
import type {Book} from "@/lib/books";

export type WorkspaceListing = {
  id: string;
  title: string;
  condition: string;
  priceKz: number;
  city: string | null;
  isPublished: boolean;
  status: Book["status"];
  imagePath: string | null;
  photoCount: number;
  viewCount: number;
  favoriteCount: number;
};

export type WorkspaceActivity = {
  id: string;
  at: string;
  kind: "published" | "paused" | "review" | "notification" | "favorite";
  label: string;
};

export type WorkspaceData = {
  displayName: string;
  city: string | null;
  municipality: string | null;
  visitors: number;
  books: number;
  favorites: number;
  unreadMessages: number;
  unreadNotifications: number;
  listingValueKz: number;
  published: number;
  paused: number;
  reserved: number;
  sold: number;
  exchanged: number;
  recent: WorkspaceListing[];
  activity: WorkspaceActivity[];
};

type Signals = {
  favorite_total?: number;
  visitor_total?: number;
  by_book?: {book_id: string; favorite_count: number}[];
  recent_favorites?: {book_id: string; title: string; created_at: string}[];
};

export async function loadWorkspace(
  supabase: SupabaseClient,
  userId: string,
): Promise<WorkspaceData> {
  const [
    profileRes,
    totalRes,
    publishedRes,
    pausedRes,
    reservedRes,
    soldRes,
    exchangedRes,
    valueRes,
    unreadMessages,
    unreadNotesRes,
    recentRes,
    notesRes,
    reviewsRes,
    signalsRes,
  ] = await Promise.all([
    supabase.from("profiles").select("display_name,city,municipality").eq("id", userId).maybeSingle(),
    supabase.from("books").select("id", {count: "exact", head: true}).eq("seller_id", userId),
    supabase
      .from("books")
      .select("id", {count: "exact", head: true})
      .eq("seller_id", userId)
      .eq("is_published", true),
    supabase
      .from("books")
      .select("id", {count: "exact", head: true})
      .eq("seller_id", userId)
      .eq("is_published", false)
      .eq("status", "active"),
    supabase.from("books").select("id", {count: "exact", head: true}).eq("seller_id", userId).eq("status", "reserved"),
    supabase.from("books").select("id", {count: "exact", head: true}).eq("seller_id", userId).eq("status", "sold"),
    supabase.from("books").select("id", {count: "exact", head: true}).eq("seller_id", userId).eq("status", "exchanged"),
    supabase.from("books").select("price_kz").eq("seller_id", userId).eq("is_published", true).eq("status", "active"),
    unreadMessageCount(supabase, userId),
    supabase
      .from("notifications")
      .select("id", {count: "exact", head: true})
      .eq("user_id", userId)
      .eq("is_read", false),
    supabase
      .from("books")
      .select(MY_LISTINGS_SELECT)
      .eq("seller_id", userId)
      .order("updated_at", {ascending: false})
      .limit(6),
    supabase
      .from("notifications")
      .select("id,title,created_at")
      .eq("user_id", userId)
      .order("created_at", {ascending: false})
      .limit(4),
    supabase
      .from("seller_reviews")
      .select("id,created_at")
      .eq("seller_id", userId)
      .order("created_at", {ascending: false})
      .limit(3),
    supabase.rpc("seller_workspace_signals"),
  ]);

  const signals = (signalsRes.data || {}) as Signals;
  const favoriteByBook = new Map(
    (signals.by_book || []).map((row) => [row.book_id, row.favorite_count]),
  );
  const recentBooks = (recentRes.data || []) as Book[];

  const viewCounts = await Promise.all(
    recentBooks.map(async (book) => {
      const {count} = await supabase
        .from("book_views")
        .select("id", {count: "exact", head: true})
        .eq("book_id", book.id);
      return [book.id, count ?? 0] as const;
    }),
  );
  const viewsByBook = new Map(viewCounts);

  const listingValueKz = (valueRes.data || []).reduce(
    (sum, row) => sum + Number(row.price_kz || 0),
    0,
  );

  const recent: WorkspaceListing[] = recentBooks.map((book) => ({
    id: book.id,
    title: book.title,
    condition: book.condition,
    priceKz: Number(book.price_kz || 0),
    city: book.city,
    isPublished: book.is_published,
    status: book.status || "active",
    imagePath: book.book_images?.[0]?.storage_path ?? null,
    photoCount: book.book_images?.length ?? 0,
    viewCount: viewsByBook.get(book.id) ?? 0,
    favoriteCount: favoriteByBook.get(book.id) ?? 0,
  }));

  const activity: WorkspaceActivity[] = [
    ...recentBooks.slice(0, 4).map((book) => ({
      id: `book-${book.id}`,
      at: book.updated_at || book.created_at,
      kind: book.is_published ? ("published" as const) : ("paused" as const),
      label: book.title,
    })),
    ...(reviewsRes.data || []).map((row) => ({
      id: `review-${row.id}`,
      at: row.created_at,
      kind: "review" as const,
      label: "",
    })),
    ...(notesRes.data || []).map((row) => ({
      id: `note-${row.id}`,
      at: row.created_at,
      kind: "notification" as const,
      label: row.title,
    })),
    ...(signals.recent_favorites || []).map((row) => ({
      id: `fav-${row.book_id}-${row.created_at}`,
      at: row.created_at,
      kind: "favorite" as const,
      label: row.title,
    })),
  ]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 8);

  const profile = profileRes.data;

  return {
    displayName: profile?.display_name?.trim() || "",
    city: profile?.city ?? null,
    municipality: profile?.municipality ?? null,
    visitors: signals.visitor_total ?? 0,
    books: totalRes.count ?? 0,
    favorites: signals.favorite_total ?? 0,
    unreadMessages,
    unreadNotifications: unreadNotesRes.count ?? 0,
    listingValueKz,
    published: publishedRes.count ?? 0,
    paused: pausedRes.count ?? 0,
    reserved: reservedRes.count ?? 0,
    sold: soldRes.count ?? 0,
    exchanged: exchangedRes.count ?? 0,
    recent,
    activity,
  };
}
