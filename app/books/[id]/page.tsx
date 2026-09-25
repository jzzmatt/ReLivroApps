import Link from "next/link";
import {notFound} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {createClient} from "@/lib/supabase/server";
import {BookImage} from "@/components/BookImage";
import {FavoriteButton} from "@/components/FavoriteButton";
import {formatPrice,type Book} from "@/lib/books";
import {ContactSellerButton} from "@/components/ContactSellerButton";
import {ReportListingButton} from "@/components/ReportListingButton";
import {BookViewTracker} from "@/components/BookViewTracker";

export default async function BookDetail({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 const {data}=await supabase.from("books").select("*,book_images(id,storage_path,sort_order),profiles(display_name,avatar_url,city,municipality)").eq("id",id).maybeSingle();
 if(!data)notFound();const book=data as Book;const images=(book.book_images||[]).slice().sort((a,b)=>a.sort_order-b.sort_order);const {data:favorite}=user?await supabase.from("favorites").select("book_id").eq("user_id",user.id).eq("book_id",id).maybeSingle():{data:null};
 const own=user?.id===book.seller_id;
 return <AppShell><BookViewTracker bookId={book.id}/><section className="detail-page container"><Link className="back-link" href="/books">← Voltar aos livros</Link><div className="detail-grid"><div><div className="detail-art book-art">{images[0]?<BookImage path={images[0].storage_path} title={book.title} className="detail-image"/>:<span>{book.subject.slice(0,1)}</span>}</div>{images.length>1&&<div className="detail-thumbs">{images.map(image=><BookImage key={image.id} path={image.storage_path} title={book.title} className="detail-thumb"/>)}</div>}</div><div className="detail-copy"><div className="detail-topline"><span className={"mode "+book.mode.toLowerCase()}>{book.mode}</span><FavoriteButton bookId={book.id} initial={!!favorite}/></div><h1>{book.title}</h1><p className="detail-price">{formatPrice(book.price_kz)}</p>{book.description&&<p className="detail-description">{book.description}</p>}<div className="seller-mini"><div className="seller-avatar">{book.profiles?.avatar_url?<img src={book.profiles.avatar_url} alt=""/>:(book.profiles?.display_name||"RL").slice(0,2).toUpperCase()}</div><div><small>Vendedor</small><strong>{book.profiles?.display_name||"Membro ReLivroApps"}</strong><span>{[book.profiles?.city,book.profiles?.municipality].filter(Boolean).join(", ")}</span></div></div><div className="detail-info"><div><small>Estado</small><strong>{book.condition}</strong></div><div><small>Localização</small><strong>{book.city||"Angola"}{book.municipality?", "+book.municipality:""}</strong></div><div><small>Disciplina</small><strong>{book.subject}</strong></div><div><small>Classe</small><strong>{book.grade}</strong></div><div><small>Vendedor</small><strong>{book.profiles?.display_name||"Membro ReLivroApps"}</strong></div></div><div className="detail-actions">{own?<Link className="button" href={"/books/"+book.id+"/edit"}>Editar anúncio</Link>:<ContactSellerButton bookId={book.id}/>}</div><div className="safe-note">🛡 Compra e contacto seguros. Nunca partilhe dados de pagamento fora da plataforma.</div>{!own&&<ReportListingButton bookId={book.id}/>}</div></div></section></AppShell>;
}
