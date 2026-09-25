"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import type {AdminActionLabels} from "@/lib/i18n-admin";
import {createClient} from "@/lib/supabase/client";

export function AdminListingAction({
  id,
  published,
  labels,
}: {
  id: string;
  published: boolean;
  labels: AdminActionLabels;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function change(next: boolean) {
    setBusy(true);
    const s = createClient();
    const reason = window.prompt(next ? labels.publishPrompt : labels.suspendPrompt);
    const {error} = await s.rpc("admin_moderate_book", {
      p_book_id: id,
      p_published: next,
      p_reason: reason || null,
    });
    if (error) alert(error.message);
    else router.refresh();
    setBusy(false);
  }

  return (
    <button className="admin-action-button" disabled={busy} onClick={() => change(!published)}>
      {busy ? labels.busy : published ? labels.suspend : labels.publish}
    </button>
  );
}
