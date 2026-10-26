import { Link } from "react-router";
import type { CodeIndex } from "@/content/types";
import { archivePageHref } from "./codeLinks";

const fmt = (n: number) => n.toLocaleString("en-US");
const linkClass = "text-primary underline underline-offset-2";

export default function CodeIntro({ totals }: { totals: CodeIndex["totals"] }) {
  const stats: [string, string][] = [
    ["Routines", fmt(totals.routines)],
    ["Lines of FORTRAN", fmt(totals.lines)],
    ["Comment lines", fmt(totals.commentLines)],
  ];
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_auto]">
      <div className="max-w-2xl space-y-3 leading-relaxed">
        <p>
          The program is written in FORTRAN IV for the PRIME 300 computer system in Building 1192-E at NASA Langley Research Center. The
          machine is a 16-bit minicomputer with 64K words of virtual memory and 256K words of physical memory, backed by a 60 megabyte disk
          and tape backup (
          <Link className={linkClass} to={archivePageHref("cr-159063", 15)}>
            Volume I, introduction
          </Link>
          ;{" "}
          <Link className={linkClass} to={archivePageHref("cr-159066", 21)}>
            Summary and Specifications
          </Link>
          ).
        </p>
        <p>
          The flowcharts use standard IBM symbols, and each subroutine's chart is identified by its figure number; the{" "}
          <Link className={linkClass} to={archivePageHref("cr-159063", 18)}>
            flowchart conventions
          </Link>{" "}
          explain the rest. His comment cards narrate the program as it runs, so read them in the source.
        </p>
      </div>
      <dl className="grid grid-cols-3 gap-4 md:grid-cols-1" aria-label="Totals">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-md border bg-card px-4 py-2">
            <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
            <dd className="font-mono text-2xl tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
