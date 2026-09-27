"use client";

import {useState} from "react";
import {conversationT} from "@/lib/i18n-conversation";
import type {Locale} from "@/lib/i18n";
import type {ThreadMessage} from "@/lib/message-thread-query";
import {localeTag} from "@/lib/locale-format";

export function MessageThreadClient({
  conversationId,
  messages: initialMessages,
  hasOlder: initialHasOlder,
  pageSize,
  userId,
  locale,
}: {
  conversationId: string;
  messages: ThreadMessage[];
  hasOlder: boolean;
  pageSize: number;
  userId: string;
  locale: Locale;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [hasOlder, setHasOlder] = useState(initialHasOlder);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const t = conversationT(locale);
  const numberLocale = localeTag(locale);

  async function loadOlder() {
    if (loadingOlder || !hasOlder || messages.length === 0) return;
    const oldest = messages[0]?.created_at;
    if (!oldest) return;
    setLoadingOlder(true);
    try {
      const res = await fetch(
        `/api/messages/${conversationId}/messages?before=${encodeURIComponent(oldest)}&limit=${pageSize}`,
      );
      const json = (await res.json()) as {
        messages?: ThreadMessage[];
        hasOlder?: boolean;
      };
      if (!res.ok || !json.messages?.length) {
        setHasOlder(false);
        return;
      }
      setHasOlder(json.hasOlder ?? false);
      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        const older = (json.messages || []).filter((m) => !seen.has(m.id));
        return [...older, ...prev];
      });
    } finally {
      setLoadingOlder(false);
    }
  }

  return (
    <div className="message-thread">
      {hasOlder ? (
        <div className="message-thread-load-older">
          <button type="button" className="secondary-button button-small" disabled={loadingOlder} onClick={() => void loadOlder()}>
            {loadingOlder ? t.loadingEarlier : t.loadEarlier}
          </button>
        </div>
      ) : null}
      {messages.length ? (
        messages.map((m) => (
          <div className={"message-bubble " + (m.sender_id === userId ? "mine" : "theirs")} key={m.id}>
            {m.body}
            <small>
              {new Date(m.created_at).toLocaleString(numberLocale, {
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
        ))
      ) : (
        <div className="thread-empty">{t.threadEmpty}</div>
      )}
    </div>
  );
}
