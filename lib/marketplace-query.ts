/** Shared marketplace book query shape for SSR and API pagination. */
export const MARKETPLACE_PAGE_SIZE = 24;

export const MARKETPLACE_BOOK_SELECT =
  "*,book_images(id,storage_path,sort_order),profiles!books_seller_id_fkey(display_name,avatar_url)";
