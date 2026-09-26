"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {StarRating} from "@/components/StarRating";
import type {Locale} from "@/lib/i18n";
import {reviewsT} from "@/lib/i18n-reviews";
import {createClient} from "@/lib/supabase/client";
import {reviewSchema} from "@/lib/validation";

type Props = {
  locale: Locale;
  sellerId: string;
  bookId: string;
  loggedIn: boolean;
  ownListing: boolean;
  initialRating?: number;
  initialComment?: string;
};

export function SellerReviewForm({
  locale,
  sellerId,
  bookId,
  loggedIn,
  ownListing,
  initialRating = 0,
  initialComment = "",
}: Props) {
  const t = reviewsT(locale);
  const router = useRouter();
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (ownListing) {
    return <p className="review-hint">{t.ownListing}</p>;
  }
  if (!loggedIn) {
    return (
      <p className="review-hint">
        {t.loginPrompt}{" "}
        <Link href="/auth">→</Link>
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    const parsed = reviewSchema.safeParse({rating, comment});
    if (!parsed.success) {
      setError(t.validation);
      return;
    }
    setSaving(true);
    const s = createClient();
    const {
      data: {user},
    } = await s.auth.getUser();
    if (!user) {
      router.push("/auth");
      return;
    }
    const payload = {
      seller_id: sellerId,
      reviewer_id: user.id,
      book_id: bookId,
      rating: parsed.data.rating,
      comment: parsed.data.comment?.trim() || null,
    };
    const {error: upsertError} = await s.from("seller_reviews").upsert(payload, {
      onConflict: "seller_id,reviewer_id,book_id",
    });
    setSaving(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    setMessage(t.thanks);
    router.refresh();
  }

  const hasExisting = initialRating > 0;

  return (
    <form className="review-form" onSubmit={submit}>
      <h3>{t.formTitle}</h3>
      <p className="review-hint">{t.formHint}</p>
      <label>
        {t.ratingLabel}
        <StarRating value={rating} onChange={setRating} label={t.ratingLabel}/>
      </label>
      <label>
        {t.commentLabel}
        <textarea
          rows={3}
          maxLength={500}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder={t.commentPlaceholder}
        />
      </label>
      {error && <div className="form-error">{error}</div>}
      {message && <div className="auth-message">{message}</div>}
      <button className="button" type="submit" disabled={saving || rating < 1}>
        {saving ? t.sending : hasExisting ? t.update : t.submit}
      </button>
    </form>
  );
}
