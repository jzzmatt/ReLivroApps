import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function GET(){
 const supabase=await createClient();
 const {data,error}=await supabase.from("books").select("*,profiles(display_name,avatar_url)").eq("is_published",true).order("created_at",{ascending:false});
 if(error)return NextResponse.json({error:error.message},{status:500});
 return NextResponse.json({books:data});
}