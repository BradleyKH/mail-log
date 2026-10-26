import { cn } from "@/lib/utils";

const BAUD_RATES = [300, 1200, 0] as const;

type Props = { value: number; onChange(baud: number): void; disabled?: boolean };

export default function BaudControl({ value, onChange, disabled }: Props) {
  return (
    <div role="group" aria-label="Printing speed" className="flex items-center gap-1 text-xs">
      <span className="mr-1 text-muted-foreground">Speed</span>
      {BAUD_RATES.map((b) => (
        <button
          key={b}
          type="button"
          disabled={disabled}
          aria-pressed={value === b}
          onClick={() => onChange(b)}
          className={cn(
            "rounded border px-2 py-0.5 font-mono disabled:opacity-50",
            value === b ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent",
          )}
        >
          {b === 0 ? "Instant" : `${b} baud`}
        </button>
      ))}
    </div>
  );
}
