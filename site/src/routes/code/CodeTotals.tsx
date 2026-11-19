import type { CodeIndex } from "@/content/types";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CodeTotals({ totals }: { totals: CodeIndex["totals"] }) {
  const stats: [string, string][] = [
    ["Routines", fmt(totals.routines)],
    ["Lines of FORTRAN", fmt(totals.lines)],
    ["Comment lines", fmt(totals.commentLines)],
  ];
  return (
    <dl className="grid grid-cols-3 gap-4 md:grid-cols-1" aria-label="Totals">
      {stats.map(([label, value]) => (
        <div key={label} className="rounded-md border bg-card px-4 py-2">
          <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
          <dd className="font-mono text-2xl tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
