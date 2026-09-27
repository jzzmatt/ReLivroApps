import {MARKETPLACE_PAGE_SIZE} from "@/lib/marketplace-query";

export const ADMIN_LISTINGS_PAGE_SIZE = MARKETPLACE_PAGE_SIZE;

export const ADMIN_LISTINGS_SELECT =
  "id,title,price_kz,is_published,status,created_at,city,seller_id";

export type AdminListingRow = {
  id: string;
  title: string;
  price_kz: number;
  is_published: boolean;
  status: string;
  created_at: string;
  city: string | null;
  seller_id: string;
};
