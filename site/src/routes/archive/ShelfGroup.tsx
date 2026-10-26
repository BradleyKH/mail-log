import type { DocMeta } from "@/content/types";
import ShelfCard from "./ShelfCard";
import type { ShelfGroupDef } from "./shelfGroups";

export default function ShelfGroup({ group, docs }: { group: ShelfGroupDef; docs: DocMeta[] }) {
  return (
    <section className="space-y-3" aria-labelledby={`shelf-${group.date}`}>
      <header className="space-y-1">
        <h2 id={`shelf-${group.date}`} className="font-mono text-xl font-semibold tracking-wide">
          {group.title}
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">{group.description}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {docs.map((d) => (
          <ShelfCard key={d.docId} doc={d} />
        ))}
      </div>
    </section>
  );
}
