/**
 * Phase 9.6-DATA — development/staging demo seed (service role, local only).
 * Requires SEED_DATABASE=true. Never run against production.
 */
import {readFileSync} from "fs";
import {join} from "path";
import {createClient, type SupabaseClient} from "@supabase/supabase-js";
import {
  DEMO_ANALYTICS_EVENTS,
  DEMO_CONVERSATIONS,
  DEMO_FAVORITES,
  DEMO_MESSAGES,
  DEMO_REPORTS,
  DEMO_REVIEWS,
  demoConversationId,
  demoMessageId,
  demoReportId,
  demoReviewId,
} from "./demo-data/activity";
import {DEMO_BOOKS, demoBookId, type DemoBookSpec} from "./demo-data/books";
import {demoUuid} from "./demo-data/demo-uuid";
import {assertSeedEnvironment} from "./demo-data/seed-guard";
import {DEMO_USERS, demoUserId} from "./demo-data/users";

const ROOT = process.cwd();

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i <= 0) continue;
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    // optional .env.local
  }
}

function viewCountForTier(tier: DemoBookSpec["viewTier"]): number {
  if (tier === "high") return 120;
  if (tier === "medium") return 55;
  if (tier === "low") return 12;
  return 0;
}

async function findUserIdByEmail(admin: SupabaseClient, email: string): Promise<string | null> {
  let page = 1;
  while (page <= 20) {
    const {data, error} = await admin.auth.admin.listUsers({page, perPage: 200});
    if (error) throw error;
    const hit = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (hit?.id) return hit.id;
    if (data.users.length < 200) break;
    page++;
  }
  return null;
}

async function main() {
  loadEnvLocal();
  assertSeedEnvironment();

  const password = process.env.DEMO_USER_PASSWORD;
  if (!password || password.length < 8) {
    console.error("Set DEMO_USER_PASSWORD (min 8 chars) in .env.local — never commit it.");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(url, serviceKey, {auth: {autoRefreshToken: false, persistSession: false}});

  const userIds = new Map<string, string>();

  console.log("Creating demo auth users…");
  for (const spec of DEMO_USERS) {
    const expectedId = demoUserId(spec.key);
    let id = await findUserIdByEmail(admin, spec.email);
    if (!id) {
      const {data, error} = await admin.auth.admin.createUser({
        id: expectedId,
        email: spec.email,
        password,
        email_confirm: true,
        user_metadata: {display_name: spec.displayName},
      });
      if (error) throw new Error(`createUser ${spec.email}: ${error.message}`);
      id = data.user?.id ?? expectedId;
    }
    userIds.set(spec.key, id);

    const {error: profileError} = await admin
      .from("profiles")
      .update({
        display_name: spec.displayName,
        city: spec.city,
        municipality: spec.municipality,
        bio: spec.bio,
        role: spec.role,
      })
      .eq("id", id);
    if (profileError) throw profileError;
  }

  const demoProfileIds = [...userIds.values()];
  console.log("Clearing prior demo notifications (idempotent)…");
  await admin.from("notifications").delete().in("user_id", demoProfileIds);

  console.log("Upserting books and covers…");
  const bookIds = new Map<string, string>();

  for (const book of DEMO_BOOKS) {
    const sellerId = userIds.get(book.sellerKey)!;
    const bookId = demoBookId(book.key);
    bookIds.set(book.key, bookId);

    const soldAt =
      book.status === "sold" || book.status === "exchanged" ? new Date().toISOString() : null;

    const {error: bookError} = await admin.from("books").upsert(
      {
        id: bookId,
        seller_id: sellerId,
        title: book.title,
        subject: book.subject,
        grade: book.grade,
        condition: book.condition,
        mode: book.mode,
        price_kz: book.priceKz,
        description: book.description,
        city: book.city,
        municipality: book.municipality,
        is_published: book.isPublished,
        status: book.status,
        sold_at: soldAt,
      },
      {onConflict: "id"},
    );
    if (bookError) throw bookError;

    const coverPath = `${sellerId}/demo-${book.key}.svg`;
    const filePath = join(ROOT, "public/seed-covers", book.coverFile);
    const body = readFileSync(filePath);
    const {error: uploadError} = await admin.storage.from("book-images").upload(coverPath, body, {
      contentType: "image/svg+xml",
      upsert: true,
    });
    if (uploadError) throw uploadError;

    const imageId = demoUuid("book-image", book.key);
    const {error: imgError} = await admin.from("book_images").upsert(
      {id: imageId, book_id: bookId, storage_path: coverPath, sort_order: 0},
      {onConflict: "id"},
    );
    if (imgError) throw imgError;

    const views = viewCountForTier(book.viewTier);
    if (views > 0) {
      await admin.from("book_views").delete().eq("book_id", bookId);
      const rows = Array.from({length: views}, (_, i) => ({
        id: demoUuid("book-view", `${book.key}-${i}`),
        book_id: bookId,
        viewer_id: i % 3 === 0 ? null : demoProfileIds[i % demoProfileIds.length],
        viewed_at: new Date(Date.now() - i * 3600_000).toISOString(),
      }));
      const {error: viewError} = await admin.from("book_views").upsert(rows, {onConflict: "id"});
      if (viewError) throw viewError;
    }
  }

  console.log("Favourites…");
  for (const fav of DEMO_FAVORITES) {
    const {error} = await admin.from("favorites").upsert(
      {
        user_id: userIds.get(fav.userKey)!,
        book_id: bookIds.get(fav.bookKey)!,
      },
      {onConflict: "user_id,book_id"},
    );
    if (error) throw error;
  }

  console.log("Conversations and messages…");
  for (const conv of DEMO_CONVERSATIONS) {
    const bookId = bookIds.get(conv.bookKey)!;
    const buyerId = userIds.get(conv.buyerKey)!;
    const {data: bookRow} = await admin.from("books").select("seller_id").eq("id", bookId).single();
    const sellerId = bookRow!.seller_id as string;
    const convId = demoConversationId(conv.key);
    const {error} = await admin.from("conversations").upsert(
      {
        id: convId,
        book_id: bookId,
        buyer_id: buyerId,
        seller_id: sellerId,
        last_message_at: new Date().toISOString(),
      },
      {onConflict: "id"},
    );
    if (error) throw error;
  }

  for (const msg of DEMO_MESSAGES) {
    const convId = demoConversationId(msg.conversationKey);
    const senderId = userIds.get(msg.senderKey)!;
    const createdAt = new Date(Date.now() - 1000 * 60 * 60 * (24 + DEMO_MESSAGES.indexOf(msg))).toISOString();
    const {error} = await admin.from("messages").upsert(
      {
        id: demoMessageId(msg.key),
        conversation_id: convId,
        sender_id: senderId,
        body: msg.body,
        created_at: createdAt,
        read_at: msg.read ? createdAt : null,
      },
      {onConflict: "id"},
    );
    if (error) throw error;
  }

  console.log("Extra demo notifications…");
  const extraNotifications = [
    {
      id: demoUuid("notification", "fav-1"),
      user_id: userIds.get("lucia")!,
      type: "favorite",
      title: "Novo favorito (demo)",
      body: "Alguém guardou o seu anúncio de Matemática.",
      book_id: bookIds.get("book-010"),
      is_read: false,
    },
    {
      id: demoUuid("notification", "review-1"),
      user_id: userIds.get("miguel")!,
      type: "review",
      title: "Nova avaliação (demo)",
      body: "Recebeu uma avaliação de 5 estrelas.",
      book_id: bookIds.get("book-004"),
      is_read: false,
    },
    {
      id: demoUuid("notification", "milestone-1"),
      user_id: userIds.get("lucia")!,
      type: "book_view",
      title: "Marco de visualizações (demo)",
      body: "O seu anúncio atingiu 100 visualizações.",
      book_id: bookIds.get("book-001"),
      is_read: true,
    },
  ];
  for (const n of extraNotifications) {
    const {error} = await admin.from("notifications").upsert(n, {onConflict: "id"});
    if (error) throw error;
  }

  console.log("Reviews…");
  for (const rev of DEMO_REVIEWS) {
    const {error} = await admin.from("seller_reviews").upsert(
      {
        id: demoReviewId(rev.key),
        seller_id: userIds.get(rev.sellerKey)!,
        reviewer_id: userIds.get(rev.reviewerKey)!,
        book_id: bookIds.get(rev.bookKey)!,
        rating: rev.rating,
        comment: rev.comment,
      },
      {onConflict: "id"},
    );
    if (error) throw error;
  }

  console.log("Listing reports…");
  for (const rep of DEMO_REPORTS) {
    const {error} = await admin.from("listing_reports").upsert(
      {
        id: demoReportId(rep.key),
        book_id: bookIds.get(rep.bookKey)!,
        reporter_id: userIds.get(rep.reporterKey)!,
        reason: rep.reason,
        details: rep.details,
      },
      {onConflict: "id"},
    );
    if (error) throw error;
  }

  console.log("Analytics events…");
  await admin.from("analytics_events").delete().like("session_id", "demo-seed-%");
  const analyticsRows = DEMO_ANALYTICS_EVENTS.flatMap((eventName, idx) => {
    const userId = demoProfileIds[idx % demoProfileIds.length];
    return [0, 1, 2].map(j => ({
      id: demoUuid("analytics", `${eventName}-${idx}-${j}`),
      user_id: j === 0 ? null : userId,
      session_id: `demo-seed-${idx % 5}`,
      event_name: eventName,
      path: j === 0 ? "/books" : `/books/${bookIds.get("book-010")}`,
      metadata: {demo: true, seed: "9.6-DATA"},
      created_at: new Date(Date.now() - (idx * 4 + j) * 86_400_000).toISOString(),
    }));
  });
  const {error: analyticsError} = await admin.from("analytics_events").upsert(analyticsRows, {onConflict: "id"});
  if (analyticsError) throw analyticsError;

  console.log("\nPhase 9.6-DATA seed complete.");
  console.log(`Demo users: ${DEMO_USERS.length} (*@demo.example.com)`);
  console.log(`Books: ${DEMO_BOOKS.length} | Conversations: ${DEMO_CONVERSATIONS.length} | Messages: ${DEMO_MESSAGES.length}`);
  console.log("Login with any demo email and DEMO_USER_PASSWORD from .env.local");
  console.log("Admin: admin.demo@demo.example.com");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
