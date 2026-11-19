import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type PageView = "text" | "scan";

type Props = { value: PageView; onChange: (v: PageView) => void };

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
    </ToggleGroup>
  );
}
