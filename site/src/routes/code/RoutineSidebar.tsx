import { Link } from "react-router";
import { getFlow } from "@/content/load";
import type { RecordType, RoutineEntry } from "@/content/types";
import { displayText } from "@/lib/display";
import { RECORD_LABELS, archivePageHref, mapCodeHref, mapManualHref, routineHref, terminalHref, type CodeData } from "./codeLinks";
import SidebarSection from "./SidebarSection";

const link = "text-primary underline underline-offset-2";
const none = <p className="text-sm text-muted-foreground">None</p>;

export default function RoutineSidebar({ entry, data }: { entry: RoutineEntry; data: CodeData }) {
  const steps = data.xref?.routineToSteps.find((r) => r.routine === entry.id)?.steps ?? [];
  const externals = new Map(data.index.externals.map((e) => [e.name, e]));
  const calls = new Map(entry.calls.map((c) => [c.name, c]));

  return (
    <aside className="space-y-5 text-sm" aria-label="Routine details">
      <SidebarSection title="Calls">
        {calls.size === 0
          ? none
          : (
            <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono">
              {[...calls.values()].map((c) => {
                const ext = externals.get(c.name);
                return (
                  <li key={c.name}>
                    {c.kind === "routine" ? (
                      <Link to={routineHref(c.target ?? c.name, c.lines[0])} className={link}>
                        {c.target ?? c.name}
                      </Link>
                    ) : ext ? (
                      <Link to={archivePageHref("cr-159063", ext.pdfPage)} className={link} title="External routine, described in Volume I">
                        {c.name}
                      </Link>
                    ) : (
                      <span title="Not listed in the report">{c.name}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
      </SidebarSection>

      <SidebarSection title="Called by">
        {entry.calledBy.length === 0 ? (
          none
        ) : (
          <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono">
            {entry.calledBy.map((id) => (
              <li key={id}>
                <Link to={routineHref(id)} className={link}>
                  {id}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SidebarSection>

      <SidebarSection title="COMMON blocks">
        {entry.commons.length === 0 ? none : <p className="font-mono">{entry.commons.join(", ")}</p>}
      </SidebarSection>

      <SidebarSection title="Files">
        {entry.files.length === 0 ? (
          none
        ) : (
          <ul className="space-y-1">
            {entry.files.map((f, i) => (
              <li key={i}>
                <span className="font-mono">
                  {f.kind} {f.unit}
                </span>{" "}
                <span className="text-muted-foreground">({f.mode})</span>
                {f.purpose && <span className="block text-muted-foreground">{displayText(f.purpose)}</span>}
              </li>
            ))}
          </ul>
        )}
      </SidebarSection>

      <SidebarSection title="Manual steps served">
        {steps.length === 0 ? (
          none
        ) : (
          <ul className="space-y-2">
            {steps.slice(0, 8).map((s) => {
              const step = getFlow(s.record as RecordType)?.steps.find((x) => x.n === s.step);
              return (
                <li key={`${s.record}-${s.step}`}>
                  <span className="block">
                    {RECORD_LABELS[s.record]}, step {s.step}
                    {step?.title && <span className="text-muted-foreground">: {displayText(step.title)}</span>}
                  </span>
                  <span className="flex gap-3">
                    {step && (
                      <Link to={archivePageHref("cr-159065", step.pdfPage)} className={link}>
                        Archive
                      </Link>
                    )}
                    <Link to={terminalHref(s.record, s.step)} className={link}>
                      Terminal
                    </Link>
                    <Link to={mapManualHref(s.record, s.step)} className={link}>
                      Map
                    </Link>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </SidebarSection>

      <SidebarSection title="Prompts printed">
        {entry.prompts.length === 0 ? (
          none
        ) : (
          <ul className="space-y-1">
            {entry.prompts.map((p, i) => (
              <li key={`${p.line}-${i}`}>
                <Link to={routineHref(entry.id, p.line)} className="font-mono text-xs break-words hover:underline">
                  {displayText(p.text)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SidebarSection>

      <Link to={mapCodeHref(entry.id)} className={link}>
        Show on the Map
      </Link>
    </aside>
  );
}
