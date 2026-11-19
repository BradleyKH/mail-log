import { Link } from "react-router";
import ReportGallery from "./reports/ReportGallery";
import SpreadExplainer from "./spread/SpreadExplainer";

export default function SpreadReportsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">Month Spread and Reports</h1>
        <p>
          Two parts of Contract Analysis up close: the routine that spreads an estimate across its months, and the reports the program
          printed. Both use the NAS1-16200 sample data that the{" "}
          <Link to="/spads/terminal" className="underline underline-offset-4">
            Contract Analysis terminal
          </Link>{" "}
          runs on.
        </p>
      </header>
      <div className="scroll-mt-20">
        <SpreadExplainer />
      </div>
      <section id="reports" aria-labelledby="reports-heading" className="scroll-mt-20 space-y-4">
        <h2 id="reports-heading" className="font-mono text-xl font-semibold tracking-wide uppercase">
          Reports
        </h2>
        <ReportGallery />
      </section>
    </div>
  );
}
