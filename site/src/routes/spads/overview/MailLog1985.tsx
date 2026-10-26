import { Link } from "react-router";
import CiteLinks from "./CiteLinks";
import MailLogCompare from "./MailLogCompare";
import { mailLogIntro1985 } from "./overviewData";

export default function MailLog1985() {
  return (
    <section id="mail-log-1985" className="space-y-6">
      <h2 className="font-mono text-xl font-semibold tracking-wide uppercase">MAIL LOG in 1985</h2>
      <p>
        SPADS in 1985 still tracked correspondence, through a Mail Log program on its Main Menu (option 9) and a second Mail Log program
        for the Projects Directorate. Here they sit beside the 1979 MAIL LOG.
      </p>
      <ul className="space-y-3">
        {mailLogIntro1985.map((fact) => (
          <li key={fact.text}>
            {fact.text} <CiteLinks cite={fact.cite} />
          </li>
        ))}
      </ul>
      <MailLogCompare />
      <p className="text-sm">
        Try the 1979 program in the{" "}
        <Link to="/terminal" className="underline underline-offset-4">
          terminal
        </Link>{" "}
        or read its report,{" "}
        <Link to="/archive/cr-159065" className="underline underline-offset-4">
          CR-159065
        </Link>
        .
      </p>
    </section>
  );
}
