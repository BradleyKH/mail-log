import RouteFallback from "@/components/layout/RouteFallback";
import CodeIntro from "./CodeIntro";
import RoutineList from "./RoutineList";
import { useCodeData } from "./useCodeData";

export default function CodePage() {
  const data = useCodeData();
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">Code</h1>
        <p className="max-w-2xl text-muted-foreground">
          MAIL LOG as Danny K. Harris wrote it: FORTRAN, routine by routine, beside the original listing pages and flowcharts.
        </p>
      </header>
      {data === undefined && <RouteFallback />}
      {data === null && <p className="text-muted-foreground">The code index is not available.</p>}
      {data && (
        <>
          <CodeIntro totals={data.index.totals} />
          <RoutineList routines={data.index.routines} />
        </>
      )}
    </section>
  );
}
