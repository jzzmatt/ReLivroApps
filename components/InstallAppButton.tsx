"use client";

import {useEffect, useState} from "react";
import {shellT} from "@/lib/i18n-shell";
import {useClientLocale} from "@/lib/use-client-locale";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome: "accepted" | "dismissed"}>;
};

export function InstallAppButton() {
  const t = shellT(useClientLocale());
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);

  useEffect(() => {
    function onPrompt(event: Event) {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!prompt) return null;

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setPrompt(null);
  }

  return (
    <div className="install-app-note">
      <p>{t.installBody}</p>
      <div>
        <button type="button" className="button button-small" onClick={() => void install()}>
          {t.installAction}
        </button>
        <button type="button" className="secondary-button button-small" onClick={() => setPrompt(null)}>
          {t.installDismiss}
        </button>
      </div>
    </div>
  );
}
