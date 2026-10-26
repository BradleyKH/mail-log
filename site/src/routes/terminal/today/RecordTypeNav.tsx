import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { RECORD_TYPES } from "@/terminal/programData";
import type { RecordType } from "@/terminal/types";
import { RECORD_LABELS } from "./todayModel";

type Props = { record: RecordType };

export default function RecordTypeNav({ record }: Props) {
  return (
    <nav aria-label="Record types" className="flex gap-1 overflow-x-auto lg:flex-col">
      {RECORD_TYPES.map((r) => (
        <Link
          key={r}
          to={`/terminal?view=today&record=${r}`}
          aria-current={r === record ? "page" : undefined}
          className={cn(
            "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
            r === record ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          )}
        >
          {RECORD_LABELS[r].nav}
        </Link>
      ))}
    </nav>
  );
}
