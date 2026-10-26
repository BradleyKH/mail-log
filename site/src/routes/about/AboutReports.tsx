import { Link } from "react-router";
import { listDocs } from "@/content/load";
import AboutSection from "./AboutSection";

export default function AboutReports() {
  return (
    <AboutSection title="The seven reports">
      <p>
        MAIL LOG was documented in four NASA contractor reports dated May 1979, each credited to Danny K. Harris of Vought Corporation,
        Hampton Technical Center, Hampton, Virginia, under NASA contract NAS1-13500. The operating instructions&apos; cover carries a
        legend limiting early domestic dissemination, struck through on this copy, and gives May 1981 as the date for general release.
      </p>
      <p>
        The site also holds the three SPADS User&apos;s Operating Procedures manuals of July 1985 (NASA CR-177948, CR-177949, and
        CR-177950), prepared by PRC Kentron, Inc. under NASA contract NAS1-18000. They document the programs SPADS had grown into six
        years after MAIL LOG, and are the only 1985 material here.
      </p>
      <ul className="divide-y divide-border rounded-md border border-border">
        {listDocs().map((d) => (
          <li key={d.docId} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-3">
            <div>
              <Link to={`/archive/${d.docId}`} className="font-medium underline underline-offset-4">
                {d.title}
              </Link>
              <div className="font-mono text-xs text-muted-foreground">
                {d.reportNumber}, {d.pageCount} pages
              </div>
            </div>
            <a
              href={`https://ntrs.nasa.gov/citations/${d.ntrsId}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm underline underline-offset-4"
            >
              NTRS {d.ntrsId}
            </a>
          </li>
        ))}
      </ul>
    </AboutSection>
  );
}
