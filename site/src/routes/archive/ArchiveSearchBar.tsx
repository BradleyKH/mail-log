import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { FocusSearchState } from "@/components/layout/useSlashSearch";

type Props = {
  /** The query in the URL; the field follows it. */
  query?: string;
  /** Search as you type (used on the results page); otherwise Enter submits. */
  live?: boolean;
};

const target = (q: string) => `/archive${q ? `?q=${encodeURIComponent(q)}` : ""}`;

export default function ArchiveSearchBar({ query = "", live = false }: Props) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(query);

  useEffect(() => setValue(query), [query]);

  const location = useLocation();
  const focusOnArrival = (location.state as FocusSearchState | null)?.focusSearch === true;
  useEffect(() => {
    if (focusOnArrival) inputRef.current?.focus();
  }, [focusOnArrival, location.key]);

  useEffect(() => {
    if (!live || value.trim() === query.trim()) return;
    const t = setTimeout(() => navigate(target(value.trim()), { replace: true }), 250);
    return () => clearTimeout(t);
  }, [live, value, query, navigate]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(target(value.trim()));
  };

  return (
    <form role="search" onSubmit={submit} className="relative">
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        data-site-search
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => void import("@/lib/search/loadEngine").then((m) => m.loadSearchEngine())}
        aria-label="Search the reports"
        placeholder="Search the reports (press /)"
        className="h-10 pl-9 font-mono"
      />
    </form>
  );
}
