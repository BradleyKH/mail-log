import type { ReactNode } from "react";
import { Link } from "react-router";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { displayText } from "@/lib/display";
import type { DocId, GlossaryEntry } from "@/content/types";

export type GlossaryTermProps = {
  entry: GlossaryEntry;
  docId: DocId;
  /** Defaults to the entry's term as printed. */
  children?: ReactNode;
};

// A popover rather than a hover tooltip so the definition is reachable by tap and keyboard.
export default function GlossaryTerm({ entry, docId, children }: GlossaryTermProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="cursor-help underline decoration-dotted underline-offset-4 hover:decoration-solid"
        >
          {children ?? entry.term}
        </button>
      </PopoverTrigger>
      <PopoverContent className="text-sm">
        <p className="font-semibold">{entry.term}</p>
        <p className="mt-1 text-muted-foreground">{displayText(entry.definition)}</p>
        <Link
          to={`/archive/${docId}/page/${entry.pdfPage}`}
          className="mt-2 inline-block text-primary underline-offset-2 hover:underline"
        >
          Source: page {entry.pdfPage}
        </Link>
      </PopoverContent>
    </Popover>
  );
}
