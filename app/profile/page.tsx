import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";

export default async function ProfilePage(){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
 return <AppShell><section className="profile-page container"><span className="eyebrow">A MINHA CONTA</span><h1>{user?"O meu perfil":"Entre para continuar."}</h1>{user?<div className="profile-panel"><div className="avatar profile-avatar">{(user.email||"U").slice(0,2).toUpperCase()}</div><div><h2>{user.user_metadata?.display_name||user.email?.split("@")[0]}</h2><p>{user.email}</p></div><div className="profile-links"><Link href="/sell">＋ Publicar livro</Link><Link href="/books">⌕ Explorar livros</Link><Link href="/profile/favorites">♡ Os meus favoritos</Link></div></div>:<Link className="button" href="/auth">Entrar / Criar conta</Link>}</section></AppShell>
}