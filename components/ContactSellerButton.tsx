"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";

export function ContactSellerButton({bookId}:{bookId:string}){
 const [busy,setBusy]=useState(false);const router=useRouter();
 async function contact(){
  if(busy)return;setBusy(true);const s=createClient();const {data:{user}}=await s.auth.getUser();
  if(!user){router.push("/auth");return}
  const {data,error}=await s.rpc("start_conversation",{p_book_id:bookId});
  if(error){setBusy(false);alert(error.message);return}
  router.push("/messages/"+data);
 }
 return <button className="button" onClick={contact} disabled={busy}>{busy?"A abrir conversa...":"Contactar vendedor"}</button>;
}