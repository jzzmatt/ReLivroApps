"use client";

import {useState} from "react";
import {AdminReportAction} from "@/components/AdminReportAction";
import type {AdminReportRow} from "@/lib/admin-reports-query";
import {reportBookTitle} from "@/lib/admin-reports-query";
import type {AdminActionLabels} from "@/lib/i18n-admin";
import type {Locale} from "@/lib/i18n";
import {formatMarketplaceCatalogSize, type MarketplaceLabels} from "@/lib/i18n-marketplace";

export function AdminReportsClient({
  reports: initialReports,
  totalReports,
  pageSize,
  locale,
  removedBookLabel,
  actionLabels,
  loadMoreLabels,
  dateLocale,
}: {
  reports: AdminReportRow[];
  totalReports: number;
  pageSize: number;
  locale: Locale;
  removedBookLabel: string;
  actionLabels: AdminActionLabels;
  loadMoreLabels: MarketplaceLabels;
  dateLocale: string;
}) {
  const [reports, setReports] = useState(initialReports);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const hasMore = page * pageSize < totalReports;

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/admin/reports?page=${nextPage}&limit=${pageSize}`);
      const json = (await res.json()) as {reports?: AdminReportRow[]};
      if (!res.ok || !json.reports) return;
      setPage(nextPage);
      setReports((prev) => {
        const seen = new Set(prev.map((r) => r.id));
        const merged = [...prev];
        for (const row of json.reports || []) {
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
      {totalReports > pageSize ? (
        <p className="admin-listings-count">
          {formatMarketplaceCatalogSize(locale, Math.min(page * pageSize, totalReports), totalReports)}
        </p>
      ) : null}
      <div className="admin-table">
        {reports.map((r) => (
          <article key={r.id}>
            <div>
              <strong>{reportBookTitle(r.books, removedBookLabel)}</strong>
              <span>
                {r.reason} · {new Date(r.created_at).toLocaleDateString(dateLocale)}
              </span>
              <small>{r.details || ""}</small>
            </div>
            <AdminReportAction id={r.id} labels={actionLabels} />
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
