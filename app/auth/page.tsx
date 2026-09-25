"use client";

import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";import {messages,type Locale} from "@/lib/i18n";import {LanguageSwitcher} from "@/components/LanguageSwitcher";

export default function AuthPage(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [name,setName]=useState("");
  const [mode,setMode]=useState<"signin"|"signup">("signin"); const [locale,setLocale]=useState<Locale>("pt"); const t=messages[locale]; const [message,setMessage]=useState(""); const [loading,setLoading]=useState(false);
  const router=useRouter(); useEffect(()=>{const saved=localStorage.getItem("relivro-locale") as Locale|null;if(saved&&["pt","fr","en"].includes(saved))setLocale(saved)},[]);
  async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setMessage("");const supabase=createClient();
    const result=mode==="signin"
      ? await supabase.auth.signInWithPassword({email,password})
      : await supabase.auth.signUp({email,password,options:{data:{display_name:name}}});
    setLoading(false);
    if(result.error){setMessage(result.error.message);return}
    setMessage(mode==="signup"?"Conta criada. Verifique o seu email se a confirmação estiver activa.":"Login efectuado.");
    if(mode==="signin") router.push("/books");
  }
  return <main className="auth-page"><div className="auth-card"><div className="auth-language"><LanguageSwitcher/></div><a className="brand" href="/"><span className="logo-book"><span/></span><span><b>Re</b>Livro<span>Apps</span></span></a><span className="eyebrow">{mode==="signin"?t.auth.welcome:t.auth.signup}</span><h1>{mode==="signin"?t.auth.signinTitle:t.auth.signupTitle}</h1><p>{mode==="signin"?t.auth.signinText:t.auth.signupText}</p><form onSubmit={submit}>{mode==="signup"&&<label>{t.auth.name}<input value={name} onChange={e=>setName(e.target.value)} required placeholder="O seu nome"/></label>}<label>{t.auth.email}<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="nome@email.com"/></label><label>{t.auth.password}<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} placeholder="••••••••"/></label><button className="button" disabled={loading}>{loading?t.auth.wait:mode==="signin"?t.auth.signin:t.auth.signup}</button></form>{message&&<div className="auth-message">{message}</div>}<button className="auth-switch" onClick={()=>{setMode(mode==="signin"?"signup":"signin");setMessage("")}}>{mode==="signin"?"Ainda não tenho conta":"Já tenho uma conta"}</button></div></main>
}