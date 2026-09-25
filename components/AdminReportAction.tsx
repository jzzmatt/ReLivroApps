"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import type {AdminActionLabels} from "@/lib/i18n-admin";
import {createClient} from "@/lib/supabase/client";

export function AdminReportAction({id, labels}: {id: string; labels: AdminActionLabels}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function resolve() {
    setBusy(true);
    const note = window.prompt(labels.reportNotePrompt);
    const s = createClient();
    const {error} = await s.rpc("admin_resolve_report", {
      p_report_id: id,
      p_status: "resolved",
      p_note: note || null,
    });
    if (error) alert(error.message);
    else router.refresh();
    setBusy(false);
  }

  return (
    <button className="admin-action-button" disabled={busy} onClick={resolve}>
      {busy ? labels.busy : labels.resolve}
    </button>
  );
}
