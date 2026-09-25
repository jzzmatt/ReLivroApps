import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";
import {MarketplaceClient} from "@/components/MarketplaceClient";
import type {Book} from "@/lib/books";

export default async function BooksPage(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 const {data,error}=await supabase.from("books").select("*,book_images(id,storage_path,sort_order),profiles(display_name,avatar_url)").eq("is_published",true).order("created_at",{ascending:false});
 const books=(data||[]) as Book[];
 const {data:favorites}=user?await supabase.from("favorites").select("book_id").eq("user_id",user.id):{data:[]};
 return <AppShell><section className="marketplace container"><div className="marketplace-head"><div><span className="eyebrow">MARKETPLACE</span><h1>Encontre o seu próximo livro.</h1><p>Livros escolares de estudantes e famílias perto de si.</p></div><Link className="button button-small" href="/sell">＋ Publicar livro</Link></div>{error?<div className="empty-state">Não foi possível carregar os livros neste momento.</div>:books.length===0?<div className="empty-state"><h2>Ainda não há livros publicados.</h2><p>Seja o primeiro a publicar um livro.</p><Link className="button" href="/sell">Publicar livro</Link></div>:<MarketplaceClient books={books} favorites={(favorites||[]).map(f=>f.book_id)}/>}</section></AppShell>;
}
