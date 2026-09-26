"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";

export type ListingStatusLabels = {
  statusActive: string;
  statusReserved: string;
  statusSold: string;
  statusExchanged: string;
};

const defaultLabels: ListingStatusLabels = {
  statusActive: "Activo",
  statusReserved: "Reservado",
  statusSold: "Vendido",
  statusExchanged: "Trocado",
};

export function ListingStatusActions({
  id,
  status,
  labels = defaultLabels,
}: {
  id: string;
  status: string;
  labels?: ListingStatusLabels;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function change(next: string) {
    setBusy(true);
    const s = createClient();
    await s
      .from("books")
      .update({
        status: next,
        sold_at: ["sold", "exchanged"].includes(next) ? new Date().toISOString() : null,
        is_published: !["sold", "exchanged"].includes(next),
      })
      .eq("id", id);
    router.refresh();
    setBusy(false);
  }

  if (status === "sold" || status === "exchanged") {
    return (
      <span className="listing-status paused">
        {status === "sold" ? labels.statusSold : labels.statusExchanged}
      </span>
    );
  }

  return (
    <select className="status-select" value={status} disabled={busy} onChange={(e) => change(e.target.value)}>
      <option value="active">{labels.statusActive}</option>
      <option value="reserved">{labels.statusReserved}</option>
      <option value="sold">{labels.statusSold}</option>
      <option value="exchanged">{labels.statusExchanged}</option>
    </select>
  );
}
