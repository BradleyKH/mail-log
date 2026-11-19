import RouteFallback from "@/components/layout/RouteFallback";
import CodeIntro from "./CodeIntro";
import CodeTotals from "./CodeTotals";
import RoutineList from "./RoutineList";
import { useCodeData } from "./useCodeData";

export default function CodePage() {
  const data = useCodeData();
  return (
    <section className="space-y-8">
      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        <div className="space-y-8">
          <header className="space-y-2">
            <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">Code</h1>
            <p className="text-muted-foreground">
              MAIL LOG as Danny K. Harris wrote it: FORTRAN, routine by routine, beside the original listing pages and flowcharts.
            </p>
          </header>
          {data && <CodeIntro />}
        </div>
        {data && <CodeTotals totals={data.index.totals} />}
      </div>
      {data === undefined && <RouteFallback />}
      {data === null && <p className="text-muted-foreground">The code index is not available.</p>}
      {data && <RoutineList routines={data.index.routines} />}
    </section>
  );
}
