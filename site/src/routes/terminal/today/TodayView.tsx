import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isRecordType } from "@/terminal/programData";
import type { RecordType, StoredRecord } from "@/terminal/types";
import NewRecordDialog from "./NewRecordDialog";
import RecordSheet from "./RecordSheet";
import RecordsTable from "./RecordsTable";
import RecordTypeNav from "./RecordTypeNav";
import { COLUMNS, RECORD_LABELS, filterRecords, searchableFields, sortRecords, type Column } from "./todayModel";
import { env, useRecords } from "./useRecords";

export default function TodayView() {
  const [params] = useSearchParams();
  const raw = params.get("record");
  const record: RecordType = isRecordType(raw) ? raw : "correspondence";
  const fields = useMemo(() => env.data.fields[record] ?? [], [record]);
  const flow = env.data.flows[record];
  const searchable = useMemo(() => searchableFields(fields), [fields]);
  const all = useRecords(record);

  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>();
  const [selectedId, setSelectedId] = useState<string>();
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<string>();

  const rows = useMemo(() => {
    const column = COLUMNS[record].find((c) => c.key === sort?.key);
    return sortRecords(filterRecords(all, searchable, query, scope), column, sort?.dir ?? "asc");
  }, [all, searchable, query, scope, sort, record]);
  const selected = all.find((r) => r.id === selectedId);

  const onSort = (c: Column) =>
    setSort((s) => (s?.key === c.key ? (s.dir === "asc" ? { key: c.key, dir: "desc" } : undefined) : { key: c.key, dir: "asc" }));

  const onArchive = (r: StoredRecord) => {
    env.store.remove(record, r.id);
    setSelectedId(undefined);
    setNotice("Archived. It no longer appears in the 1979 view either.");
  };

  const labels = RECORD_LABELS[record];
  const scopeValid = scope === "all" || searchable.some((f) => f.name === scope);

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
      <RecordTypeNav record={record} />
      <section className="min-w-0 space-y-4" aria-label={labels.nav}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{labels.nav}</h2>
            <p className="text-sm text-muted-foreground" data-testid="today-count">
              {rows.length === all.length ? `${all.length} ${labels.plural}` : `${rows.length} of ${all.length} ${labels.plural}`}
            </p>
          </div>
          <Button
            onClick={() => {
              setNotice(undefined);
              setCreating(true);
            }}
          >
            <PlusIcon /> New record
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Input
            type="search"
            aria-label="Filter records"
            placeholder="Search the manual's searchable items"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm"
          />
          <select
            aria-label="Search in"
            value={scopeValid ? scope : "all"}
            onChange={(e) => setScope(e.target.value)}
            className="h-9 rounded-md border bg-background px-2 text-sm"
          >
            <option value="all">All searchable items</option>
            {searchable.map((f) => (
              <option key={f.name} value={f.name}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {notice && (
          <p role="status" className="rounded-md border bg-muted px-3 py-2 text-sm" data-testid="today-notice">
            {notice}
          </p>
        )}

        <div className="overflow-x-auto rounded-md border">
          <RecordsTable record={record} rows={rows} sortKey={sort?.key} sortDir={sort?.dir ?? "asc"} onSort={onSort} onOpen={(r) => setSelectedId(r.id)} />
        </div>
      </section>

      <RecordSheet record={record} selected={selected} fields={fields} onClose={() => setSelectedId(undefined)} onArchive={onArchive} />
      <NewRecordDialog
        record={record}
        fields={fields}
        flow={flow}
        open={creating}
        onOpenChange={setCreating}
        onCreated={(r, note) => {
          setNotice(note);
          setSelectedId(r.id);
        }}
      />
    </div>
  );
}
