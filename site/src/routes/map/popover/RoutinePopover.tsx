import type { RoutineEntry } from "@/content/types";
import { displayText } from "@/lib/display";
import { GROUP_LABELS } from "../graph/labels";
import { useRoutineComments } from "../useRoutineComments";

export default function RoutinePopover({ routine }: { routine: RoutineEntry }) {
  const comments = useRoutineComments(routine.id);
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-xs tracking-wider uppercase">
        <span data-testid="map-popover-title" className="font-semibold">
          {routine.name}
        </span>
        <span className="text-muted-foreground">
          {" "}
          {GROUP_LABELS[routine.record]}, {routine.lines} lines
        </span>
      </p>
      {routine.description && (
        <p data-testid="map-routine-description" className="line-clamp-4 text-xs text-muted-foreground">
          {displayText(routine.description)}
        </p>
      )}
      {comments && comments.length > 0 && (
        <pre tabIndex={0} className="overflow-x-auto rounded-sm bg-muted px-2 py-1 font-mono text-[11px] leading-snug whitespace-pre text-ink-faded">
          {comments.join("\n")}
        </pre>
      )}
    </div>
  );
}
