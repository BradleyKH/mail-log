import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { RoutineEntry } from "@/content/types";
import { RECORD_LABELS, RECORD_ORDER } from "./codeLinks";
import RoutineRow from "./RoutineRow";

export default function RoutineList({ routines }: { routines: RoutineEntry[] }) {
  const [query, setQuery] = useState("");
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const shown = q ? routines.filter((r) => `${r.id} ${r.description ?? ""}`.toLowerCase().includes(q)) : routines;
    return RECORD_ORDER.map((record) => ({ record, items: shown.filter((r) => r.record === record) })).filter((g) => g.items.length);
  }, [routines, query]);

  return (
    <div className="space-y-6">
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter routines by name or description"
        aria-label="Filter routines"
        className="max-w-md"
      />
      {groups.length === 0 && <p className="text-muted-foreground">No routines match.</p>}
      {groups.map(({ record, items }) => (
        <section key={record} aria-labelledby={`group-${record}`}>
          <h2 id={`group-${record}`} className="border-b pb-1 font-mono text-sm tracking-widest uppercase">
            {RECORD_LABELS[record]} <span className="text-muted-foreground">({items.length})</span>
          </h2>
          <ul className="divide-y">
            {items.map((r) => (
              <RoutineRow key={r.id} routine={r} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
