import webpush from "web-push";

export type PushSubscriptionRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export function vapidPublicKey(): string | null {
  const key = process.env.VAPID_PUBLIC_KEY?.trim();
  const secret = process.env.VAPID_PRIVATE_KEY?.trim();
  if (!key || !secret) return null;
  return key;
}

function vapidSubject(): string {
  const raw = process.env.VAPID_SUBJECT?.trim() || process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "";
  if (raw.startsWith("mailto:") || raw.startsWith("https://")) return raw;
  if (raw.includes("@")) return `mailto:${raw}`;
  return "mailto:support@relivro.app";
}

export async function sendWebPush(
  subscription: PushSubscriptionRow,
  payload: {title: string; body: string; url: string},
): Promise<"sent" | "gone" | "failed" | "unconfigured"> {
  const publicKey = process.env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  if (!publicKey || !privateKey) return "unconfigured";
  webpush.setVapidDetails(vapidSubject(), publicKey, privateKey);
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {p256dh: subscription.p256dh, auth: subscription.auth},
      },
      JSON.stringify(payload),
    );
    return "sent";
  } catch (error) {
    const status = (error as {statusCode?: number}).statusCode;
    if (status === 404 || status === 410) return "gone";
    return "failed";
  }
}
