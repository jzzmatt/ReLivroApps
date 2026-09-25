"use client";
import Link from "next/link";
import {motion} from "motion/react";
import type {Book} from "@/lib/books";
import {formatPrice} from "@/lib/books";
import {BookImage} from "@/components/BookImage";
import {FavoriteButton} from "@/components/FavoriteButton";

export function BookCard({book,index=0,isFavorite=false}:{book:Book;index?:number;isFavorite?:boolean}){
 const image=book.book_images?.slice().sort((a,b)=>a.sort_order-b.sort_order)[0];
 return <motion.article className="book-card" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.35,delay:index*.05}} whileHover={{y:-6}} whileTap={{scale:.985}}>
  <Link href={"/books/"+book.id} className="book-card-link">
   <div className="book-art"><BookImage path={image?.storage_path} title={book.title} className="book-image"/></div>
   <div className="book-card-body"><div className="book-card-top"><span className={"mode "+book.mode.toLowerCase()}>{book.mode}</span><FavoriteButton bookId={book.id} initial={isFavorite}/></div><h3>{book.title}</h3><p>{book.condition} · {book.city||"Angola"}</p><div className="book-card-bottom"><strong>{formatPrice(book.price_kz)}</strong><span>Ver livro →</span></div></div>
  </Link>
 </motion.article>;
}
