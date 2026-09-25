import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {publicApiErrorMessage} from "@/lib/api-errors";


export async function POST(request:Request){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"Authentication required"},{status:401});
 const {bookId}=await request.json(); if(!bookId)return NextResponse.json({error:"bookId required"},{status:400});
 const {error}=await supabase.from("favorites").upsert({user_id:user.id,book_id:bookId});
 if(error)return NextResponse.json({error:publicApiErrorMessage(error)},{status:500});
 return NextResponse.json({saved:true});
}

export async function DELETE(request:Request){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"Authentication required"},{status:401});
 const {bookId}=await request.json();
 const {error}=await supabase.from("favorites").delete().eq("user_id",user.id).eq("book_id",bookId);
 if(error)return NextResponse.json({error:publicApiErrorMessage(error)},{status:500});
 return NextResponse.json({saved:false});
}