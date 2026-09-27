import {MARKETPLACE_PAGE_SIZE} from "@/lib/marketplace-query";

export const ADMIN_USERS_PAGE_SIZE = MARKETPLACE_PAGE_SIZE;

export const ADMIN_USERS_SELECT = "id,display_name,city,school,school_verified_at,role,created_at";

export type AdminUserRow = {
  id: string;
  display_name: string | null;
  city: string | null;
  school: string | null;
  school_verified_at: string | null;
  role: string;
  created_at: string;
};
