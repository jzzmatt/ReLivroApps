import Link from "next/link";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";
import {messages, type Locale} from "@/lib/i18n";
import {oneRelation} from "@/lib/supabase-relations";

export default async function MessagesPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("relivro-locale")?.value as Locale) || "pt";
  const t = messages[locale];
  const s = await createClient();
  const {data: {user}} = await s.auth.getUser();
  if (!user) redirect("/auth");
  const {data} = await s.from("conversations")
    .select("id,book_id,last_message_at,books(title,price_kz),buyer_id,seller_id")
    .or("buyer_id.eq." + user.id + ",seller_id.eq." + user.id)
    .order("last_message_at", {ascending: false});

  return (
    <AppShell>
      <section className="messages-page container">
        <span className="eyebrow">{t.messages.eyebrow}</span>
        <h1>{t.messages.title}</h1>
        <p className="messages-intro">{t.messages.intro}</p>
        <div className="conversation-list">
          {data?.length ? data.map(c => {
            const book = oneRelation(c.books);
            return (
              <Link href={"/messages/" + c.id} className="conversation-row" key={c.id}>
                <div className="conversation-icon">💬</div>
                <div>
                  <strong>{book?.title || "Livro"}</strong>
                  <p>{Number(book?.price_kz || 0).toLocaleString("pt-AO")} Kz</p>
                </div>
                <span>→</span>
              </Link>
            );
          }) : (
            <div className="empty-state">
              <h2>{t.messages.emptyTitle}</h2>
              <p>{t.messages.emptyText}</p>
              <Link className="button" href="/books">{t.messages.explore}</Link>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}