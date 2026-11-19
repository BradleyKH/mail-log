import { Link } from "react-router";
import { archivePageHref } from "./codeLinks";

const linkClass = "text-primary underline underline-offset-2";

export default function CodeIntro() {
  return (
    <div className="space-y-3 leading-relaxed">
      <p>
        The program is written in FORTRAN IV for the PRIME 300 computer system in Building 1192-E at NASA Langley Research Center. The
        machine is a 16-bit minicomputer with 64K words of virtual memory and 256K words of physical memory, backed by a 60 megabyte disk
        and tape backup (
        <Link className={linkClass} to={archivePageHref("cr-159063", 15)}>
          Volume I, introduction
        </Link>
        ;{" "}
        <Link className={linkClass} to={archivePageHref("cr-159066", 21)}>
          Summary and Specifications
        </Link>
        ).
      </p>
      <p>
        The flowcharts use standard IBM symbols, and each subroutine's chart is identified by its figure number; the{" "}
        <Link className={linkClass} to={archivePageHref("cr-159063", 18)}>
          flowchart conventions
        </Link>{" "}
        explain the rest. His comment cards narrate the program as it runs, so read them in the source.
      </p>
    </div>
  );
}
