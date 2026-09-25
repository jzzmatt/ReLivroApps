"use client";

import Link from "next/link";
import {motion} from "motion/react";
import {useEffect, useState} from "react";
import {HeroBannerArtwork} from "@/components/HeroBannerArtwork";
import {LandingJsonLd} from "@/components/LandingJsonLd";
import {LanguageSwitcher} from "@/components/LanguageSwitcher";
import {landingT} from "@/lib/i18n-landing";
import {shareT} from "@/lib/i18n-share";
import {messages, type Locale} from "@/lib/i18n";

const benefitIcons = [
  {key: "leaf" as const, icon: "leaf" as const, glyph: "◆"},
  {key: "people" as const, icon: "people" as const, glyph: "●"},
  {key: "book" as const, icon: "book" as const, glyph: "▣"},
];

const phones = [
  {title: "Livros que ligam estudantes", type: "home"},
  {title: "Matemática 10ª Classe", type: "detail"},
  {title: "32 resultados", type: "search"},
  {title: "Publicar livro", type: "publish"},
  {title: "João Silva", type: "profile"},
];

function PhoneMockup({title, type}: {title: string; type: string}) {
  return (
    <motion.div
      className={"phone phone-" + type}
      initial={{opacity: 0, y: 28}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.55, delay: phones.findIndex((p) => p.type === type) * 0.08}}
      whileHover={{y: -10, scale: 1.025}}
    >
      <div className="phone-top">
        <span>9:41</span>
        <span>●</span>
      </div>
      <div className="phone-appbar">
        <span>‹</span>
        <strong>ReLivroApps</strong>
        <span>♡</span>
      </div>
      <div className="phone-screen">
        {type === "home" && (
          <>
            <div className="phone-search">⌕ Pesquisar livros, disciplinas...</div>
            <div className="phone-banner">
              Livros que ligam
              <br />
              estudantes
            </div>
            <div className="phone-chips">
              <i>Matemática</i>
              <i>Português</i>
              <i>Ciências</i>
            </div>
            <div className="phone-list-card">
              <b>Matemática 10ª Classe</b>
              <small>Usado · Bom estado</small>
              <strong>8 000 Kz</strong>
            </div>
          </>
        )}
        {type === "detail" && (
          <>
            <div className="book-cover">
              Matemática<small>10ª Classe</small>
            </div>
            <h4>{title}</h4>
            <small>Estado · Bom estado</small>
            <small>Disciplina · Matemática</small>
            <small>Localização · Lobito, Angola</small>
            <button type="button">Contactar vendedor</button>
          </>
        )}
        {type === "search" && (
          <>
            <div className="phone-search">⌕ Matemática 10ª classe</div>
            <div className="filter-row">
              <b>Todos</b>
              <span>Venda</span>
              <span>Troca</span>
            </div>
            {[8, 6, 12].map((price) => (
              <div className="result-row" key={price}>
                <div className="tiny-cover">M</div>
                <div>
                  <b>Matemática 10ª Classe</b>
                  <small>Bom estado</small>
                  <strong>{price} 000 Kz</strong>
                </div>
              </div>
            ))}
          </>
        )}
        {type === "publish" && (
          <>
            <h4>Publicar livro</h4>
            <div className="step-row">
              <b>1</b>
              <span>Informações</span>
              <span>2 Fotos</span>
              <span>3 Revisão</span>
            </div>
            {["Título do livro", "Disciplina", "Classe", "Localização", "Preço (Kz)"].map((x) => (
              <div className="input-line" key={x}>
                {x}
              </div>
            ))}
            <button>Continuar</button>
          </>
        )}
        {type === "profile" && (
          <>
            <div className="profile-head">
              <div className="avatar">JS</div>
              <div>
                <b>{title}</b>
                <small>Estudante</small>
              </div>
            </div>
            {["Os meus anúncios", "Os meus favoritos", "Mensagens", "Compras", "Trocas", "Definições"].map(
              (x) => (
                <div className="menu-row" key={x}>
                  {x}
                  <span>›</span>
                </div>
              ),
            )}
            <div className="eco-note">
              Contribua
              <br />
              <small>Uma segunda vida aos livros.</small>
            </div>
          </>
        )}
      </div>
      <div className="phone-nav">
        <span>⌂</span>
        <span>⌕</span>
        <b>＋</b>
        <span>♧</span>
        <span>♙</span>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("pt");
  const t = messages[locale];
  const land = landingT(locale);
  const share = shareT(locale);
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();

  useEffect(() => {
    const saved = localStorage.getItem("relivro-locale") as Locale | null;
    if (saved && ["pt", "fr", "en"].includes(saved)) setLocale(saved);
    const fn = (e: Event) => setLocale((e as CustomEvent<Locale>).detail);
    window.addEventListener("relivro-locale", fn);
    return () => window.removeEventListener("relivro-locale", fn);
  }, []);

  return (
    <main>
      <LandingJsonLd />
      <header className="site-header">
        <div className="container nav">
          <a className="brand" href="#">
            <span className="logo-book">
              <span />
            </span>
            <span>
              <b>Re</b>Livro<span>Apps</span>
            </span>
          </a>
          <nav className="desktop-nav">
            <a href="#como-funciona">{t.nav.how}</a>
            <a href="#livros">{t.nav.books}</a>
            <a href="#comunidade">{t.nav.community}</a>
            <a href="/ajuda">{t.nav.help}</a>
          </nav>
          <div className="nav-actions">
            <LanguageSwitcher />
            <button className="menu-button" type="button" aria-label="Abrir menu" aria-expanded="false">
              ☰
            </button>
          </div>
        </div>
      </header>

      <section className="hero-shell">
        <HeroBannerArtwork />
        <div className="container hero">
          <div className="hero-copy">
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <h1>{t.hero.title}</h1>
            <p>{t.hero.description}</p>
            <div className="hero-benefits">
              {benefitIcons.map((b) => (
                <div key={b.key} className="hero-benefit">
                  <span className={"benefit-icon " + b.icon}>{b.glyph}</span>
                  <b>{t.hero.benefits[b.key]}</b>
                </div>
              ))}
            </div>
            <a className="button hero-button" href="#livros">
              {t.hero.start} <span>→</span>
            </a>
          </div>
          <div className="hero-phones" role="img" aria-label={land.phonesAria}>
            <div className="hero-student student-one">
              <span>✦</span>
            </div>
            <div className="hero-student student-two">
              <span>◈</span>
            </div>
            <div className="phones-row">
              {phones.map((phone) => (
                <PhoneMockup key={phone.type} {...phone} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="section container">
        <div className="section-heading">
          <span className="eyebrow">{land.features.eyebrow}</span>
          <h2>{land.features.title}</h2>
        </div>
        <div className="card-grid">
          {land.features.cards.map((card, i) => (
            <motion.article
              key={card.title}
              className="feature-card"
              initial={{opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.25}}
              transition={{duration: 0.45, delay: i * 0.08}}
              whileHover={{y: -7, scale: 1.015}}
              whileTap={{scale: 0.985}}
            >
              <span className="feature-number">0{i + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <span className="card-arrow">→</span>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="livros" className="section container">
        <div className="section-heading">
          <span className="eyebrow">{t.market.eyebrow}</span>
          <h2>{t.market.title}</h2>
          <p>{t.market.description}</p>
        </div>
        <Link className="button" href="/books">
          {t.market.explore} <span>→</span>
        </Link>
      </section>

      <section id="comunidade" className="community">
        <div className="container community-inner">
          <div>
            <span className="eyebrow">{land.community.eyebrow}</span>
            <h2>{land.community.title}</h2>
            <p>{land.community.body}</p>
          </div>
          <div className="community-stats">
            {land.community.stats.map((label, i) => (
              <div key={label}>
                <strong>{String(i + 1).padStart(2, "0")}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta container">
        <span className="eyebrow">{land.cta.eyebrow}</span>
        <h2>{land.cta.title}</h2>
        <Link className="button" href="/books">
          {land.cta.button} <span>→</span>
        </Link>
      </section>

      <footer className="footer container">
        <div className="brand">
          <span className="logo-book">
            <span />
          </span>
          <span>
            <b>Re</b>Livro<span>Apps</span>
          </span>
        </div>
        <div className="footer-links">
          <a href="/ajuda">{t.nav.help}</a>
          {supportEmail && supportEmail.includes("@") && (
            <a href={`mailto:${supportEmail}`}>{share.emailSupport}</a>
          )}
          <a href="/privacidade">{t.legal.privacy}</a>
          <a href="/termos">{t.legal.terms}</a>
        </div>
        <span>© 2026 ReLivroApps</span>
      </footer>
    </main>
  );
}
