import { Link } from "react-router";
import AboutSection from "./AboutSection";

export default function AboutSpads() {
  return (
    <AboutSection title="What SPADS was">
      <p>
        The Scout Project generated large quantities of documents: engineering reports, drawings, analyses, procedures,
        specifications, and test results. They were filed by a code number that named a file cabinet and an approximate place within
        it, so retrieval required knowing that code in advance.
      </p>
      <p>
        The Scout Project Automatic Data System, SPADS, was developed as a single entry, multiple cross-reference filing system. The
        reports list its aims: fewer man hours to retrieve data from the files, quick retrieval during vehicle anomaly investigations,
        answers to inquiries from NASA Headquarters and outside agencies about a Scout vehicle, and relief for a rapidly growing storage
        problem. MAIL LOG was the portion that tracked correspondence, DIR reports, and drawings and engineering orders, written in
        FORTRAN for a PRIME 300 computer at Langley. Read the{" "}
        <Link to="/archive/cr-159065/page/12" className="underline underline-offset-4">
          preface as printed
        </Link>
        .
      </p>
      <p>
        By July 1985 SPADS had grown into a menu of 17 programs on a PRIME 750. Volume I of the 1985 manuals covers the Scout Project
        Office programs, among them mail correspondence, drawings, and parts information. Volume II covers the Contracts Analysis
        program for Scout financial analysis. In 1981 SPADS was extended to the Projects Directorate, whose programs, tracking
        configuration change requests among other things, are described in Volume III. See the{" "}
        <Link to="/archive/cr-177948/page/16" className="underline underline-offset-4">
          SPADS Main Menu as printed
        </Link>
        , or visit the <Link to="/spads" className="underline underline-offset-4">SPADS room</Link>.
      </p>
    </AboutSection>
  );
}
