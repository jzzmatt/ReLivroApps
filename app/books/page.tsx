"use client";
import {useMemo,useState} from "react";
import {AppShell} from "@/components/AppShell";
import {BookCard} from "@/components/BookCard";
import {books} from "@/lib/books";

export default function BooksPage(){
 const [query,setQuery]=useState(""); const [subject,setSubject]=useState("Todos"); const [mode,setMode]=useState("Todos");
 const filtered=useMemo(()=>books.filter(b=>(subject==="Todos"||b.subject===subject)&&(mode==="Todos"||b.mode===mode)&&(b.title.toLowerCase().includes(query.toLowerCase())||b.subject.toLowerCase().includes(query.toLowerCase()))),[query,subject,mode]);
 return <AppShell><section className="marketplace container"><div className="marketplace-head"><div><span className="eyebrow">MARKETPLACE</span><h1>Encontre o seu próximo livro.</h1><p>Livros escolares de estudantes e famílias perto de si.</p></div><a className="button button-small" href="/sell">＋ Publicar livro</a></div><label className="search-box"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar por título, disciplina..." /></label><div className="filter-scroll"><button className={subject==="Todos"?"active":""} onClick={()=>setSubject("Todos")}>Todos</button>{["Matemática","Português","Física","Biologia","História","Geografia"].map(s=><button key={s} className={subject===s?"active":""} onClick={()=>setSubject(s)}>{s}</button>)}</div><div className="mode-tabs">{["Todos","Venda","Troca"].map(m=><button key={m} className={mode===m?"active":""} onClick={()=>setMode(m)}>{m}</button>)}</div><div className="results-head"><strong>{filtered.length} livros encontrados</strong><button>↕ Ordenar</button></div><div className="book-grid">{filtered.map((book,i)=><BookCard key={book.id} book={book} index={i}/>)}</div></section></AppShell>;
}