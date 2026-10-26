import type { SpadsReport } from "@/content/types";
import { checkTally, type ReportNote } from "./reportNotes";

export default function ReportCard({
  report,
  note,
  onOpen,
}: {
  report: SpadsReport;
  note: ReportNote | undefined;
  onOpen: (id: string) => void;
}) {
  const { pass, fail } = checkTally(report);
  return (
    <button
      type="button"
      onClick={() => onOpen(report.id)}
      className="flex h-full flex-col gap-2 rounded-md border border-border bg-card p-4 text-left text-card-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-ring"
      data-testid="report-card"
    >
      <span className="font-mono text-sm font-semibold">{report.id}</span>
      <span className="font-mono text-xs tracking-wide uppercase">{report.title}</span>
      {note ? <span className="line-clamp-3 text-sm text-muted-foreground">{note.purpose}</span> : null}
      <span className="mt-auto pt-2 text-xs text-muted-foreground">
        {report.options.length > 0 ? `${report.options.length} run options` : "No run options printed"}, {pass} checks pass
        {fail > 0 ? `, ${fail} fail in the original` : ""}
      </span>
    </button>
  );
}
