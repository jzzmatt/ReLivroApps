import type {Book} from "@/lib/books";
import {oneRelation} from "@/lib/supabase-relations";

type FavoriteRow = {
  book_id: string;
  books: Book | Book[] | null;
};

export function booksFromFavoriteRows(rows: FavoriteRow[] | null | undefined): Book[] {
  return (rows || [])
    .map((row) => oneRelation(row.books))
    .filter((book): book is Book => !!book && book.is_published);
}
