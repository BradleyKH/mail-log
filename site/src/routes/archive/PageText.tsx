import { useMemo } from "react";
import { getGlossary } from "@/content/load";
import type { Page, RoutineEntry } from "@/content/types";
import { createAnnotator, stepContext, type Segment } from "./annotate";
import ListingBlock from "./ListingBlock";
import { parseBody, type BodyBlock } from "./parseBody";
import ProseParagraph from "./ProseParagraph";
import TextBlock from "./TextBlock";

type Prepared = BodyBlock | { type: "annotated"; segments: Segment[] };

/** The page's text: prose with glossary and step links, terminal output verbatim, listings linked to the Code room. */
export default function PageText({ page, routines }: { page: Page; routines: RoutineEntry[] }) {
  const steps = page.docId === "cr-159065" ? stepContext(page.sectionId) : undefined;

  const blocks = useMemo<Prepared[]>(() => {
    const annotate = createAnnotator({ steps: steps !== undefined, glossary: getGlossary(page.docId) });
    return parseBody(page.body).map((b): Prepared => (b.type === "prose" ? { type: "annotated", segments: annotate(b.text) } : b));
  }, [page.body, page.docId, steps]);

  if (blocks.length === 0) return <p className="text-sm text-muted-foreground">This page is blank in the original.</p>;

  return (
    <div className="space-y-4 text-[15px] leading-7">
      {blocks.map((b, i) => {
        if (b.type === "annotated") return <ProseParagraph key={i} segments={b.segments} docId={page.docId} steps={steps} />;
        if (b.type === "code" && b.lang === "fortran") return <ListingBlock key={i} code={b.code} routines={routines} />;
        if (b.type === "code") return <TextBlock key={i} code={b.code} />;
        return null;
      })}
    </div>
  );
}
