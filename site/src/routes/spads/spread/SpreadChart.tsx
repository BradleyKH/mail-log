import type { SpreadRow } from "@/spads/finance/spread";

export type Metric = "hours" | "dollars";

type Props = { rows: SpreadRow[]; metric: Metric };

const W = 640;
const H = 240;
const PAD = { l: 64, r: 16, t: 16, b: 32 };

export default function SpreadChart({ rows, metric }: Props) {
  const values = rows.map((r) => r[metric]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = W - PAD.l - PAD.r;
  const x = (i: number) => PAD.l + (rows.length > 1 ? (i / (rows.length - 1)) * innerW : innerW / 2);
  const y = (v: number) => PAD.t + (1 - (v - min) / span) * (H - PAD.t - PAD.b);
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const label = metric === "hours" ? "Cumulative EAC spread, hours" : "Cumulative EAC spread, dollars";
  const first = rows[0];
  const last = rows[rows.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="spread-chart-title spread-chart-desc" className="h-auto w-full">
      <title id="spread-chart-title">{label}</title>
      <desc id="spread-chart-desc">
        {`Line chart over ${rows.length} months, from ${first.month} at ${first[metric]} to ${last.month} at ${last[metric]}.`}
      </desc>
      <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} className="stroke-border" />
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={H - PAD.b} className="stroke-border" />
      <text x={PAD.l - 8} y={y(max) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
        {max}
      </text>
      <text x={PAD.l - 8} y={y(min) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
        {min}
      </text>
      <text x={PAD.l} y={H - 10} textAnchor="start" className="fill-muted-foreground text-[11px]">
        {first.month}
      </text>
      <text x={W - PAD.r} y={H - 10} textAnchor="end" className="fill-muted-foreground text-[11px]">
        {last.month}
      </text>
      <polyline points={points} fill="none" strokeWidth={2} strokeLinejoin="round" className="stroke-primary" />
      {values.map((v, i) => (
        <circle key={rows[i].month} cx={x(i)} cy={y(v)} r={3} className="fill-primary">
          <title>{`${rows[i].month}: ${v}`}</title>
        </circle>
      ))}
    </svg>
  );
}
