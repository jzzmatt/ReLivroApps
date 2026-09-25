"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";

export function MessageComposer({conversationId}:{conversationId:string}){
 const [body,setBody]=useState("");const [sending,setSending]=useState(false);const router=useRouter();
 async function send(e:React.FormEvent){e.preventDefault();const text=body.trim();if(!text||sending)return;setSending(true);const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){router.push("/auth");return}
 const {error}=await s.from("messages").insert({conversation_id:conversationId,sender_id:user.id,body:text});
 if(!error){setBody("");router.refresh()}else alert(error.message);setSending(false)}
 return <form className="message-composer" onSubmit={send}><textarea value={body} onChange={e=>setBody(e.target.value)} rows={2} maxLength={2000} placeholder="Escreva uma mensagem..." /><button className="button" disabled={sending||!body.trim()}>{sending?"A enviar...":"Enviar"}</button></form>;
}