import CiteLinks from "./CiteLinks";
import { compareRows, type Fact } from "./overviewData";

function factItems(facts: Fact[]) {
  if (facts.length === 0) return <p className="text-sm text-muted-foreground">Not described.</p>;
  return facts.map((f) => (
    <p key={f.text} className="text-sm">
      {f.text} <CiteLinks cite={f.cite} />
    </p>
  ));
}

export default function MailLogCompare() {
  return (
    <div className="space-y-4">
      <div className="hidden gap-4 px-3 font-mono text-xs font-semibold tracking-wide uppercase md:grid md:grid-cols-2">
        <div>MAIL LOG, 1979</div>
        <div>Mail Log in the 1985 manuals</div>
      </div>
      {compareRows.map((row) => (
        <div key={row.topic} className="rounded-md border bg-card p-3">
          <h3 className="mb-2 font-mono text-sm font-semibold">{row.topic}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold tracking-wide uppercase md:hidden">MAIL LOG, 1979</div>
              {factItems(row.y1979)}
            </div>
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold tracking-wide uppercase md:hidden">Mail Log in the 1985 manuals</div>
              <div className="font-mono text-xs text-muted-foreground">Volume I</div>
              {factItems(row.vol1)}
              {row.vol3.length > 0 && (
                <>
                  <div className="font-mono text-xs text-muted-foreground">Volume III</div>
                  {factItems(row.vol3)}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
