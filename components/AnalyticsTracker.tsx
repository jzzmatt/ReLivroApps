"use client";

import {useEffect} from "react";
import {createClient} from "@/lib/supabase/client";
import {isSupabaseConfigured} from "@/lib/supabase/public-env";

function getSessionId() {
  const key = "relivro-session-id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function AnalyticsTracker() {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const s = createClient();
    const path = window.location.pathname;
    s.rpc("record_analytics_event", {
      p_event_name: "page_view",
      p_path: path,
      p_session_id: getSessionId(),
      p_metadata: {referrer: document.referrer || null},
    }).then(() => {});
  }, []);
  return null;
}

export async function trackEvent(
  eventName: string,
  metadata: Record<string, unknown> = {},
  path?: string
) {
  if (typeof window === "undefined") return;
  if (!isSupabaseConfigured()) return;
  const s = createClient();
  await s.rpc("record_analytics_event", {
    p_event_name: eventName,
    p_path: path || window.location.pathname,
    p_session_id: getSessionId(),
    p_metadata: metadata,
  });
}
