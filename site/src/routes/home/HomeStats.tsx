import { listDocs, loadCodeIndex } from "@/content/load";
import { useEffect, useState } from "react";

const fmt = new Intl.NumberFormat("en-US");

export default function HomeStats() {
  const [totals, setTotals] = useState<{ routines: number; lines: number }>();
  useEffect(() => {
    let live = true;
    loadCodeIndex().then((index) => live && index && setTotals(index.totals));
    return () => {
      live = false;
    };
  }, []);

  const docs = listDocs();
  const pages = docs.reduce((sum, d) => sum + d.pageCount, 0);
  const stats: [string, string][] = [
    [totals ? fmt.format(totals.routines) : "...", "routines of FORTRAN"],
    [totals ? fmt.format(totals.lines) : "...", "lines of source"],
    [fmt.format(docs.length), "volumes"],
    [fmt.format(pages), "pages"],
  ];
  return (
    <section aria-label="By the numbers">
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="rounded-md border border-border p-4 text-center">
            <dt className="order-2 text-sm text-muted-foreground">{label}</dt>
            <dd className="font-mono text-3xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
