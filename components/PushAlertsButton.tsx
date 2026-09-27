"use client";

import {useEffect, useState} from "react";
import {pushReadinessT} from "@/lib/i18n-push-readiness";
import type {Locale} from "@/lib/i18n";

type Status = "idle" | "enabled" | "denied" | "unsupported" | "unconfigured" | "failed" | "busy";

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export function PushAlertsButton({locale}: {locale: Locale}) {
  const t = pushReadinessT(locale);
  const [status, setStatus] = useState<Status>("idle");
  const [endpoint, setEndpoint] = useState<string | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") setStatus("denied");
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => {
        if (subscription) {
          setEndpoint(subscription.endpoint);
          setStatus("enabled");
        }
      })
      .catch(() => undefined);
  }, []);

  async function enable() {
    if (status === "busy") return;
    setStatus("busy");
    try {
      const config = await fetch("/api/push/config");
      if (config.status === 503) {
        setStatus("unconfigured");
        return;
      }
      if (!config.ok) {
        setStatus("failed");
        return;
      }
      const {publicKey} = (await config.json()) as {publicKey?: string};
      if (!publicKey) {
        setStatus("unconfigured");
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "failed");
        return;
      }
      await navigator.serviceWorker.register("/sw.js");
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const json = subscription.toJSON();
      const saved = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(json),
      });
      if (!saved.ok) {
        setStatus("failed");
        return;
      }
      setEndpoint(subscription.endpoint);
      setStatus("enabled");
    } catch {
      setStatus("failed");
    }
  }

  async function disable() {
    if (!endpoint || status === "busy") return;
    setStatus("busy");
    const registration = await navigator.serviceWorker.getRegistration("/sw.js");
    const subscription = await registration?.pushManager.getSubscription();
    await subscription?.unsubscribe();
    await fetch("/api/push/subscribe", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({endpoint}),
    });
    setEndpoint(null);
    setStatus("idle");
  }

  const note =
    status === "enabled"
      ? t.enabled
      : status === "denied"
        ? t.denied
        : status === "unsupported"
          ? t.unsupported
          : status === "unconfigured"
            ? t.unconfigured
            : status === "failed"
              ? t.failed
              : t.body;

  return (
    <aside className="push-readiness-note" aria-label={t.title}>
      <strong>{t.title}</strong>
      <p>{note}</p>
      {status === "enabled" ? (
        <button type="button" className="secondary-button button-small" onClick={() => void disable()}>
          {t.disable}
        </button>
      ) : status === "unsupported" || status === "denied" || status === "unconfigured" ? null : (
        <button type="button" className="secondary-button button-small" disabled={status === "busy"} onClick={() => void enable()}>
          {status === "busy" ? t.busy : t.enable}
        </button>
      )}
    </aside>
  );
}
