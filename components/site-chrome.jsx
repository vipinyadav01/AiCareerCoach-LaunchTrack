"use client";

import { usePathname } from "next/navigation";
import { isAppRoute } from "@/lib/app-routes";

// Renders its children only on marketing pages; app screens have the sidebar instead.
export function MarketingOnly({ children }) {
  const pathname = usePathname();
  return isAppRoute(pathname) ? null : children;
}
