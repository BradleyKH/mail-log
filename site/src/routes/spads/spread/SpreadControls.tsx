import type { ChangeEvent, ReactNode } from "react";
import type { SpreadParams } from "./presets";

type Props = { params: SpreadParams; onChange(next: SpreadParams): void; disabled?: boolean };

type NumKey = "firstHours" | "firstDollars" | "lastHours" | "lastDollars" | "hoursPct" | "dollarsPct";

const inputClass = "w-full rounded border border-input bg-background px-2 py-1 font-mono text-sm disabled:opacity-60";

const shown = (n: number) => (Number.isNaN(n) ? "" : n);

function field(label: string, input: ReactNode) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-xs text-muted-foreground">
      {label}
      {input}
    </label>
  );
}

export default function SpreadControls({ params, onChange, disabled }: Props) {
  const text = (key: "first" | "last") => (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...params, [key]: e.target.value.toUpperCase() });
  const num = (key: NumKey) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...params, [key]: e.target.value === "" ? NaN : Number(e.target.value) });
  const numberInput = (key: NumKey) => (
    <input className={inputClass} type="number" value={shown(params[key])} onChange={num(key)} />
  );

  return (
    <fieldset disabled={disabled} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <legend className="sr-only">Spread inputs</legend>
      {field("First month", <input className={inputClass} value={params.first} onChange={text("first")} placeholder="AUG75" />)}
      {field("Last month", <input className={inputClass} value={params.last} onChange={text("last")} placeholder="DEC76" />)}
      {field("First hours", numberInput("firstHours"))}
      {field("First dollars", numberInput("firstDollars"))}
      {field("Last hours", numberInput("lastHours"))}
      {field("Last dollars", numberInput("lastDollars"))}
      <div role="group" aria-label="Spread type" className="col-span-2 flex items-center gap-3 text-sm">
        {(["Normal", "Abnormal"] as const).map((label) => {
          const abnormal = label === "Abnormal";
          return (
            <label key={label} className="flex items-center gap-1">
              <input
                type="radio"
                name="spread-type"
                checked={params.abnormal === abnormal}
                onChange={() => onChange({ ...params, abnormal })}
              />
              {label}
            </label>
          );
        })}
      </div>
      {params.abnormal && (
        <>
          {field("First-half % of hours", numberInput("hoursPct"))}
          {field("First-half % of dollars", numberInput("dollarsPct"))}
        </>
      )}
    </fieldset>
  );
}
