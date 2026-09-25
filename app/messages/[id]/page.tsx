import Link from "next/link";
import {notFound,redirect} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";
import {MessageComposer} from "@/components/MessageComposer";
import {oneRelation} from "@/lib/supabase-relations";

export default async function ConversationPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/auth");
 const {data:conversation}=await s.from("conversations").select("id,book_id,buyer_id,seller_id,books(id,title,price_kz,city,status)").eq("id",id).maybeSingle();
 if(!conversation)notFound();if(conversation.buyer_id!==user.id&&conversation.seller_id!==user.id)notFound();
 const book=oneRelation(conversation.books);
 const {data:messages}=await s.from("messages").select("id,sender_id,body,created_at").eq("conversation_id",id).order("created_at",{ascending:true});
 await s.rpc("mark_conversation_messages_read",{p_conversation_id:id});
 return <AppShell><section className="conversation-page container"><Link className="back-link" href="/messages">← Conversas</Link><div className="conversation-header"><div><span className="eyebrow">LIVRO</span><h1>{book?.title}</h1><p>{Number(book?.price_kz||0).toLocaleString("pt-AO")} Kz · {book?.city||"Angola"}</p></div><Link className="secondary-button" href={"/books/"+conversation.book_id}>Ver livro</Link></div><div className="message-thread">{messages?.length?messages.map(m=><div className={"message-bubble "+(m.sender_id===user.id?"mine":"theirs")} key={m.id}>{m.body}<small>{new Date(m.created_at).toLocaleString("pt-AO",{day:"2-digit",hour:"2-digit",minute:"2-digit"})}</small></div>):<div className="thread-empty">Comece a conversa sobre este livro.</div>}</div><MessageComposer conversationId={id}/></section></AppShell>;
}