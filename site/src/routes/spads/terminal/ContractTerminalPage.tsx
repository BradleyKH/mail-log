import { Link } from "react-router";
import SpadsTerminal from "./SpadsTerminal";

export default function ContractTerminalPage() {
  return (
    <section aria-labelledby="contract-analysis-heading" className="space-y-6">
      <div className="space-y-3">
        <h1 id="contract-analysis-heading" className="font-mono text-3xl font-semibold tracking-wide uppercase">
          Contract Analysis Terminal
        </h1>
        <p>
          Contract Analysis was the Scout office&apos;s financial program, documented in Volume II of the 1985 manuals. It tracked hours
          and dollars, budgets, and estimates to complete for each work authorization on a contract. This is a different program from
          MAIL LOG: the{" "}
          <Link to="/terminal" className="underline underline-offset-4">
            Terminal page
          </Link>{" "}
          runs the 1979 MAIL LOG, and the terminal below runs Contract Analysis for contract NAS1-16200, using the sample data the
          manual prints. Its{" "}
          <Link to="/spads/spread-reports" className="underline underline-offset-4">
            month spread and reports
          </Link>{" "}
          have a page of their own.
        </p>
      </div>
      <SpadsTerminal />
    </section>
  );
}
