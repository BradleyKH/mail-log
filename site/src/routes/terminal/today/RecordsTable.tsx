import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { displayText } from "@/lib/display";
import type { RecordType, StoredRecord } from "@/terminal/types";
import { COLUMNS, type Column } from "./todayModel";

type Props = {
  record: RecordType;
  rows: StoredRecord[];
  sortKey: string | undefined;
  sortDir: "asc" | "desc";
  onSort: (column: Column) => void;
  onOpen: (r: StoredRecord) => void;
};

/** The column whose cell opens the record: the one that names it. */
const OPEN_COLUMN: Record<RecordType, string> = { correspondence: "subject", dir: "dirReportNumber", "drawing-eo": "number" };

export default function RecordsTable({ record, rows, sortKey, sortDir, onSort, onOpen }: Props) {
  const columns = COLUMNS[record];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((c) => (
            <TableHead key={c.key} aria-sort={c.key === sortKey ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
              <button type="button" onClick={() => onSort(c)} className="inline-flex items-center gap-1 font-medium hover:underline">
                {c.label}
                {c.key === sortKey && (sortDir === "asc" ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />)}
              </button>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
              No records match.
            </TableCell>
          </TableRow>
        )}
        {rows.map((r) => (
          <TableRow key={r.id} data-testid="record-row" className="cursor-pointer" onClick={() => onOpen(r)}>
            {columns.map((c) => (
              <TableCell key={c.key} className="max-w-72 truncate">
                {c.key === OPEN_COLUMN[record] ? (
                  <button
                    type="button"
                    className="text-left font-medium underline-offset-2 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(r);
                    }}
                  >
                    {displayText(c.text(r)) || "(blank)"}
                  </button>
                ) : (
                  displayText(c.text(r))
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
