import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

/** BrowserRouter keeps the old scroll offset across route changes; start each newly visited page at its top. */
export function useScrollToTop() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();
  useLayoutEffect(() => {
    // Back and forward leave the browser's own restoration alone; in-page anchors scroll to their target.
    if (navType === "POP" || hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash, navType]);
}
