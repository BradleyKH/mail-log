import { Link } from "react-router";
import { pagePath } from "@/routes/archive/scanUrl";
import CiteLinks from "./CiteLinks";
import SpadsMenuMap from "./SpadsMenuMap";
import { overviewFacts, partsTransferIntro, partsTransfers } from "./overviewData";

export default function SpadsOverview() {
  return (
    <section className="space-y-6">
      <h2 className="font-mono text-xl font-semibold tracking-wide uppercase">SPADS in 1985</h2>
      <p>
        In July 1985 the Scout Project Automatic Data System ran on a PRIME 750. Three User&apos;s Operating Procedures volumes describe
        it.
      </p>
      <ul className="space-y-3">
        {overviewFacts.map((fact) => (
          <li key={fact.text}>
            {fact.text} <CiteLinks cite={fact.cite} />
          </li>
        ))}
      </ul>
      <SpadsMenuMap />
      <div className="space-y-2">
        <h3 className="font-mono text-sm font-semibold tracking-wide uppercase">Parts transfers in the Motor file</h3>
        <p>
          {partsTransferIntro.text} <CiteLinks cite={partsTransferIntro.cite} />
        </p>
        <ul className="list-disc space-y-1 pl-6">
          {partsTransfers.map((t) => (
            <li key={t.sectionId}>
              <Link to={`/archive/cr-177948/section/${t.sectionId}`} className="underline underline-offset-4">
                {t.label}
              </Link>{" "}
              <Link to={pagePath("cr-177948", t.pdfPage)} className="font-mono text-xs text-muted-foreground underline underline-offset-4">
                {`(Vol. I p. ${t.pdfPage})`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
