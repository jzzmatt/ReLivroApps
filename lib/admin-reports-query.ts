import {MARKETPLACE_PAGE_SIZE} from "@/lib/marketplace-query";

export const ADMIN_REPORTS_PAGE_SIZE = MARKETPLACE_PAGE_SIZE;

export const ADMIN_REPORTS_SELECT =
  "id,book_id,reason,details,created_at,books(title,is_published,status)";

export type AdminReportRow = {
  id: string;
  book_id: string;
  reason: string;
  details: string | null;
  created_at: string;
  books:
    | {title: string; is_published: boolean; status: string}
    | {title: string; is_published: boolean; status: string}[]
    | null;
};

export function reportBookTitle(
  books: AdminReportRow["books"],
  fallback: string,
): string {
  if (!books) return fallback;
  const book = Array.isArray(books) ? books[0] : books;
  return book?.title || fallback;
}
