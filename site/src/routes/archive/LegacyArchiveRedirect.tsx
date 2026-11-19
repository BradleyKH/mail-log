import { Navigate, useLocation } from "react-router";

/** Keeps links to the old /archive URLs working by sending them to the same place under /reports. */
export default function LegacyArchiveRedirect() {
  const { pathname, search, hash } = useLocation();
  return <Navigate to={`${pathname.replace(/^\/archive/, "/reports")}${search}${hash}`} replace />;
}
