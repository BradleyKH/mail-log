import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type PageView = "text" | "scan" | "both";

type Props = { value: PageView; onChange: (v: PageView) => void };

/** Text only, scan only, or both; side by side needs the width of a desktop, so "Both" is hidden on small screens. */
export default function ViewToggle({ value, onChange }: Props) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={value}
      onValueChange={(v) => v && onChange(v as PageView)}
      aria-label="Page view"
    >
      <ToggleGroupItem value="text">Text</ToggleGroupItem>
      <ToggleGroupItem value="scan">Scan</ToggleGroupItem>
      <ToggleGroupItem value="both" className="hidden lg:inline-flex">
        Both
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
