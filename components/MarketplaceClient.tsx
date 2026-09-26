"use client";

import {useMemo, useState} from "react";
import {BookCard} from "@/components/BookCard";
import type {Book, ListingMode} from "@/lib/books";
import {modes, subjects} from "@/lib/books";
import type {Locale} from "@/lib/i18n";
import {labelSubject} from "@/lib/i18n-catalog";
import type {MarketplaceLabels} from "@/lib/i18n-marketplace";

type ModeFilter = "Todos" | ListingMode;

export function MarketplaceClient({
  books,
  favorites,
  labels,
  locale,
}: {
  books: Book[];
  favorites: string[];
  labels: MarketplaceLabels;
  locale: Locale;
}) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("Todos");
  const [mode, setMode] = useState<ModeFilter>("Todos");

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
      <div className="results-head">
        <strong>{labels.results(filtered.length)}</strong>
        <span>{labels.sortRecent}</span>
      </div>
      <div className="book-grid">
        {filtered.map((book, i) => (
          <BookCard key={book.id} book={book} index={i} isFavorite={favorites.includes(book.id)} labels={labels} />
        ))}
      </div>
    </>
  );
}
