"use client";

import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";

export function ProfileLogoutButton({label}: {label: string}) {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" className="profile-logout-button" onClick={() => void logout()}>
      {label}
    </button>
  );
}
