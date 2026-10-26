import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { FORMULAS, hoodFor, SPADS_DOC, type FormulaKey } from "./spadsHints";

type Props = { screen: string | undefined; formula: FormulaKey | undefined };

const pageLink = (page: number) => `/archive/${SPADS_DOC}/page/${page}`;

export default function SpadsHood({ screen, formula }: Props) {
  const [open, setOpen] = useState(true);
  const info = hoodFor(screen);
  const note = formula ? FORMULAS[formula] : undefined;

  return (
    <section aria-labelledby="spads-hood-heading" className="min-w-0 rounded-lg border bg-card text-card-foreground">
      <h2 id="spads-hood-heading" className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="spads-hood-body"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left font-semibold"
        >
          Under the hood
          <ChevronDown aria-hidden className={`size-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
        </button>
      </h2>
      {open && (
        <div id="spads-hood-body" className="space-y-4 border-t px-4 py-4">
          {info ? (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">CR-177949 · Contract Analysis</p>
              <p className="text-lg font-semibold" data-testid="spads-hood-screen">
                You are at the {info.label}
              </p>
              <p className="text-sm">
                Section {info.sectionId}, {info.sectionTitle}
              </p>
              <div className="pt-1 text-sm">
                <Link to={pageLink(info.pdfPage)} className="text-primary underline-offset-2 hover:underline">
                  Read it in the manual (page {info.pdfPage})
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {screen ? "This screen is not tied to one section of the manual." : "The session has ended. Type LOGIN and your initials to start again."}
            </p>
          )}
          {note && (
            <div className="space-y-2 border-t pt-4" data-testid="spads-hood-formula">
              <p className="text-sm text-muted-foreground">{note.reconstructed ? "Formula, reconstructed" : "Formula, as printed"}</p>
              <p className="font-semibold">{note.title}</p>
              <p className="text-sm">{note.formula}</p>
              <p className="text-sm text-muted-foreground">
                {note.reconstructed && "The manual does not state this formula; it was worked out from the printed figures. "}
                {note.evidence}
              </p>
              <Link to={pageLink(note.pdfPage)} className="text-sm text-primary underline-offset-2 hover:underline">
                See the printed figures (page {note.pdfPage})
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
