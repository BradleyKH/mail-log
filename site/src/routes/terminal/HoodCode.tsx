import { Link } from "react-router";
import FortranBlock from "@/components/shared/FortranBlock";
import { displayText } from "@/lib/display";
import type { HoodMatch } from "@/terminal/hood";
import { useExcerpt } from "./useHood";

const codeHref = (routine: string, seq: string) => `/code/${encodeURIComponent(routine)}?line=${seq}`;

/** The routine that prints the current prompt, with its matching FORTRAN line highlighted. */
export default function HoodCode({ match }: { match: HoodMatch }) {
  const lines = useExcerpt(match.routine, match.line);
  return (
    <div className="space-y-2">
      <p className="text-sm">
        Printed by{" "}
        <Link to={codeHref(match.routine, match.seq)} className="font-mono font-semibold text-primary underline-offset-2 hover:underline">
          {match.name}
        </Link>{" "}
        at line <span className="font-mono">{match.seq}</span>
      </p>
      {match.description && <p className="line-clamp-3 text-sm text-muted-foreground">{displayText(match.description)}</p>}
      {lines ? (
        <div data-hood-excerpt>
          <FortranBlock
            lines={lines}
            highlightId={match.line}
            scroll="block"
            lineHref={(id) => codeHref(match.routine, id.split(".")[0])}
            className="text-[12px]"
          />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Loading the listing...</p>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <Link to={codeHref(match.routine, match.seq)} className="text-primary underline-offset-2 hover:underline">
          Read {match.name} in the Code room
        </Link>
        <Link to={`/map?layer=code&routine=${encodeURIComponent(match.routine)}`} className="text-primary underline-offset-2 hover:underline">
          See it on the Map
        </Link>
      </div>
    </div>
  );
}
