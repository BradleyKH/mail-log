import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FocusSearchState } from "@/components/layout/useSlashSearch";
import { listDocs } from "@/content/load";
import ArchiveSearchBar from "./ArchiveSearchBar";
import SearchResults from "./SearchResults";
import ShelfGroup from "./ShelfGroup";
import { groupDocs } from "./shelfGroups";

export default function ArchivePage() {
  const [params] = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  const location = useLocation();
  const navigate = useNavigate();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const focusOnArrival = (location.state as FocusSearchState | null)?.focusSearch === true;
  const [open, setOpen] = useState(focusOnArrival);
  const [openedByClick, setOpenedByClick] = useState(false);

  // The header search link and the `/` key navigate here with focusSearch, also when already on this page.
  useEffect(() => {
    if (focusOnArrival) setOpen(true);
  }, [focusOnArrival, location.key]);

  const searchShown = open || query !== "";

  const openSearch = () => {
    setOpenedByClick(true);
    setOpen(true);
  };

  const closeSearch = () => {
    setOpen(false);
    setOpenedByClick(false);
    if (query || focusOnArrival) navigate("/reports", { replace: true });
    // The toggle button remounts after the field unmounts, so focus it on the next frame.
    requestAnimationFrame(() => toggleRef.current?.focus());
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="mr-auto font-mono text-3xl font-semibold tracking-wide uppercase">Reports</h1>
          {searchShown && (
            <div className="order-last w-full sm:order-none sm:w-auto sm:max-w-sm sm:flex-1">
              <ArchiveSearchBar query={query} live autoFocus={openedByClick} onEscape={closeSearch} />
            </div>
          )}
          {searchShown ? (
            <Button variant="ghost" size="icon" onClick={closeSearch} aria-label="Close search" title="Close search">
              <X />
            </Button>
          ) : (
            <Button
              ref={toggleRef}
              variant="ghost"
              size="icon"
              onClick={openSearch}
              aria-label="Search the reports"
              title="Search the reports (press /)"
            >
              <Search />
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          The MAIL LOG reports of 1979 and the SPADS manuals of 1985, searchable, with the text beside the original scans.
        </p>
      </header>
      {query ? (
        <SearchResults query={query} />
      ) : (
        <div className="space-y-8" data-testid="shelf">
          {groupDocs(listDocs()).map(({ group, docs }) => (
            <ShelfGroup key={group.date} group={group} docs={docs} />
          ))}
        </div>
      )}
    </section>
  );
}
