import { Link } from "react-router";

export default function HomeIntro() {
  return (
    <section className="space-y-4">
      <h2 className="font-mono text-xl font-semibold tracking-wide uppercase">The story</h2>
      <p>
        Danny K. Harris went to work at NASA&apos;s Langley Research Center in 1978 as a programmer for Scout, a four-stage rocket that
        sent small payloads into space. The Scout Project Office generated large quantities of documents: engineering reports,
        drawings, analyses, procedures, specifications, and test results. They were filed by a code number that named a file cabinet
        and a place within it, so finding one meant knowing its code in advance.
      </p>
      <p>
        SPADS, the Scout Project Automatic Data System, replaced the cabinets with a single entry, multiple cross-reference filing
        system. MAIL LOG was its part for correspondence, reports, and engineering drawings, so a document could be found by author,
        subject, or date. It ran on a PRIME 300 computer at Langley, and in May 1979 its documentation was published as four NASA
        contractor reports. Read the{" "}
        <Link to="/archive/cr-159065/page/12" className="underline underline-offset-4">
          preface as printed
        </Link>
        .
      </p>
      <p>
        By July 1985 SPADS had grown into a menu of 17 programs on a PRIME 750, covering contracts and finance, parts, and the wider
        Projects Directorate. Three operating manuals from that year, also part of this archive, show the same office six years on. The
        Charleston Gazette-Mail reported in 2001 that his financial and inventory programs saved the government $12 million.
      </p>
      <p>
        <Link to="/about" className="underline underline-offset-4">
          More about Danny, the reports, and how this site was made
        </Link>
        .
      </p>
    </section>
  );
}
