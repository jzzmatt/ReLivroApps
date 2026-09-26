"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {conditions, grades, modes, subjects, type BookCondition, type ListingMode} from "@/lib/books";
import {gradeOptions, subjectOptions} from "@/lib/i18n-catalog";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {messages} from "@/lib/i18n";
import {useClientLocale} from "@/lib/use-client-locale";
import {createClient} from "@/lib/supabase/client";
import {listingSchema} from "@/lib/validation";

export default function SellPage() {
  const router = useRouter();
  const locale = useClientLocale();
  const t = messages[locale].sell;
  const catalog = marketplaceT(locale);
  const [userId, setUserId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<(typeof subjects)[number]>(subjects[0]);
  const [grade, setGrade] = useState<(typeof grades)[number]>(grades[3]);
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<BookCondition>("Bom estado");
  const [city, setCity] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<ListingMode>("Venda");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    createClient().auth.getUser().then(({data}) => {
      if (!data.user) router.replace("/auth");
      else setUserId(data.user.id);
    });
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError("");
    const parsed = listingSchema.safeParse({
      title,
      subject,
      grade,
      price_kz: price,
      condition,
      mode,
      city,
      municipality,
      description,
    });
    if (!parsed.success) {
      setError(t.validation);
      setLoading(false);
      return;
    }
    if (files.some((f) => !["image/jpeg", "image/png", "image/webp"].includes(f.type) || f.size > 5 * 1024 * 1024)) {
      setError(t.uploadError);
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const {data: book, error: bookError} = await supabase
      .from("books")
      .insert({
        seller_id: userId,
        title,
        subject,
        grade,
        price_kz: Number(price || 0),
        condition,
        mode,
        city,
        municipality,
        description,
        is_published: true,
      })
      .select("id")
      .single();
    if (bookError || !book) {
      setError(bookError?.message || t.validation);
      setLoading(false);
      return;
    }
    for (let i = 0; i < files.slice(0, 5).length; i++) {
      const file = files[i];
      const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
      const path = userId + "/" + book.id + "/" + Date.now() + "-" + i + "-" + safe;
      const upload = await supabase.storage.from("book-images").upload(path, file, {
        upsert: false,
        contentType: file.type,
      });
      if (upload.error) {
        setError(t.uploadError);
        break;
      }
      await supabase.from("book_images").insert({book_id: book.id, storage_path: path, sort_order: i});
    }
    setLoading(false);
    router.push("/books/" + book.id);
  }

  return (
    <AppShell>
      <section className="sell-page container">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p className="lead">{t.lead}</p>
        <form className="sell-form" onSubmit={submit}>
          <label className="upload-zone">
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))}
            />
            <span>＋</span>
            <strong>{files.length ? `${files.length} ${t.photosSelected}` : t.photos}</strong>
            <small>{t.photosHint}</small>
          </label>
          <label>
            {t.bookTitle}
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <div className="form-two">
            <label>
              {t.subject}
              <select value={subject} onChange={(e) => setSubject(e.target.value as typeof subject)}>
                {subjectOptions(locale).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t.grade}
              <select value={grade} onChange={(e) => setGrade(e.target.value as typeof grade)}>
                {gradeOptions(locale).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-two">
            <label>
              {t.price}
              <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <label>
              {t.condition}
              <select value={condition} onChange={(e) => setCondition(e.target.value as BookCondition)}>
                {conditions.map((x) => (
                  <option key={x} value={x}>
                    {catalog.conditions[x]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-two">
            <label>
              {t.city}
              <input value={city} onChange={(e) => setCity(e.target.value)} />
            </label>
            <label>
              {t.municipality}
              <input value={municipality} onChange={(e) => setMunicipality(e.target.value)} />
            </label>
          </div>
          <label>
            {t.description}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder={t.descriptionHint}
            />
          </label>
          <div className="listing-type">
            <strong>{t.availability}</strong>
            <div>
              {modes.map((x) => (
                <button type="button" className={mode === x ? "selected" : ""} key={x} onClick={() => setMode(x)}>
                  {catalog.modes[x]}
                </button>
              ))}
            </div>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="button submit-listing" disabled={loading}>
            {loading ? t.publishing : t.publishButton}
          </button>
        </form>
      </section>
    </AppShell>
  );
}
