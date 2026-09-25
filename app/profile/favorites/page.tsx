import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";

export default async function FavoritesPage(){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
 if(!user)return <AppShell><section className="profile-page container"><h1>Os meus favoritos</h1><p>Entre para ver os livros guardados.</p><Link className="button" href="/auth">Entrar</Link></section></AppShell>;
 const {data}=await supabase.from("favorites").select("book_id, books(*)").eq("user_id",user.id);
 return <AppShell><section className="profile-page container"><span className="eyebrow">GUARDADOS</span><h1>Os meus favoritos</h1><div className="favorite-list">{data?.length?data.map((item)=><Link className="favorite-row" href={"/books/"+item.book_id} key={item.book_id}>♡ Livro guardado <span>→</span></Link>):<p>Ainda não guardou nenhum livro.</p>}</div></section></AppShell>
}