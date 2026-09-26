"use client";

import {useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {reportSchema} from "@/lib/validation";

const defaultLabels = {
  prompt: "Por que pretende denunciar este anúncio?",
  validation: "A denúncia deve ter entre 3 e 120 caracteres.",
  thanks: "Obrigado. O anúncio foi enviado para análise.",
  button: "Denunciar anúncio",
  busy: "A enviar...",
};

export function ReportListingButton({
  bookId,
  labels = defaultLabels,
}: {
  bookId: string;
  labels?: typeof defaultLabels;
}) {
  const [busy, setBusy] = useState(false);

  async function report() {
    const reason = window.prompt(labels.prompt);
    if (!reason) return;
    const parsed = reportSchema.safeParse({reason});
    if (!parsed.success) {
      alert(labels.validation);
      return;
    }
    setBusy(true);
    const s = createClient();
    const {
      data: {user},
    } = await s.auth.getUser();
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    const {error} = await s.from("listing_reports").insert({
      book_id: bookId,
      reporter_id: user.id,
      reason,
    });
    if (error) alert(error.message);
    else alert(labels.thanks);
    setBusy(false);
  }

  return (
    <button className="report-button" onClick={report} disabled={busy}>
      {busy ? labels.busy : `⚑ ${labels.button}`}
    </button>
  );
}
