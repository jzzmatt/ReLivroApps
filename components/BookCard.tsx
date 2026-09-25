"use client";
import Link from "next/link";
import {motion} from "motion/react";
import type {Book} from "@/lib/books";

export function BookCard({book,index=0}:{book:Book;index?:number}){
 return <motion.article className="book-card" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.35,delay:index*.05}} whileHover={{y:-6}} whileTap={{scale:.985}}>
  <Link href={"/books/"+book.id} className="book-card-link">
   <div className={"book-art "+book.accent}><span>{book.subject.slice(0,1)}</span><small>{book.grade}</small></div>
   <div className="book-card-body"><div className="book-card-top"><span className={"mode "+book.mode.toLowerCase()}>{book.mode}</span><button aria-label="Adicionar aos favoritos" onClick={(e)=>e.preventDefault()}>♡</button></div><h3>{book.title}</h3><p>{book.condition} · {book.location}</p><div className="book-card-bottom"><strong>{book.price.toLocaleString("pt-AO")} Kz</strong><span>Ver livro →</span></div></div>
  </Link>
 </motion.article>;
}