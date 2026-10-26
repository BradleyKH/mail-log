import { useSearchParams } from "react-router";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Props = { view: "1979" | "today" };

/** Switches between the original terminal and the modern view; the record type stays, the step does not carry over. */
export default function ViewToggle({ view }: Props) {
  const [, setParams] = useSearchParams();
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="lg"
      value={view}
      aria-label="Interface"
      onValueChange={(next) => {
        if (!next || next === view) return;
        setParams((p) => {
          const out = new URLSearchParams(p);
          out.set("view", next);
          out.delete("step");
          return out;
        });
      }}
    >
      <ToggleGroupItem value="1979" className="px-5 font-mono">
        1979
      </ToggleGroupItem>
      <ToggleGroupItem value="today" className="px-5">
        Today
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
