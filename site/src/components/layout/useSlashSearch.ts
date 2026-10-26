import { useEffect } from "react";
import { useNavigate } from "react-router";

/** State a navigation carries so the Archive's search field takes focus on arrival. */
export type FocusSearchState = { focusSearch?: boolean };

/** `/` focuses the page's search field anywhere on the site, or opens the Archive search when the page has none. */
export function useSlashSearch() {
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
      if (e.key !== "/" || typing || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
      e.preventDefault();
      const field = document.querySelector<HTMLInputElement>("[data-site-search]");
      if (field) {
        field.focus();
        field.select();
      } else {
        navigate("/archive", { state: { focusSearch: true } satisfies FocusSearchState });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
}
