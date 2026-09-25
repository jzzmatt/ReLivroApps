"use client";

import {Suspense, useState, useEffect} from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {messages, type Locale} from "@/lib/i18n";
import {LanguageSwitcher} from "@/components/LanguageSwitcher";

function authCallbackUrl(): string {
  if (typeof window === "undefined") return "/auth/callback";
  return `${window.location.origin}/auth/callback`;
}

function AuthPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [locale, setLocale] = useState<Locale>("pt");
  const t = messages[locale];
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const saved = localStorage.getItem("relivro-locale") as Locale | null;
    if (saved && ["pt", "fr", "en"].includes(saved)) setLocale(saved);
    const oauthError = searchParams.get("error");
    if (oauthError) setMessage(decodeURIComponent(oauthError));
  }, [searchParams]);

  async function signInWithGoogle() {
    setGoogleLoading(true);
    setMessage("");
    const supabase = createClient();
    const {error} = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: authCallbackUrl(),
        queryParams: {prompt: "select_account"},
      },
    });
    setGoogleLoading(false);
    if (error) setMessage(error.message);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({email, password})
        : await supabase.auth.signUp({
            email,
            password,
            options: {data: {display_name: name}},
          });
    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    setMessage(mode === "signup" ? t.auth.created : t.auth.logged);
    if (mode === "signin") router.push("/books");
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-language">
          <LanguageSwitcher/>
        </div>
        <Link className="brand" href="/">
          <span className="logo-book"><span/></span>
          <span><b>Re</b>Livro<span>Apps</span></span>
        </Link>
        <span className="eyebrow">{mode === "signin" ? t.auth.welcome : t.auth.signupEyebrow}</span>
        <h1>{mode === "signin" ? t.auth.signinTitle : t.auth.signupTitle}</h1>
        <p>{mode === "signin" ? t.auth.signinText : t.auth.signupText}</p>

        <button
          type="button"
          className="auth-google-button"
          disabled={googleLoading || loading}
          onClick={() => void signInWithGoogle()}
        >
          {googleLoading ? t.auth.wait : t.auth.google}
        </button>
        <p className="auth-divider" role="presentation">{t.auth.orEmail}</p>

        <form onSubmit={submit}>
          {mode === "signup" && (
            <label>
              {t.auth.name}
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="O seu nome"/>
            </label>
          )}
          <label>
            {t.auth.email}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nome@email.com"/>
          </label>
          <label>
            {t.auth.password}
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="••••••••"/>
          </label>
          <button className="button" disabled={loading || googleLoading}>
            {loading ? t.auth.wait : mode === "signin" ? t.auth.signin : t.auth.signup}
          </button>
        </form>
        {message && <div className="auth-message">{message}</div>}
        <button
          className="auth-switch"
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setMessage("");
          }}
        >
          {mode === "signin" ? t.auth.noAccount : t.auth.hasAccount}
        </button>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<main className="auth-page"><div className="auth-card"><p>A carregar...</p></div></main>}>
      <AuthPageContent/>
    </Suspense>
  );
}
