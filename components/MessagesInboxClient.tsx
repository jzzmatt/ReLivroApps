"use client";

import Link from "next/link";
import {useState} from "react";
import {conversationT} from "@/lib/i18n-conversation";
import type {Locale} from "@/lib/i18n";
import {formatMarketplaceCatalogSize, type MarketplaceLabels} from "@/lib/i18n-marketplace";
import type {InboxConversationView} from "@/lib/inbox-view-model";
import {localeTag} from "@/lib/locale-format";

export function MessagesInboxClient({
  items: initialItems,
  totalConversations,
  pageSize,
  locale,
  loadMoreLabels,
}: {
  items: InboxConversationView[];
  totalConversations: number;
  pageSize: number;
  locale: Locale;
  loadMoreLabels: MarketplaceLabels;
}) {
  const [items, setItems] = useState(initialItems);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const hasMore = page * pageSize < totalConversations;
  const conv = conversationT(locale);
  const numberLocale = localeTag(locale);

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/messages/conversations?page=${nextPage}&limit=${pageSize}`);
      const json = (await res.json()) as {items?: InboxConversationView[]};
      if (!res.ok || !json.items) return;
      setPage(nextPage);
      setItems((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        const merged = [...prev];
        for (const item of json.items || []) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            merged.push(item);
          }
        }
        return merged;
      });
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <>
      {totalConversations > pageSize ? (
        <p className="messages-inbox-count">
          {formatMarketplaceCatalogSize(locale, Math.min(page * pageSize, totalConversations), totalConversations)}
        </p>
      ) : null}
      <div className="conversation-list">
        {items.map((c) => (
          <Link
            href={"/messages/" + c.id}
            className={"conversation-row" + (c.hasUnread ? " unread" : "")}
            key={c.id}
          >
            <div className="conversation-icon">💬</div>
            <div className="conversation-row-main">
              <div className="conversation-row-top">
                <strong>{c.bookTitle}</strong>
                {c.whenIso && (
                  <small className="conversation-time">
                    {new Date(c.whenIso).toLocaleDateString(numberLocale)}
                  </small>
                )}
              </div>
              <p className="conversation-participant-name">{c.otherName}</p>
              <p className="conversation-preview">{c.preview}</p>
              <p className="conversation-price">{c.priceKz.toLocaleString(numberLocale)} Kz</p>
              {c.hasUnread && <span className="conversation-unread-label">{conv.unread}</span>}
              {c.showSellerHint && <span className="conversation-seller-hint">{conv.viewSeller}</span>}
            </div>
            <span>→</span>
          </Link>
        ))}
      </div>
      {hasMore ? (
        <div className="marketplace-load-more">
          <button type="button" className="secondary-button" disabled={loadingMore} onClick={() => void loadMore()}>
            {loadingMore ? loadMoreLabels.loadingMore : loadMoreLabels.loadMore}
          </button>
        </div>
      ) : null}
    </>
  );
}
