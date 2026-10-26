import type { SpreadRow } from "@/spads/finance/spread";
import { formatSpreadLines } from "./presets";

type Props = { rows: SpreadRow[]; caption: string };

export default function SpreadTable({ rows, caption }: Props) {
  const lines = formatSpreadLines(rows);
  return (
    <figure className="min-w-0">
      <figcaption className="mb-1 text-xs text-muted-foreground">{caption}</figcaption>
      <div className="overflow-x-auto rounded border border-border bg-muted/40 p-3 font-mono text-sm">
        <div className="mb-1 whitespace-pre text-xs text-muted-foreground">MMM-YY  HOURS  DOLLARS</div>
        <div aria-label="Spread rows" role="list">
          {lines.map((line, i) => (
            <div key={rows[i].month} role="listitem" data-testid="spread-row" className="whitespace-pre">
              {line}
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
