import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import RouteFallback from "@/components/layout/RouteFallback";
import SpadsSubNav from "./SpadsSubNav";

// Older links point at anchors on what was a single SPADS page; send each to the page that holds that section.
const LEGACY_HASHES: Record<string, { pathname: string; hash?: string }> = {
  "#mail-log-1985": { pathname: "/spads/mail-log" },
  "#contract-analysis": { pathname: "/spads/terminal" },
  "#terminal": { pathname: "/spads/terminal" },
  "#spread": { pathname: "/spads/spread-reports", hash: "#spread" },
  "#reports": { pathname: "/spads/spread-reports", hash: "#reports" },
};

export default function SpadsLayout() {
  const { pathname, hash, search } = useLocation();
  const legacy = /\/spads\/?$/.test(pathname) ? LEGACY_HASHES[hash] : undefined;
  if (legacy) return <Navigate replace to={{ ...legacy, search }} />;
  return (
    <div className="space-y-8">
      <SpadsSubNav />
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
