import Link from "next/link";
import {cookies} from "next/headers";
import {notFound, redirect} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {MessageComposer} from "@/components/MessageComposer";
import {conversationT} from "@/lib/i18n-conversation";
import {type Locale} from "@/lib/i18n";
import {localeTag} from "@/lib/locale-format";
import {createClient} from "@/lib/supabase/server";
import {oneRelation} from "@/lib/supabase-relations";

export default async function ConversationPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const cookieStore = await cookies();
  const locale = (cookieStore.get("relivro-locale")?.value as Locale) || "pt";
  const t = conversationT(locale);
  const numberLocale = localeTag(locale);

  const s = await createClient();
  const {
    data: {user},
  } = await s.auth.getUser();
  if (!user) redirect("/auth");

  const {data: conversation} = await s
    .from("conversations")
    .select("id,book_id,buyer_id,seller_id,books(id,title,price_kz,city,status)")
    .eq("id", id)
    .maybeSingle();
  if (!conversation) notFound();
  if (conversation.buyer_id !== user.id && conversation.seller_id !== user.id) notFound();

  const book = oneRelation(conversation.books);
  const {data: messages} = await s
    .from("messages")
    .select("id,sender_id,body,created_at")
    .eq("conversation_id", id)
    .order("created_at", {ascending: true});

  await s.rpc("mark_conversation_messages_read", {p_conversation_id: id});

  return (
    <AppShell>
      <section className="conversation-page container">
        <Link className="back-link" href="/messages">
          {t.back}
        </Link>
        <div className="conversation-header">
          <div>
            <span className="eyebrow">{t.bookEyebrow}</span>
            <h1>{book?.title || t.bookFallback}</h1>
            <p>
              {Number(book?.price_kz || 0).toLocaleString(numberLocale)} Kz · {book?.city || t.defaultCountry}
            </p>
          </div>
          <Link className="secondary-button" href={"/books/" + conversation.book_id}>
            {t.viewBook}
          </Link>
        </div>
        <div className="message-thread">
          {messages?.length ? (
            messages.map(m => (
              <div className={"message-bubble " + (m.sender_id === user.id ? "mine" : "theirs")} key={m.id}>
                {m.body}
                <small>
                  {new Date(m.created_at).toLocaleString(numberLocale, {
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            ))
          ) : (
            <div className="thread-empty">{t.threadEmpty}</div>
          )}
        </div>
        <MessageComposer conversationId={id}/>
      </section>
    </AppShell>
  );
}
