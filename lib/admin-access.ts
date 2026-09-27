import type {SupabaseClient} from "@supabase/supabase-js";

export type StaffRole = "admin" | "moderator";

export async function getStaffRole(
  supabase: SupabaseClient,
  userId: string,
): Promise<StaffRole | null> {
  const {data: profile} = await supabase.from("profiles").select("role").eq("id", userId).single();
  if (!profile?.role) return null;
  if (profile.role === "admin" || profile.role === "moderator") return profile.role;
  return null;
}

export async function requireStaff(
  supabase: SupabaseClient,
  userId: string,
  options?: {adminOnly?: boolean},
): Promise<StaffRole | null> {
  const role = await getStaffRole(supabase, userId);
  if (!role) return null;
  if (options?.adminOnly && role !== "admin") return null;
  return role;
}
