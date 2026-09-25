import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";

export default async function FavoritesPage(){ const locale:Locale="pt"; const t=messages[locale];
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
 if(!user)return <AppShell><section className="profile-page container"><h1>{t.favorites.title}</h1><p>{t.favorites.login}</p><Link className="button" href="/auth">{t.auth.signin}</Link></section></AppShell>;
 const {data}=await supabase.from("favorites").select("book_id, books(*)").eq("user_id",user.id);
 return <AppShell><section className="profile-page container"><span className="eyebrow">GUARDADOS</span><h1>Os meus favoritos</h1><div className="favorite-list">{data?.length?data.map((item)=><Link className="favorite-row" href={"/books/"+item.book_id} key={item.book_id}>♡ Livro guardado <span>→</span></Link>):<p>{t.favorites.empty}</p>}</div></section></AppShell>
}