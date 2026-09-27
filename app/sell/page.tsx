"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {trackEvent} from "@/components/AnalyticsTracker";
import {AppShell} from "@/components/AppShell";
import {conditions, grades, modes, paymentArrangements, subjects, type BookCondition, type ListingMode, type PaymentArrangement} from "@/lib/books";
import {gradeOptions, subjectOptions} from "@/lib/i18n-catalog";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {messages} from "@/lib/i18n";
import {useClientLocale} from "@/lib/use-client-locale";
import {createClient} from "@/lib/supabase/client";
import {listingSchema} from "@/lib/validation";
import {inspectionT} from "@/lib/i18n-inspection";
import {fillTemplate} from "@/lib/i18n-workspace";
import {
  INSPECTION_SLOT_ORDER,
  INSPECTION_SLOTS,
  inspectionFileError,
  type InspectionSlot,
} from "@/lib/inspection-photos";
import {listingMediaT} from "@/lib/i18n-listing-media";
import {paymentT} from "@/lib/i18n-payment";
import {videoFileError} from "@/lib/listing-video";

export default function SellPage() {
  const router = useRouter();
  const locale = useClientLocale();
  const t = messages[locale].sell;
  const guide = inspectionT(locale);
  const media = listingMediaT(locale);
  const pay = paymentT(locale);
  const catalog = marketplaceT(locale);
  const [userId, setUserId] = useState<string | null>(null);
  const [files, setFiles] = useState<Partial<Record<InspectionSlot, File>>>({});
  const [video, setVideo] = useState<File | null>(null);
  const [suggestion, setSuggestion] = useState<{condition: BookCondition; note: string} | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<(typeof subjects)[number]>(subjects[0]);
  const [grade, setGrade] = useState<(typeof grades)[number]>(grades[3]);
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<BookCondition>("Bom estado");
  const [city, setCity] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<ListingMode>("Venda");
  const [payment, setPayment] = useState<PaymentArrangement>("A combinar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    createClient().auth.getUser().then(({data}) => {
      if (!data.user) router.replace("/auth");
      else setUserId(data.user.id);
    });
  }, [router]);

  function selectedPhotos(): File[] | null {
    const selected = INSPECTION_SLOTS.map((slot) => files[slot]).filter((file): file is File => Boolean(file));
    if (selected.length !== INSPECTION_SLOTS.length) {
      setError(guide.missing);
      return null;
    }
    for (const file of selected) {
      const problem = inspectionFileError(file);
      if (problem === "type") {
        setError(guide.fileType);
        return null;
      }
      if (problem === "size") {
        setError(guide.fileSize);
        return null;
      }
    }
    return selected;
  }

  async function analyzePhotos() {
    if (!userId || analyzing || loading) return;
    setError("");
    if (!selectedPhotos()) return;
    setAnalyzing(true);
    const form = new FormData();
    for (const slot of INSPECTION_SLOTS) {
      const file = files[slot];
      if (file) form.append(slot, file);
    }
    const response = await fetch("/api/listings/analyze-condition", {method: "POST", body: form});
    setAnalyzing(false);
    if (response.status === 401) {
      router.replace("/auth");
      return;
    }
    if (response.status === 503) {
      setError(media.unavailable);
      return;
    }
    if (response.status === 400) {
      const body = (await response.json().catch(() => null)) as {error?: string} | null;
      setError(body?.error === "size" ? guide.fileSize : guide.fileType);
      return;
    }
    if (!response.ok) {
      setError(media.analyzeFailed);
      return;
    }
    const body = (await response.json()) as {condition?: BookCondition; note?: string};
    if (!body.condition || !conditions.includes(body.condition)) {
      setError(media.analyzeFailed);
      return;
    }
    setSuggestion({condition: body.condition, note: body.note || ""});
  }

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
    if (!selectedPhotos()) {
      setLoading(false);
      return;
    }
    if (video) {
      const problem = videoFileError(video);
      if (problem === "type") {
        setError(media.videoType);
        setLoading(false);
        return;
      }
      if (problem === "size") {
        setError(media.videoSize);
        setLoading(false);
        return;
      }
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
        payment_arrangement: payment,
        ...(suggestion
          ? {
              ai_suggested_condition: suggestion.condition,
              ai_analyzed_at: new Date().toISOString(),
            }
          : {}),
      })
      .select("id")
      .single();
    if (bookError || !book) {
      setError(bookError?.message || t.validation);
      setLoading(false);
      return;
    }
    let uploadFailed = false;
    for (const slot of INSPECTION_SLOTS) {
      const file = files[slot];
      if (!file) {
        uploadFailed = true;
        break;
      }
      const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
      const path = userId + "/" + book.id + "/" + slot + "-" + Date.now() + "-" + safe;
      const upload = await supabase.storage.from("book-images").upload(path, file, {
        upsert: false,
        contentType: file.type,
      });
      if (upload.error) {
        uploadFailed = true;
        break;
      }
      const {error: imageError} = await supabase.from("book_images").insert({
        book_id: book.id,
        storage_path: path,
        sort_order: INSPECTION_SLOT_ORDER[slot],
        slot,
      });
      if (imageError) {
        uploadFailed = true;
        break;
      }
    }
    if (uploadFailed) {
      await supabase.from("books").delete().eq("id", book.id);
      setError(guide.uploadFailed);
      setLoading(false);
      return;
    }
    if (video) {
      const safe = video.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
      const path = userId + "/" + book.id + "/video-" + Date.now() + "-" + safe;
      const upload = await supabase.storage.from("book-images").upload(path, video, {
        upsert: false,
        contentType: video.type,
      });
      if (upload.error) {
        await supabase.from("books").delete().eq("id", book.id);
        setError(media.videoFailed);
        setLoading(false);
        return;
      }
      const {error: videoError} = await supabase.from("books").update({video_path: path}).eq("id", book.id);
      if (videoError) {
        await supabase.from("books").delete().eq("id", book.id);
        setError(media.videoFailed);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    void trackEvent("listing_published", {book_id: book.id});
    router.push("/books/" + book.id);
  }

  return (
    <AppShell>
      <section className="sell-page container">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p className="lead">{t.lead}</p>
        <section className="publish-guide" aria-labelledby="publish-guide-title">
          <span className="eyebrow">{guide.guideEyebrow}</span>
          <h2 id="publish-guide-title">{guide.guideTitle}</h2>
          <ol>
            {guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        <form className="sell-form" onSubmit={submit}>
          <fieldset className="inspection-slots">
            <legend>{guide.slotsTitle}</legend>
            <p>{guide.slotsHint}</p>
            <div className="inspection-slot-grid">
              {INSPECTION_SLOTS.map((slot) => (
                <label key={slot} className="inspection-slot">
                  <span>{guide.slots[slot]}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFiles((current) => {
                        const next = {...current};
                        if (file) next[slot] = file;
                        else delete next[slot];
                        return next;
                      });
                    }}
                  />
                  <small>{files[slot]?.name || "—"}</small>
                </label>
              ))}
            </div>
            <p className="inspection-progress">
              {fillTemplate(guide.photoProgress, {
                count: INSPECTION_SLOTS.filter((slot) => files[slot]).length,
              })}
            </p>
          </fieldset>
          <label className="listing-video-field">
            {media.videoLabel}
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
            />
            <small>{video?.name || media.videoHint}</small>
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
          <div className="listing-video-field">
            <button type="button" className="secondary-button" disabled={analyzing || loading} onClick={analyzePhotos}>
              {analyzing ? media.analyzing : media.analyze}
            </button>
            {suggestion ? (
              <div className="ai-suggestion">
                <p>
                  {media.suggestionLead} <strong>{catalog.conditions[suggestion.condition]}</strong>
                </p>
                {suggestion.note ? <p>{suggestion.note}</p> : null}
                <button type="button" className="secondary-button" onClick={() => setCondition(suggestion.condition)}>
                  {media.applySuggestion}
                </button>
              </div>
            ) : null}
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
          <label>
            {pay.label}
            <select value={payment} onChange={(e) => setPayment(e.target.value as PaymentArrangement)}>
              {paymentArrangements.map((item) => (
                <option key={item} value={item}>
                  {pay.arrangements[item]}
                </option>
              ))}
            </select>
            <small className="payment-hint">{pay.hint}</small>
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="button submit-listing" disabled={loading}>
            {loading ? t.publishing : t.publishButton}
          </button>
        </form>
      </section>
    </AppShell>
  );
}
