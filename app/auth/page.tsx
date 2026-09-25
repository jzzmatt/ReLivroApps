"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";

export default function AuthPage(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [name,setName]=useState("");
  const [mode,setMode]=useState<"signin"|"signup">("signin"); const [message,setMessage]=useState(""); const [loading,setLoading]=useState(false);
  const router=useRouter();
  async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setMessage("");const supabase=createClient();
    const result=mode==="signin"
      ? await supabase.auth.signInWithPassword({email,password})
      : await supabase.auth.signUp({email,password,options:{data:{display_name:name}}});
    setLoading(false);
    if(result.error){setMessage(result.error.message);return}
    setMessage(mode==="signup"?"Conta criada. Verifique o seu email se a confirmação estiver activa.":"Login efectuado.");
    if(mode==="signin") router.push("/books");
  }
  return <main className="auth-page"><div className="auth-card"><a className="brand" href="/"><span className="logo-book"><span/></span><span><b>Re</b>Livro<span>Apps</span></span></a><span className="eyebrow">{mode==="signin"?"BEM-VINDO":"CRIAR CONTA"}</span><h1>{mode==="signin"?"Entre na sua conta.":"Junte-se à comunidade."}</h1><p>{mode==="signin"?"Continue a descobrir livros escolares.":"Crie o seu perfil para comprar, trocar e publicar livros."}</p><form onSubmit={submit}>{mode==="signup"&&<label>Nome<input value={name} onChange={e=>setName(e.target.value)} required placeholder="O seu nome"/></label>}<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="nome@email.com"/></label><label>Palavra-passe<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} placeholder="••••••••"/></label><button className="button" disabled={loading}>{loading?"Aguarde...":mode==="signin"?"Entrar":"Criar conta"}</button></form>{message&&<div className="auth-message">{message}</div>}<button className="auth-switch" onClick={()=>{setMode(mode==="signin"?"signup":"signin");setMessage("")}}>{mode==="signin"?"Ainda não tenho conta":"Já tenho uma conta"}</button></div></main>
}