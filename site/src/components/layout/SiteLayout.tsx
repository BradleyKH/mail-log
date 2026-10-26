import { Suspense } from "react";
import { Outlet } from "react-router";
import RouteFallback from "./RouteFallback";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import { useSlashSearch } from "./useSlashSearch";

export default function SiteLayout() {
  useSlashSearch();
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
