/** Shared marketplace book query shape for SSR and API pagination. */
export const MARKETPLACE_PAGE_SIZE = 24;

export const MARKETPLACE_BOOK_SELECT =
  "*,book_images(id,storage_path,sort_order),profiles!books_seller_id_fkey(display_name,avatar_url)";

/** Favorites join shape for list + pagination APIs. */
export const FAVORITES_LIST_SELECT = `book_id, books:book_id(${MARKETPLACE_BOOK_SELECT})`;

/** Seller dashboard listing rows (manage own books). */
export const MY_LISTINGS_SELECT = "*,book_images(id,storage_path,sort_order)";
