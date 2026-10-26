import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import type { Step } from "@/content/types";
import { displayText } from "@/lib/display";
import type { RecordType } from "@/terminal/types";
import HoodCode from "./HoodCode";
import { useHoodMatches } from "./useHood";

type Props = { record: RecordType; step: Step | undefined; recordTitle: string };

const MODE_LABEL: Record<Step["mode"], string> = {
  common: "Getting in",
  menu: "Search mode",
  input: "Input mode",
  revise: "Revise mode",
  search: "Search mode",
  archive: "Archive mode",
};

/** The manual's numbering restarts in each mode; `title` keeps the printed label. */
const printedLabel = (step: Step) => (step.title && /^Step #/.test(step.title) ? step.title : `Step #${step.n}${step.title ? ` (${step.title})` : ""}`);

export default function UnderTheHood({ record, step, recordTitle }: Props) {
  const [open, setOpen] = useState(true);
  const matches = useHoodMatches(record, step?.n);
  const best = matches?.[0];

  return (
    <section aria-labelledby="hood-heading" className="min-w-0 rounded-lg border bg-card text-card-foreground">
      <h2 id="hood-heading" className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="hood-body"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left font-semibold"
        >
          Under the hood
          <ChevronDown aria-hidden className={`size-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
        </button>
      </h2>
      {open && (
        <div id="hood-body" className="space-y-4 border-t px-4 py-4">
          {step ? (
            <>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {recordTitle} · {MODE_LABEL[step.mode]}
                </p>
                <p className="text-lg font-semibold" data-testid="hood-step">
                  You are at {printedLabel(step)}
                </p>
                {step.input?.description && <p className="text-sm">{displayText(step.input.description)}</p>}
                {step.response && <p className="text-sm text-muted-foreground">{displayText(step.response)}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm">
                  <Link to={`/archive/cr-159065/page/${step.pdfPage}`} className="text-primary underline-offset-2 hover:underline">
                    Read it in the manual (page {step.pdfPage})
                  </Link>
                  <Link to={`/map?layer=manual&record=${record}&step=${step.n}`} className="text-primary underline-offset-2 hover:underline">
                    Find it on the Map
                  </Link>
                </div>
              </div>
              {matches === undefined ? (
                <p className="text-xs text-muted-foreground">Looking up the FORTRAN...</p>
              ) : best ? (
                <>
                  <HoodCode match={best} />
                  {matches.length > 1 && (
                    <p className="text-xs text-muted-foreground">
                      Similar prompts also appear in{" "}
                      {matches.slice(1, 3).map((m, i) => (
                        <span key={m.routine}>
                          {i > 0 && ", "}
                          <Link to={`/code/${encodeURIComponent(m.routine)}?line=${m.seq}`} className="font-mono underline-offset-2 hover:underline">
                            {m.name}
                          </Link>
                        </span>
                      ))}
                      .
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No printed prompt in the listings matches this step closely, so the routine behind it is not pinned down here.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">The session has ended. Type LOGIN and your initials to start again.</p>
          )}
        </div>
      )}
    </section>
  );
}
