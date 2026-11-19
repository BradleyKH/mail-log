import { Link } from "react-router";
import { pagePath } from "@/routes/archive/scanUrl";
import CiteLinks from "./CiteLinks";
import SpadsMenuMap from "./SpadsMenuMap";
import { overviewFacts, partsTransferIntro, partsTransfers } from "./overviewData";

export default function SpadsOverview() {
  return (
    <section className="space-y-6">
      <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">What SPADS became</h1>
      <p className="text-muted-foreground">
        MAIL LOG was one part of SPADS, the Scout Project Automatic Data System. By 1985, six years after the MAIL LOG reports, SPADS
        had grown into 17 programs, and three new operating manuals described them. These pages follow the system into those manuals:
        what it had become, what happened to MAIL LOG, and one of the new programs, Contract Analysis, running again in its own
        terminal.
      </p>
      <p>
        In July 1985 SPADS ran on a PRIME 750. Three User&apos;s Operating Procedures volumes describe it: Volume I the Scout Project
        Office programs, Volume II Contract Analysis, and Volume III the Projects Directorate programs.
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
        <h2 className="font-mono text-sm font-semibold tracking-wide uppercase">Parts transfers in the Motor file</h2>
        <p>
          {partsTransferIntro.text} <CiteLinks cite={partsTransferIntro.cite} />
        </p>
        <ul className="list-disc space-y-1 pl-6">
          {partsTransfers.map((t) => (
            <li key={t.sectionId}>
              <Link to={`/reports/cr-177948/section/${t.sectionId}`} className="underline underline-offset-4">
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
