/**
 * Generates idempotent demo seed SQL (Supabase SQL editor / MCP execute_sql).
 * Does not upload storage files — run `npm run seed:demo` with service role for covers.
 *
 * Usage:
 *   DEMO_USER_PASSWORD='…' npm run seed:demo:sql > demo-seed.sql
 *   DEMO_USER_PASSWORD='…' npm run seed:demo:sql -- --chunks=7 --out-dir=./tmp
 */
import {mkdirSync, writeFileSync} from "fs";
import {join} from "path";
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
import {DEMO_USERS, demoUserId} from "./demo-data/users";

const esc = (s: string) => s.replace(/'/g, "''");

function viewCountForTier(tier: DemoBookSpec["viewTier"]): number {
  if (tier === "high") return 120;
  if (tier === "medium") return 55;
  if (tier === "low") return 12;
  return 0;
}

function buildDemoSeedSql(passwordPlain: string): string {
  const demoProfileIds = DEMO_USERS.map(u => demoUserId(u.key));
  let sql = `-- Phase 9.6-DATA generated seed (do not commit; password is not embedded in repo)\nBEGIN;\n`;

  for (const u of DEMO_USERS) {
    const id = demoUserId(u.key);
    const email = esc(u.email);
    const name = esc(u.displayName);
    sql += `
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000', '${id}', 'authenticated', 'authenticated',
  '${email}', crypt('${esc(passwordPlain)}', gen_salt('bf')), now(), '', '', '', '',
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('display_name', '${name}'), now(), now(), false
) ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, encrypted_password = EXCLUDED.encrypted_password;

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
  '${demoUuid("identity", u.key)}', '${id}',
  jsonb_build_object('sub', '${id}', 'email', '${email}'),
  'email', '${id}', now(), now(), now()
) ON CONFLICT (provider, provider_id) DO NOTHING;

INSERT INTO public.profiles (id, display_name, city, municipality, bio, role)
VALUES ('${id}', '${name}', '${esc(u.city)}', '${esc(u.municipality)}', '${esc(u.bio)}', '${u.role}')
ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, city = EXCLUDED.city,
  municipality = EXCLUDED.municipality, bio = EXCLUDED.bio, role = EXCLUDED.role;
`;
  }

  for (const book of DEMO_BOOKS) {
    const id = demoBookId(book.key);
    const sellerId = demoUserId(book.sellerKey);
    const soldAt = book.status === "sold" || book.status === "exchanged" ? "now()" : "NULL";
    const coverPath = `${sellerId}/demo-${book.key}.svg`;
    sql += `
INSERT INTO public.books (
  id, seller_id, title, subject, grade, condition, mode, price_kz, description,
  city, municipality, is_published, status, sold_at
) VALUES (
  '${id}', '${sellerId}', '${esc(book.title)}', '${esc(book.subject)}', '${esc(book.grade)}',
  '${book.condition}', '${book.mode}', ${book.priceKz}, '${esc(book.description)}',
  '${esc(book.city)}', '${esc(book.municipality)}', ${book.isPublished}, '${book.status}', ${soldAt}
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_published = EXCLUDED.is_published;

INSERT INTO public.book_images (id, book_id, storage_path, sort_order)
VALUES ('${demoUuid("book-image", book.key)}', '${id}', '${coverPath}', 0)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
`;

    const views = viewCountForTier(book.viewTier);
    if (views > 0) {
      sql += `DELETE FROM public.book_views WHERE book_id = '${id}';\n`;
      for (let i = 0; i < views; i++) {
        const viewerId = i % 3 === 0 ? "NULL" : `'${demoProfileIds[i % demoProfileIds.length]}'`;
        sql += `
INSERT INTO public.book_views (id, book_id, viewer_id, viewed_at)
VALUES (
  '${demoUuid("book-view", `${book.key}-${i}`)}', '${id}', ${viewerId},
  now() - interval '${i} hours'
) ON CONFLICT (id) DO NOTHING;
`;
      }
    }
  }

  for (const fav of DEMO_FAVORITES) {
    sql += `
INSERT INTO public.favorites (user_id, book_id)
VALUES ('${demoUserId(fav.userKey)}', '${demoBookId(fav.bookKey)}')
ON CONFLICT DO NOTHING;
`;
  }

  for (const conv of DEMO_CONVERSATIONS) {
    const bookId = demoBookId(conv.bookKey);
    const buyerId = demoUserId(conv.buyerKey);
    const sellerKey = DEMO_BOOKS.find(b => b.key === conv.bookKey)!.sellerKey;
    const sellerId = demoUserId(sellerKey);
    sql += `
INSERT INTO public.conversations (id, book_id, buyer_id, seller_id, last_message_at)
VALUES ('${demoConversationId(conv.key)}', '${bookId}', '${buyerId}', '${sellerId}', now())
ON CONFLICT (id) DO NOTHING;
`;
  }

  sql += `DELETE FROM public.notifications WHERE user_id IN (${demoProfileIds.map(id => `'${id}'`).join(",")});\n`;

  for (const msg of DEMO_MESSAGES) {
    const created = `now() - interval '${24 + DEMO_MESSAGES.indexOf(msg)} hours'`;
    const readAt = msg.read ? created : "NULL";
    sql += `
INSERT INTO public.messages (id, conversation_id, sender_id, body, created_at, read_at)
VALUES (
  '${demoMessageId(msg.key)}', '${demoConversationId(msg.conversationKey)}',
  '${demoUserId(msg.senderKey)}', '${esc(msg.body)}', ${created}, ${readAt}
) ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body;
`;
  }

  const extraNotifications = [
    {
      id: demoUuid("notification", "fav-1"),
      user_id: demoUserId("lucia"),
      type: "favorite",
      title: "Novo favorito (demo)",
      body: "Alguém guardou o seu anúncio de Matemática.",
      book_id: demoBookId("book-010"),
      is_read: false,
    },
    {
      id: demoUuid("notification", "review-1"),
      user_id: demoUserId("miguel"),
      type: "review",
      title: "Nova avaliação (demo)",
      body: "Recebeu uma avaliação de 5 estrelas.",
      book_id: demoBookId("book-004"),
      is_read: false,
    },
    {
      id: demoUuid("notification", "milestone-1"),
      user_id: demoUserId("lucia"),
      type: "book_view",
      title: "Marco de visualizações (demo)",
      body: "O seu anúncio atingiu 100 visualizações.",
      book_id: demoBookId("book-001"),
      is_read: true,
    },
  ];
  for (const n of extraNotifications) {
    sql += `
INSERT INTO public.notifications (id, user_id, type, title, body, book_id, is_read)
VALUES (
  '${n.id}', '${n.user_id}', '${n.type}', '${esc(n.title)}', '${esc(n.body)}',
  '${n.book_id}', ${n.is_read}
) ON CONFLICT (id) DO NOTHING;
`;
  }

  for (const rev of DEMO_REVIEWS) {
    sql += `
INSERT INTO public.seller_reviews (id, seller_id, reviewer_id, book_id, rating, comment)
VALUES (
  '${demoReviewId(rev.key)}', '${demoUserId(rev.sellerKey)}', '${demoUserId(rev.reviewerKey)}',
  '${demoBookId(rev.bookKey)}', ${rev.rating}, '${esc(rev.comment)}'
) ON CONFLICT (id) DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment;
`;
  }

  for (const rep of DEMO_REPORTS) {
    sql += `
INSERT INTO public.listing_reports (id, book_id, reporter_id, reason, details)
VALUES (
  '${demoReportId(rep.key)}', '${demoBookId(rep.bookKey)}', '${demoUserId(rep.reporterKey)}',
  '${esc(rep.reason)}', '${esc(rep.details)}'
) ON CONFLICT (id) DO NOTHING;
`;
  }

  sql += `DELETE FROM public.analytics_events WHERE session_id LIKE 'demo-seed-%';\n`;
  let ai = 0;
  for (const eventName of DEMO_ANALYTICS_EVENTS) {
    for (let j = 0; j < 3; j++) {
      const userId = j === 0 ? "NULL" : `'${demoUserId(DEMO_USERS[ai % DEMO_USERS.length].key)}'`;
      const path = j === 0 ? "/books" : `/books/${demoBookId("book-010")}`;
      sql += `
INSERT INTO public.analytics_events (id, user_id, session_id, event_name, path, metadata, created_at)
VALUES (
  '${demoUuid("analytics", `${eventName}-${ai}-${j}`)}', ${userId}, 'demo-seed-${ai % 5}',
  '${eventName}', '${path}', '{"demo":true,"seed":"9.6-DATA"}'::jsonb, now() - interval '${ai + j} days'
);
`;
      ai++;
    }
  }

  sql += `COMMIT;\n`;
  return sql;
}

/** Split inner statements into ~maxBytes chunks (each wrapped in BEGIN/COMMIT). */
function writeChunkFiles(fullSql: string, chunkCount: number, outDir: string) {
  const inner = fullSql
    .replace(/^--[^\n]*\n/, "")
    .replace(/^BEGIN;\n/, "")
    .replace(/\nCOMMIT;\n$/, "");
  const statements = inner.split(/\n(?=INSERT |DELETE )/);
  const target = Math.ceil(inner.length / chunkCount);
  const chunks: string[] = [];
  let current = "";
  for (const stmt of statements) {
    const piece = stmt.trim() ? `${stmt.trim()}\n\n` : "";
    if (current.length + piece.length > target && current.length > 0 && chunks.length < chunkCount - 1) {
      chunks.push(current.trim());
      current = piece;
    } else {
      current += piece;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  while (chunks.length < chunkCount) chunks.push("-- empty");
  while (chunks.length > chunkCount) {
    const last = chunks.pop()!;
    chunks[chunks.length - 1] += `\n\n${last}`;
  }

  mkdirSync(outDir, {recursive: true});
  chunks.forEach((body, i) => {
    const file = join(outDir, `seed-chunk-${i}.sql`);
    writeFileSync(file, `BEGIN;\n${body}\nCOMMIT;\n`, "utf8");
  });
  console.error(`Wrote ${chunks.length} chunks to ${outDir}/seed-chunk-*.sql`);
}

function main() {
  const demoPassword = process.env.DEMO_USER_PASSWORD;
  if (!demoPassword || demoPassword.length < 8) {
    console.error("Set DEMO_USER_PASSWORD (min 8 chars) for SQL generation.");
    process.exit(1);
  }
  const sql = buildDemoSeedSql(demoPassword);
  const args = process.argv.slice(2);
  const chunksIdx = args.findIndex(a => a.startsWith("--chunks="));
  const outIdx = args.findIndex(a => a.startsWith("--out-dir="));

  if (chunksIdx >= 0) {
    const n = parseInt(args[chunksIdx].split("=")[1] ?? "7", 10);
    const outDir =
      outIdx >= 0 ? args[outIdx].split("=")[1] ?? "." : ".";
    writeChunkFiles(sql, Number.isFinite(n) && n > 0 ? n : 7, outDir);
    return;
  }

  process.stdout.write(sql);
}

main();
