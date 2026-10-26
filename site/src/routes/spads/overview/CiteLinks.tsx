import { Link } from "react-router";
import { pagePath } from "@/routes/archive/scanUrl";
import { citeLabel, type Cite } from "./overviewData";

export default function CiteLinks({ cite }: { cite: Cite }) {
  return (
    <span className="font-mono text-xs text-muted-foreground">
      (
      <Link to={pagePath(cite.docId, cite.pdfPage)} className="underline underline-offset-4">
        {citeLabel(cite)}
      </Link>
      {cite.sectionId && (
        <>
          {", "}
          <Link to={`/archive/${cite.docId}/section/${cite.sectionId}`} className="underline underline-offset-4">
            {`section ${cite.sectionId}`}
          </Link>
        </>
      )}
      )
    </span>
  );
}
