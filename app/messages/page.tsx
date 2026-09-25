import Link from "next/link";
import {redirect} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";

export default async function MessagesPage(){
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/auth");
 const {data}=await s.from("conversations").select("id,book_id,last_message_at,books(title,price_kz),buyer_id,seller_id").or("buyer_id.eq."+user.id+",seller_id.eq."+user.id).order("last_message_at",{ascending:false});
 return <AppShell><section className="messages-page container"><span className="eyebrow">COMUNIDADE</span><h1>As minhas conversas.</h1><p className="messages-intro">Fale directamente com compradores e vendedores.</p><div className="conversation-list">{data?.length?data.map(c=><Link href={"/messages/"+c.id} className="conversation-row" key={c.id}><div className="conversation-icon">💬</div><div><strong>{c.books?.title||"Livro"}</strong><p>{Number(c.books?.price_kz||0).toLocaleString("pt-AO")} Kz</p></div><span>→</span></Link>):<div className="empty-state"><h2>Ainda não tem conversas.</h2><p>Contacte um vendedor a partir de um livro.</p><Link className="button" href="/books">Explorar livros</Link></div>}</div></section></AppShell>;
}