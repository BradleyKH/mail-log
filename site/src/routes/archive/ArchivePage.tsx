import { useSearchParams } from "react-router";
import { listDocs } from "@/content/load";
import ArchiveSearchBar from "./ArchiveSearchBar";
import SearchResults from "./SearchResults";
import ShelfGroup from "./ShelfGroup";
import { groupDocs } from "./shelfGroups";

export default function ArchivePage() {
  const [params] = useSearchParams();
  const query = (params.get("q") ?? "").trim();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">Archive</h1>
        <p className="max-w-2xl text-muted-foreground">
          The MAIL LOG reports of 1979 and the SPADS manuals of 1985, searchable, with the text beside the original scans.
        </p>
      </header>
      <ArchiveSearchBar query={query} live />
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
