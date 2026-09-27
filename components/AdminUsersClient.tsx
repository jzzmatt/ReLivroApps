"use client";

import {useState} from "react";
import type {AdminUserRow} from "@/lib/admin-users-query";
import type {Locale} from "@/lib/i18n";
import {formatMarketplaceCatalogSize, type MarketplaceLabels} from "@/lib/i18n-marketplace";

export function AdminUsersClient({
  users: initialUsers,
  totalUsers,
  pageSize,
  locale,
  noNameLabel,
  loadMoreLabels,
}: {
  users: AdminUserRow[];
  totalUsers: number;
  pageSize: number;
  locale: Locale;
  noNameLabel: string;
  loadMoreLabels: MarketplaceLabels;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const hasMore = page * pageSize < totalUsers;

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/admin/users?page=${nextPage}&limit=${pageSize}`);
      const json = (await res.json()) as {users?: AdminUserRow[]};
      if (!res.ok || !json.users) return;
      setPage(nextPage);
      setUsers((prev) => {
        const seen = new Set(prev.map((u) => u.id));
        const merged = [...prev];
        for (const row of json.users || []) {
          if (!seen.has(row.id)) {
            seen.add(row.id);
            merged.push(row);
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
      {totalUsers > pageSize ? (
        <p className="admin-listings-count">
          {formatMarketplaceCatalogSize(locale, Math.min(page * pageSize, totalUsers), totalUsers)}
        </p>
      ) : null}
      <div className="admin-table">
        {users.map((u) => (
          <article key={u.id}>
            <div>
              <strong>{u.display_name || noNameLabel}</strong>
              <span>
                {u.city || "Angola"} {u.school ? `· ${u.school}` : ""}
              </span>
            </div>
            <span className="admin-role">{u.role}</span>
          </article>
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
