"use client";

import { motion } from "motion/react";import {useEffect,useState} from "react";import {messages,type Locale} from "@/lib/i18n";import {LanguageSwitcher} from "@/components/LanguageSwitcher";

const phones = [
  { title: "Livros que ligam estudantes", type: "home" },
  { title: "Matemática 10ª Classe", type: "detail" },
  { title: "32 resultados", type: "search" },
  { title: "Publicar livro", type: "publish" },
  { title: "João Silva", type: "profile" },
];

const benefits = [
  { title: "Poupe dinheiro", text: "Encontre livros escolares a preços acessíveis.", icon: "leaf" },
  { title: "Apoie a comunidade", text: "Mantenha os livros a circular entre estudantes.", icon: "people" },
  { title: "Dê uma segunda vida aos livros", text: "Compre, venda ou troque de forma simples.", icon: "book" },
];

function PhoneMockup({ title, type }: { title: string; type: string }) {
  return (
    <motion.div className={"phone phone-" + type}
      initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: phones.findIndex((p) => p.type === type) * 0.08 }}
      whileHover={{ y: -10, scale: 1.025 }}>
      <div className="phone-top"><span>9:41</span><span>●</span></div>
      <div className="phone-appbar"><span>‹</span><strong>ReLivroApps</strong><span>♡</span></div>
      <div className="phone-screen">
        {type === "home" && <><div className="phone-search">⌕ Pesquisar livros, disciplinas...</div><div className="phone-banner">Livros que ligam<br/>estudantes</div><div className="phone-chips"><i>Matemática</i><i>Português</i><i>Ciências</i></div><div className="phone-list-card"><b>Matemática 10ª Classe</b><small>Usado · Bom estado</small><strong>8 000 Kz</strong></div></>}
        {type === "detail" && <><div className="book-cover">Matemática<small>10ª Classe</small></div><h4>{title}</h4><small>Estado · Bom estado</small><small>Disciplina · Matemática</small><small>Localização · Lobito, Angola</small><button>Contactar vendedor</button></>}
        {type === "search" && <><div className="phone-search">⌕ Matemática 10ª classe</div><div className="filter-row"><b>Todos</b><span>Venda</span><span>Troca</span></div>{[8,6,12].map((price)=><div className="result-row" key={price}><div className="tiny-cover">M</div><div><b>Matemática 10ª Classe</b><small>Bom estado</small><strong>{price} 000 Kz</strong></div></div>)}</>}
        {type === "publish" && <><h4>Publicar livro</h4><div className="step-row"><b>1</b><span>Informações</span><span>2 Fotos</span><span>3 Revisão</span></div>{["Título do livro","Disciplina","Classe","Localização","Preço (Kz)"].map((x)=><div className="input-line" key={x}>{x}</div>)}<button>Continuar</button></>}
        {type === "profile" && <><div className="profile-head"><div className="avatar">JS</div><div><b>{title}</b><small>Estudante</small></div></div>{["Os meus anúncios","Os meus favoritos","Mensagens","Compras","Trocas","Definições"].map((x)=><div className="menu-row" key={x}>{x}<span>›</span></div>)}<div className="eco-note">Contribua<br/><small>Uma segunda vida aos livros.</small></div></>}
      </div>
      <div className="phone-nav"><span>⌂</span><span>⌕</span><b>＋</b><span>♧</span><span>♙</span></div>
    </motion.div>
  );
}

export default function Home() { const [locale,setLocale]=useState<Locale>("pt"); const t=messages[locale]; useEffect(()=>{const saved=localStorage.getItem("relivro-locale") as Locale|null;if(saved&&["pt","fr","en"].includes(saved))setLocale(saved);const fn=(e:Event)=>setLocale((e as CustomEvent<Locale>).detail);window.addEventListener("relivro-locale",fn);return()=>window.removeEventListener("relivro-locale",fn)},[]);
  return (
    <main>
      <header className="site-header"><div className="container nav">
        <a className="brand" href="#"><span className="logo-book"><span/></span><span><b>Re</b>Livro<span>Apps</span></span></a>
        <nav className="desktop-nav"><a href="#como-funciona">{t.nav.how}</a><a href="#livros">{t.nav.books}</a><a href="#comunidade">{t.nav.community}</a><a href="#ajuda">{t.nav.help}</a></nav>
        <div className="nav-actions"><LanguageSwitcher/><button className="menu-button">☰</button></div>
      </div></header>

      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">{t.hero.eyebrow}</span>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.description}</p>
          <div className="hero-benefits">{benefits.map((b) => <div key={b.title} className="hero-benefit"><span className={"benefit-icon " + b.icon}>{b.icon === "leaf" ? "◆" : b.icon === "people" ? "●" : "▣"}</span><b>{b.title}</b></div>)}</div>
          <a className="button hero-button" href="#livros">{t.hero.start} <span>→</span></a>
        </div>
        <div className="hero-phones" aria-label="Pré-visualização da aplicação">
          <div className="hero-student student-one"><span>✦</span></div><div className="hero-student student-two"><span>◈</span></div>
          <div className="phones-row">{phones.map((phone) => <PhoneMockup key={phone.type} {...phone}/>)}</div>
        </div>
      </section>

      <section id="livros" className="section container">
        <div className="section-heading"><span className="eyebrow">UMA EXPERIÊNCIA SIMPLES</span><h2>Encontre. Escolha. Partilhe.</h2></div>
        <div className="card-grid">{["Encontrar livros de todas as disciplinas e classes.","Comprar ou trocar de forma segura e ao melhor preço.","Conectar-se com estudantes da sua escola e região."].map((text, i) =>
          <motion.article key={text} className="feature-card" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{duration:.45,delay:i*.08}} whileHover={{y:-7,scale:1.015}} whileTap={{scale:.985}}>
            <span className="feature-number">0{i+1}</span><h3>{["Encontre","Compre ou troque","Conecte-se"][i]}</h3><p>{text}</p><span className="card-arrow">→</span>
          </motion.article>)}</div>
      </section>

      <section id="comunidade" className="community"><div className="container community-inner"><div><span className="eyebrow">UMA REDE LOCAL</span><h2>Uma segunda vida aos livros.</h2><p>Uma experiência pensada para estudantes, famílias e comunidades em Angola.</p></div><div className="community-stats"><div><strong>01</strong><span>Descubra</span></div><div><strong>02</strong><span>Escolha</span></div><div><strong>03</strong><span>Partilhe</span></div></div></div></section>
      <section id="ajuda" className="cta container"><span className="eyebrow">RELIVROAPPS</span><h2>O seu próximo livro pode estar mais perto do que imagina.</h2><a className="button" href="#livros">Explorar livros <span>→</span></a></section>
      <footer className="footer container"><div className="brand"><span className="logo-book"><span/></span><span><b>Re</b>Livro<span>Apps</span></span></div><span>© 2026 ReLivroApps</span></footer>
    </main>
  );
}
