import { roundHalfAway } from './spread';

export interface Rate {
  /** Dollars per hour. */
  hourRate: number;
  /** Multiplier applied to material and ODC dollars. */
  odcRate: number;
}

/** Rates keyed by task letter, then four-digit fiscal year. */
export type RateTable = Record<string, Record<number, Rate>>;

export const RATES_NOTE =
  'The rate formula (budget dollars = hours x hour rate + ODC dollars x ODC rate) is printed in the CR-177949 rate table. ' +
  'Every printed rate is masked or marked as an example entry, so the rates used here are illustrative.';

export function lookupRate(table: RateTable, task: string, fiscalYear: number): Rate | null {
  return table[task]?.[fiscalYear] ?? null;
}

/** BUDGET DOLLARS = HRS X RATE + ODC.DOL X RATE, to whole dollars. */
export function budgetDollars(hours: number, odcDollars: number, rate: Rate): number {
  return roundHalfAway(hours * rate.hourRate + odcDollars * rate.odcRate);
}

/** A task's fixed base fee: its share of the fee pool by contract value, to cents. */
export function baseFee(contractValue: number, feePool: number, totalContract: number): number {
  if (totalContract === 0) return 0;
  return roundHalfAway((feePool * contractValue) / totalContract, 2);
}

/**
 * Base fees for every task at once. Shares are floored to the cent and the
 * leftover cents go to the largest remainders, so the column totals the fee
 * pool exactly; this is what the time table prints (task E gets 233.74 where
 * rounding alone gives 233.75).
 */
export function baseFees(contractValues: Record<string, number>, feePool: number): Record<string, number> {
  const entries = Object.entries(contractValues);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  const cents = largestRemainder(
    roundHalfAway(feePool * 100),
    entries.map(([, value]) => value),
    total,
  );
  return Object.fromEntries(entries.map(([task], i) => [task, cents[i] / 100]));
}

/**
 * Splits a whole-unit amount by weights: each share is floored and the
 * leftover units go to the largest remainders, ties to the later share.
 */
export function largestRemainder(amount: number, weights: number[], weightTotal?: number): number[] {
  const total = weightTotal ?? weights.reduce((sum, w) => sum + w, 0);
  if (total === 0) return weights.map(() => 0);
  const exact = weights.map((w) => (amount * w) / total);
  const shares = exact.map((x) => Math.floor(x));
  let left = amount - shares.reduce((sum, s) => sum + s, 0);
  const order = exact
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac || b.i - a.i);
  for (const { i } of order) {
    if (left <= 0) break;
    shares[i] += 1;
    left -= 1;
  }
  return shares;
}
