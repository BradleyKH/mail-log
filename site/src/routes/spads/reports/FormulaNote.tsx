import { Badge } from "@/components/ui/badge";
import type { FormulaSpec } from "./reportNotes";

const BASIS_LABEL = {
  stated: "stated in the manual",
  reconstructed: "reconstructed from the printout",
} as const;

export default function FormulaNote({ formula }: { formula: FormulaSpec }) {
  return (
    <div className="space-y-2 rounded-md border border-border bg-muted/40 p-3" data-testid="formula-note">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-mono text-sm font-semibold">{formula.name}</h4>
        <Badge variant={formula.basis === "stated" ? "default" : "outline"}>{BASIS_LABEL[formula.basis]}</Badge>
      </div>
      <p className="font-mono text-sm break-words">{formula.expression}</p>
      <p className="text-sm text-muted-foreground">Checked on: {formula.evidence}</p>
    </div>
  );
}
