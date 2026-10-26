import { Link } from "react-router";
import type { RoutineEntry } from "@/content/types";
import { displayText } from "@/lib/display";
import { routineHref } from "./codeLinks";

export default function RoutineRow({ routine }: { routine: RoutineEntry }) {
  return (
    <li className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
      <Link to={routineHref(routine.id)} className="w-44 shrink-0 font-mono font-semibold text-primary underline-offset-2 hover:underline">
        {routine.id}
      </Link>
      <span className="min-w-0 flex-1 text-sm text-muted-foreground">
        <span className="line-clamp-2">{displayText(routine.description ?? `${routine.kind} in Appendix ${routine.appendix}`)}</span>
      </span>
      <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">{routine.lines} lines</span>
    </li>
  );
}
