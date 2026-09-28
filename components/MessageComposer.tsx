"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {authLoginUrl} from "@/lib/auth-redirect";
import {conversationT} from "@/lib/i18n-conversation";
import {createClient} from "@/lib/supabase/client";
import {useClientLocale} from "@/lib/use-client-locale";

export function MessageComposer({conversationId}: {conversationId: string}) {
  const locale = useClientLocale();
  const t = conversationT(locale);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    const s = createClient();
    const {
      data: {user},
    } = await s.auth.getUser();
    if (!user) {
      router.push(authLoginUrl(window.location.pathname));
      return;
    }
    const {error} = await s.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: text,
    });
    if (!error) {
      setBody("");
      void fetch("/api/push/fanout", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({conversationId}),
        keepalive: true,
      });
      router.refresh();
    } else alert(error.message);
    setSending(false);
  }

  return (
    <form className="message-composer" onSubmit={send}>
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={2}
        maxLength={2000}
        placeholder={t.composerPlaceholder}
      />
      <button className="button" disabled={sending || !body.trim()}>
        {sending ? t.sending : t.send}
      </button>
    </form>
  );
}
