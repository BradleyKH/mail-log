import MailLog1985 from "./overview/MailLog1985";
import SpadsOverview from "./overview/SpadsOverview";
import ReportGallery from "./reports/ReportGallery";
import SpreadExplainer from "./spread/SpreadExplainer";
import SpadsTerminal from "./terminal/SpadsTerminal";

const JUMPS = [
  ["#terminal", "Terminal"],
  ["#spread", "Month spread"],
  ["#reports", "Reports"],
  ["#mail-log-1985", "MAIL LOG in 1985"],
] as const;

export default function SpadsPage() {
  return (
    <div className="max-w-6xl space-y-12">
      <header className="space-y-3">
        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">SPADS</h1>
        <p className="max-w-3xl text-muted-foreground">
          Six years after MAIL LOG, the Scout Project Office's financial and project programs, as the 1985 SPADS manuals describe them,
          with a working Contract Analysis terminal for contract NAS1-16200.
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
      <SpadsOverview />
      <section id="terminal" aria-labelledby="terminal-heading" className="scroll-mt-20 space-y-4">
        <h2 id="terminal-heading" className="font-mono text-xl font-semibold tracking-wide uppercase">
          Contract Analysis terminal
        </h2>
        <SpadsTerminal />
      </section>
      <div className="scroll-mt-20">
        <SpreadExplainer />
      </div>
      <section id="reports" aria-labelledby="reports-heading" className="scroll-mt-20 space-y-4">
        <h2 id="reports-heading" className="font-mono text-xl font-semibold tracking-wide uppercase">
          Reports
        </h2>
        <ReportGallery />
      </section>
      <MailLog1985 />
    </div>
  );
}
