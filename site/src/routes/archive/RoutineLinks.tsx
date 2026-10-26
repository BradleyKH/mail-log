import { Link } from "react-router";
import type { RoutineEntry } from "@/content/types";

type Props = { routines: RoutineEntry[]; kind: "flowchart" | "listing" };

/** Links from a flowchart or listing page to its routine in the Code room. */
export default function RoutineLinks({ routines, kind }: Props) {
  if (routines.length === 0) return null;
  return (
    <p className="text-sm">
      {kind === "flowchart" ? "Flowchart for " : "Listing of "}
      {routines.map((r, i) => (
        <span key={r.id}>
          {i > 0 && ", "}
          <Link to={`/code/${encodeURIComponent(r.id)}`} className="font-mono font-medium text-primary underline-offset-2 hover:underline">
            {r.name}
          </Link>
        </span>
      ))}
      . Open it in the Code room.
    </p>
  );
}
