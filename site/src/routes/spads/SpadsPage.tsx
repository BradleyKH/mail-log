import { Link } from "react-router";
import MailLog1985 from "./overview/MailLog1985";
import SpadsOverview from "./overview/SpadsOverview";
import ReportGallery from "./reports/ReportGallery";
import SpreadExplainer from "./spread/SpreadExplainer";
import SpadsTerminal from "./terminal/SpadsTerminal";

const JUMPS = [
  ["#overview", "What SPADS became"],
  ["#mail-log-1985", "MAIL LOG in 1985"],
  ["#contract-analysis", "Contract Analysis"],
  ["#terminal", "Terminal"],
  ["#spread", "Month spread"],
  ["#reports", "Reports"],
] as const;

export default function SpadsPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">SPADS</h1>
        <p className="text-muted-foreground">
          MAIL LOG was one part of SPADS, the Scout Project Automatic Data System. By 1985, six years after the MAIL LOG reports, SPADS
          had grown into 17 programs, and three new operating manuals described them. This page follows the system into those
          manuals: what it had become, what happened to MAIL LOG, and one of the new programs, Contract Analysis, running again in its
          own terminal.
        </p>
        <nav aria-label="On this page">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm">
            {JUMPS.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="underline underline-offset-4 hover:text-foreground">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <div id="overview" className="scroll-mt-20">
        <SpadsOverview />
      </div>
      <div className="scroll-mt-20">
        <MailLog1985 />
      </div>
      <section id="contract-analysis" aria-labelledby="contract-analysis-heading" className="scroll-mt-20 space-y-10">
        <div className="space-y-3">
          <h2 id="contract-analysis-heading" className="font-mono text-xl font-semibold tracking-wide uppercase">
            Contract Analysis
          </h2>
          <p>
            Contract Analysis was the Scout office&apos;s financial program, documented in Volume II of the 1985 manuals. It tracked hours
            and dollars, budgets, and estimates to complete for each work authorization on a contract. This is a different program from
            MAIL LOG: the{" "}
            <Link to="/terminal" className="underline underline-offset-4">
              Terminal page
            </Link>{" "}
            runs the 1979 MAIL LOG, and the terminal below runs Contract Analysis for contract NAS1-16200, using the sample data the
            manual prints.
          </p>
        </div>
        <section id="terminal" aria-labelledby="terminal-heading" className="scroll-mt-20 space-y-4">
          <h3 id="terminal-heading" className="font-mono text-lg font-semibold tracking-wide uppercase">
            Terminal
          </h3>
          <SpadsTerminal />
        </section>
        <div className="scroll-mt-20">
          <SpreadExplainer />
        </div>
        <section id="reports" aria-labelledby="reports-heading" className="scroll-mt-20 space-y-4">
          <h3 id="reports-heading" className="font-mono text-lg font-semibold tracking-wide uppercase">
            Reports
          </h3>
          <ReportGallery />
        </section>
      </section>
    </div>
  );
}
