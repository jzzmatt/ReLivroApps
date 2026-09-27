"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {notificationTargetPath} from "@/lib/notification-routes";

export type NotificationItem = {
  id: string;
  title: string;
  body: string | null;
  conversation_id: string | null;
  book_id: string | null;
  is_read: boolean;
  created_at: string;
};

export function NotificationList({
  items,
  dateLocale,
}: {
  items: NotificationItem[];
  dateLocale: string;
}) {
  const router = useRouter();

  async function openNotification(id: string, href: string) {
    const supabase = createClient();
    await supabase.from("notifications").update({is_read: true}).eq("id", id);
    router.push(href);
  }

  return (
    <div className="notification-list">
      {items.map((n) => {
        const href = notificationTargetPath(n);
        return (
          <Link
            className={"notification-row " + (!n.is_read ? "unread" : "")}
            href={href}
            key={n.id}
            onClick={(e) => {
              e.preventDefault();
              void openNotification(n.id, href);
            }}
          >
            <div>
              <strong>{n.title}</strong>
              {n.body ? <p>{n.body}</p> : null}
            </div>
            <small>{new Date(n.created_at).toLocaleDateString(dateLocale)}</small>
          </Link>
        );
      })}
    </div>
  );
}
