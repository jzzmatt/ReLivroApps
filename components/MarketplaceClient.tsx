"use client";

import {useMemo, useRef, useState} from "react";
import Link from "next/link";
import {BookCard} from "@/components/BookCard";
import type {Book, ListingMode} from "@/lib/books";
import {modes, subjects} from "@/lib/books";
import type {Locale} from "@/lib/i18n";
import {labelSubject} from "@/lib/i18n-catalog";
import {
  formatMarketplaceCatalogSize,
  formatMarketplaceResults,
  type MarketplaceLabels,
} from "@/lib/i18n-marketplace";
import {fillTemplate} from "@/lib/i18n-workspace";

type ModeFilter = "Todos" | ListingMode;

export function MarketplaceClient({
  books: initialBooks,
  totalPublished,
  pageSize,
  favorites,
  labels,
  locale,
  imagesPublicBase,
  viewerCity,
  signedIn,
}: {
  books: Book[];
  totalPublished: number;
  pageSize: number;
  favorites: string[];
  labels: MarketplaceLabels;
  locale: Locale;
  imagesPublicBase?: string | null;
  viewerCity: string | null;
  signedIn: boolean;
}) {
  const [books, setBooks] = useState(initialBooks);
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("Todos");
  const [mode, setMode] = useState<ModeFilter>("Todos");
  const [nearby, setNearby] = useState(false);
  const [nearbyTotal, setNearbyTotal] = useState<number | null>(null);
  const [nearbyError, setNearbyError] = useState("");
  const requestId = useRef(0);

  const activeTotal = nearby && nearbyTotal != null ? nearbyTotal : totalPublished;
  const hasMore = books.length < activeTotal;

  const filtered = useMemo(
    () =>
      books.filter(
        (b) =>
          (subject === "Todos" || b.subject === subject) &&
          (mode === "Todos" || b.mode === mode) &&
          (b.title + " " + b.subject + " " + b.grade + " " + (b.city || "") + " " + (b.municipality || ""))
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [books, query, subject, mode],
  );

  async function fetchPage(page: number, city: string | null) {
    const params = new URLSearchParams({page: String(page), limit: String(pageSize)});
    if (city) params.set("city", city);
    const res = await fetch("/api/books?" + params.toString());
    const json = (await res.json()) as {books?: Book[]; total?: number};
    if (!res.ok || !json.books || typeof json.total !== "number") return null;
    return {books: json.books, total: json.total};
  }

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    const id = ++requestId.current;
    const city = nearby ? viewerCity : null;
    setLoadingMore(true);
    try {
      const nextPage = Math.floor(books.length / pageSize) + 1;
      const result = await fetchPage(nextPage, city);
      if (id !== requestId.current || !result) return;
      setBooks((prev) => {
        const seen = new Set(prev.map((b) => b.id));
        const merged = [...prev];
        for (const book of result.books) {
          if (!seen.has(book.id)) {
            seen.add(book.id);
            merged.push(book);
          }
        }
        return merged;
      });
    } finally {
      if (id === requestId.current) setLoadingMore(false);
    }
  }

  async function toggleNearby() {
    if (!viewerCity || loadingMore) return;
    const id = ++requestId.current;
    if (nearby) {
      setNearby(false);
      setNearbyError("");
      setNearbyTotal(null);
      setBooks(initialBooks);
      return;
    }
    setLoadingMore(true);
    setNearbyError("");
    try {
      const result = await fetchPage(1, viewerCity);
      if (id !== requestId.current) return;
      if (!result) {
        setNearbyError(labels.nearbyFailed);
        return;
      }
      setBooks(result.books);
      setNearbyTotal(result.total);
      setNearby(true);
    } finally {
      if (id === requestId.current) setLoadingMore(false);
    }
  }

  const modeOptions: {value: ModeFilter; label: string}[] = [
    {value: "Todos", label: labels.all},
    ...modes.map((m) => ({value: m, label: labels.modes[m]})),
  ];

  return (
    <>
      <label className="search-box">
        <span>⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
        />
      </label>
      <div className="filter-scroll">
        <button className={subject === "Todos" ? "active" : ""} onClick={() => setSubject("Todos")}>
          {labels.all}
        </button>
        {subjects.map((s) => (
          <button key={s} className={subject === s ? "active" : ""} onClick={() => setSubject(s)}>
            {labelSubject(s, locale)}
          </button>
        ))}
      </div>
      <div className="mode-tabs">
        {modeOptions.map((m) => (
          <button key={m.value} className={mode === m.value ? "active" : ""} onClick={() => setMode(m.value)}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="nearby-bar">
        {viewerCity ? (
          nearby ? (
            <>
              <span className="active">{fillTemplate(labels.nearbyOn, {city: viewerCity})}</span>
              <button type="button" disabled={loadingMore} onClick={() => void toggleNearby()}>
                {labels.nearbyAll}
              </button>
            </>
          ) : (
            <button type="button" disabled={loadingMore} onClick={() => void toggleNearby()}>
              {fillTemplate(labels.nearby, {city: viewerCity})}
            </button>
          )
        ) : signedIn ? (
          <Link href="/profile/edit">{labels.nearbyAddCity}</Link>
        ) : (
          <Link href="/auth">{labels.nearbySignIn}</Link>
        )}
      </div>
      {nearbyError ? <p className="nearby-note">{nearbyError}</p> : null}
      <div className="results-head">
        <div className="results-head-main">
          <strong>{formatMarketplaceResults(locale, filtered.length)}</strong>
          {totalPublished > books.length ? (
            <span className="results-catalog-size">
              {formatMarketplaceCatalogSize(locale, books.length, totalPublished)}
            </span>
          ) : null}
        </div>
        <span>{labels.sortRecent}</span>
      </div>
      {nearby && viewerCity && !query && subject === "Todos" && mode === "Todos" && filtered.length === 0 && !loadingMore ? (
        <div className="empty-state">
          <p>{fillTemplate(labels.nearbyEmpty, {city: viewerCity})}</p>
        </div>
      ) : (
        <div className="book-grid">
          {filtered.map((book, i) => (
            <BookCard
              key={book.id}
              book={book}
              index={i}
              isFavorite={favorites.includes(book.id)}
              labels={labels}
              imagesPublicBase={imagesPublicBase}
            />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="marketplace-load-more">
          <button type="button" className="secondary-button" disabled={loadingMore} onClick={() => void loadMore()}>
            {loadingMore ? labels.loadingMore : labels.loadMore}
          </button>
        </div>
      )}
    </>
  );
}
