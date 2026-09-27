"use client";

import {usePathname} from "next/navigation";
import {useEffect, useRef} from "react";

/** Re-run when the user navigates or returns to the tab (keeps shell badges fresh). */
export function useNavBadgeRefresh(run: () => void | Promise<void>) {
  const pathname = usePathname();
  const runRef = useRef(run);
  runRef.current = run;

  useEffect(() => {
    void runRef.current();
  }, [pathname]);

  useEffect(() => {
    const onFocus = () => {
      void runRef.current();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);
}
