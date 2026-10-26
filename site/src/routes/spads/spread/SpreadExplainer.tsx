import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { spadsRecords } from "@/content/load";
import type { SpadsRecord } from "@/content/types";
import { pagePath } from "@/routes/archive/scanUrl";
import { cn } from "@/lib/utils";
import SpreadChart, { type Metric } from "./SpreadChart";
import SpreadControls from "./SpreadControls";
import SpreadTable from "./SpreadTable";
import {
  computeEtcPreset,
  computeSpread,
  ETC_DOLLARS,
  ETC_HOURS,
  MANUAL_PARAMS,
  PRESETS,
  SPADS_DOC,
  type PresetId,
  type SpreadParams,
} from "./presets";

const pill = (on: boolean) =>
  cn("rounded border px-3 py-1 text-sm", on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent");

export default function SpreadExplainer() {
  const [preset, setPreset] = useState<PresetId>("manual");
  const [params, setParams] = useState<SpreadParams>(MANUAL_PARAMS);
  const [metric, setMetric] = useState<Metric>("hours");
  const [record, setRecord] = useState<SpadsRecord | undefined>();

  useEffect(() => {
    let live = true;
    spadsRecords().then((all) => {
      if (live) setRecord(all?.find((r) => r.sysnum === "125" && r.wan === "3005"));
    });
    return () => {
      live = false;
    };
  }, []);

  const etc = useMemo(() => (record ? computeEtcPreset(record.months) : undefined), [record]);
  const custom = useMemo(() => computeSpread(params), [params]);

  const active = PRESETS.find((p) => p.id === preset);
  const rows = preset === "etc" ? etc?.rows : "rows" in custom ? custom.rows : undefined;
  const error = preset !== "etc" && "error" in custom ? custom.error : undefined;

  return (
    <section id="spread" aria-labelledby="spread-heading" className="space-y-4">
      <h2 id="spread-heading" className="font-mono text-xl font-semibold tracking-wide uppercase">
        Month spread
      </h2>
      <p className="max-w-prose text-sm text-muted-foreground">
        SPREAD turns a first and last month, each with hours and dollars, into a cumulative estimate for every month in between. Each
        monthly step is rounded on its own and added up, so the last month can land a little off its target.
      </p>

      <div role="group" aria-label="Presets" className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={preset === p.id}
            onClick={() => {
              setPreset(p.id);
              if (p.id === "manual") setParams(MANUAL_PARAMS);
            }}
            className={pill(preset === p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      {active && (
        <p className="text-sm">
          Printed example:{" "}
          <Link className="underline" to={pagePath(SPADS_DOC, active.fromPdf)}>
            PDF page {active.fromPdf}
          </Link>{" "}
          to{" "}
          <Link className="underline" to={pagePath(SPADS_DOC, active.toPdf)}>
            page {active.toPdf}
          </Link>
          .
        </p>
      )}

      {preset === "etc" ? (
        <div className="space-y-2 text-sm">
          <p>
            Status month MAY 84 for W.A. 3005 HAA (SYS 125): cumulative actuals are 698 hours and $32,046, and the remaining estimate is{" "}
            {ETC_HOURS} hours and ${ETC_DOLLARS.toLocaleString("en-US")}. The estimate at completion is actuals plus the remaining
            estimate: {etc?.eacHours ?? 998} hours and ${(etc?.eacDollars ?? 47500).toLocaleString("en-US")}.
          </p>
          <p className="text-muted-foreground">
            The MAY 84 spread resets from 1089 hours down to the actuals, then a normal spread runs through SEP 84, the end of the
            fiscal year. The dollar step of 3863.5 rounds up to 3864 four times, so SEP 84 prints 47502. The month after the spread,
            OCT 84, carries the exact estimate, 47500.
          </p>
        </div>
      ) : (
        <SpreadControls
          params={params}
          onChange={(next) => {
            setParams(next);
            setPreset("custom");
          }}
        />
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {rows && rows.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="min-w-0 space-y-2">
            <div role="group" aria-label="Chart metric" className="flex gap-2">
              {(["hours", "dollars"] as const).map((m) => (
                <button key={m} type="button" aria-pressed={metric === m} onClick={() => setMetric(m)} className={pill(metric === m)}>
                  {m === "hours" ? "Hours" : "Dollars"}
                </button>
              ))}
            </div>
            <SpreadChart rows={rows} metric={metric} />
          </div>
          <SpreadTable rows={rows} caption={`${rows.length} months, as the program prints them`} />
        </div>
      )}
    </section>
  );
}
