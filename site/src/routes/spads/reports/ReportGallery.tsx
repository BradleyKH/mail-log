import { useEffect, useMemo, useState } from "react";
import { getSections, spadsReports } from "@/content/load";
import type { SpadsReport } from "@/content/types";
import ReportCard from "./ReportCard";
import ReportDetail from "./ReportDetail";
import { reportNotes } from "./reportNotes";

export default function ReportGallery() {
  const [reports, setReports] = useState<SpadsReport[] | undefined>();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const sections = useMemo(() => getSections("cr-177949"), []);

  useEffect(() => {
    let live = true;
    void spadsReports().then((r) => {
      if (live) setReports(r ?? []);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!reports) return <p className="text-muted-foreground">Loading reports...</p>;

  const selected = reports.find((r) => r.id === selectedId);
  if (selected) {
    const note = reportNotes[selected.id];
    return (
      <ReportDetail
        report={selected}
        note={note}
        section={sections.find((s) => s.id === note?.sectionId)}
        onBack={() => setSelectedId(undefined)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        {reports.length} sample reports from the Vol. II appendices. Open one to see the printout, the formulas worked out
        from it, and the checks run against its totals.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="report-grid">
        {reports.map((r) => (
          <ReportCard key={r.id} report={r} note={reportNotes[r.id]} onOpen={setSelectedId} />
        ))}
      </div>
    </div>
  );
}
