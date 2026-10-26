import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Section, SpadsReport } from "@/content/types";
import { pagePath } from "@/routes/archive/scanUrl";
import FormulaNote from "./FormulaNote";
import type { ReportNote } from "./reportNotes";

const DOC_ID = "cr-177949";
const linkClass = "text-primary underline-offset-2 hover:underline";

const resultVariant = (result: string) =>
  result.startsWith("pass") ? "default" : result.startsWith("fail") ? "destructive" : "outline";

const splitResult = (result: string) => {
  const i = result.indexOf(";");
  return i < 0 ? { verdict: result, detail: "" } : { verdict: result.slice(0, i), detail: result.slice(i + 1).trim() };
};

export default function ReportDetail({
  report,
  note,
  section,
  onBack,
}: {
  report: SpadsReport;
  note: ReportNote | undefined;
  section: Section | undefined;
  onBack: () => void;
}) {
  return (
    <article className="min-w-0 space-y-6" data-testid="report-detail">
      <div className="space-y-2">
        <Button variant="outline" size="sm" onClick={onBack}>
          Back to all reports
        </Button>
        <h2 className="font-mono text-xl font-semibold tracking-wide uppercase">
          {report.id} {report.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {section ? `Manual section ${section.id}, ${section.title.toLowerCase()}, PDF page ${section.pdfPage}. ` : ""}
          Scans:{" "}
          {report.pdfPages.map((p, i) => (
            <span key={p}>
              {i > 0 ? ", " : ""}
              <Link to={pagePath(DOC_ID, p)} className={linkClass}>
                PDF page {p}
              </Link>
            </span>
          ))}
        </p>
      </div>

      {note ? (
        <section className="space-y-1">
          <h3 className="font-mono text-sm font-semibold uppercase">What it was for</h3>
          <p>{note.purpose}</p>
          <p className="text-sm text-muted-foreground">
            From the manual,{" "}
            <Link to={pagePath(DOC_ID, note.purposePage)} className={linkClass}>
              PDF page {note.purposePage}
            </Link>
            .
          </p>
        </section>
      ) : null}

      {report.options.length > 0 ? (
        <section className="space-y-1">
          <h3 className="font-mono text-sm font-semibold uppercase">Options it was run with</h3>
          <ul className="list-inside list-disc font-mono text-sm">
            {report.options.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {note && note.formulas.length > 0 ? (
        <section className="space-y-2">
          <h3 className="font-mono text-sm font-semibold uppercase">Formulas</h3>
          {note.formulas.map((f) => (
            <FormulaNote key={f.name} formula={f} />
          ))}
        </section>
      ) : null}

      {note?.printedErrors ? (
        <section className="space-y-2 rounded-md border border-destructive/50 p-3" data-testid="printed-errors">
          <h3 className="font-mono text-sm font-semibold uppercase">Wrong in the original</h3>
          <ul className="list-inside list-disc space-y-1 text-sm">
            {note.printedErrors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-2">
        <h3 className="font-mono text-sm font-semibold uppercase">Printout</h3>
        <pre
          tabIndex={0}
          className="max-w-full overflow-x-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-xs leading-snug"
        >
          {report.printout}
        </pre>
      </section>

      <section className="space-y-2">
        <h3 className="font-mono text-sm font-semibold uppercase">Checks against the printout</h3>
        <ul className="space-y-2">
          {report.verified.map((v) => {
            const { verdict, detail } = splitResult(v.result);
            return (
              <li key={v.what} className="space-y-1 text-sm">
                <div>{v.what}</div>
                <div className="flex flex-wrap items-baseline gap-2 text-muted-foreground">
                  <Badge variant={resultVariant(v.result)}>{verdict}</Badge>
                  {detail ? <span className="min-w-0 break-words">{detail}</span> : null}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
}
