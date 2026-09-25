"use client";

import {useEffect} from "react";
import {createClient} from "@/lib/supabase/client";
import {isSupabaseConfigured} from "@/lib/supabase/public-env";

export function BookViewTracker({bookId}: {bookId: string}) {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const s = createClient();
    s.rpc("record_book_view", {p_book_id: bookId});
  }, [bookId]);
  return null;
}
