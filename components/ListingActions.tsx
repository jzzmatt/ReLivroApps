"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {createClient} from "@/lib/supabase/client";
import type {ListingActionLabels} from "@/lib/i18n-listings-manage";

const defaultLabels: ListingActionLabels = {
  edit: "Editar",
  pause: "Pausar",
  publish: "Publicar",
  delete: "Eliminar",
  deleteConfirm: "Eliminar este anúncio? Esta acção não pode ser anulada.",
};

export function ListingActions({
  id,
  published,
  labels = defaultLabels,
}: {
  id: string;
  published: boolean;
  labels?: ListingActionLabels;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function toggle() {
    setBusy(true);
    const s = createClient();
    await s.from("books").update({is_published: !published}).eq("id", id);
    router.refresh();
    setBusy(false);
  }

  async function remove() {
    if (!confirm(labels.deleteConfirm)) return;
    setBusy(true);
    const s = createClient();
    const {data: images} = await s.from("book_images").select("storage_path").eq("book_id", id);
    if (images?.length) await s.storage.from("book-images").remove(images.map((x) => x.storage_path));
    await s.from("books").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="listing-actions">
      <Link href={"/books/" + id + "/edit"}>{labels.edit}</Link>
      <button onClick={toggle} disabled={busy}>
        {published ? labels.pause : labels.publish}
      </button>
      <button className="danger" onClick={remove} disabled={busy}>
        {labels.delete}
      </button>
    </div>
  );
}
