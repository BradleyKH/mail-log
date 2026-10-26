import { displayText } from "@/lib/display";

export default function FilePopover({ unit, access }: { unit: string; access: { routine: string; mode: string; purpose: string | null }[] }) {
  const purpose = access.find((a) => a.purpose)?.purpose;
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-xs tracking-wider uppercase">
        <span data-testid="map-popover-title" className="font-semibold">
          {unit}
        </span>
        <span className="text-muted-foreground"> data file, {access.length} routines</span>
      </p>
      {purpose && <p className="text-xs text-muted-foreground">{displayText(purpose)}</p>}
      <p className="font-mono text-[11px]">{access.slice(0, 6).map((a) => `${a.routine} (${a.mode})`).join(", ")}</p>
    </div>
  );
}
