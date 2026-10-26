// Fixtures are copied from the printouts in CR-177949 (SPADS Vol. II,
// Contract Analysis); PDF page numbers are noted on each block.
import { describe, expect, it } from 'vitest';
import {
  addMonths,
  error533,
  fiscalHalf,
  fiscalQuarter,
  fiscalYear,
  formatMonth,
  makeMonth,
  monthCount,
  parseMonth,
  quarter533,
  tryParseMonth,
} from './months';
import { manual, spread, spreadToRows, type MonthRow } from './spread';
import { etcUpdate, eacFromRates } from './etc';
import { baseFee, baseFees, budgetDollars, lookupRate, RATES_NOTE } from './rates';
import {
  balanceRow,
  COLUMNS_533,
  entireRecordPercents,
  jobOrderShare,
  percent,
  pop1,
  pop2,
  processingReport,
  programTotal,
  prorate,
  rollup533Cpff,
  rollup533Fpi,
  row533,
  taskSummaryRow,
  timePassed,
  timePassed2,
  totalContract533,
  varianceRow,
  waSummaryRow,
  type Input533,
  type Row533,
} from './reports';

type Cells = [string, number, number, number, number, number, number, number];
function rows(cells: Cells[]): MonthRow[] {
  return cells.map(([month, eacHours, eacDollars, actHours, actDollars, compHours, compDollars, cmaa]) => ({
    month,
    cmaa: cmaa ? String(cmaa) : '',
    eacHours,
    eacDollars,
    actHours,
    actDollars,
    compHours,
    compDollars,
  }));
}
const R = (month: string, ...v: number[]): Cells => [month, v[0], v[1], v[2], v[3], v[4], v[5], 0];

describe('months', () => {
  it('parses and formats both month styles', () => {
    const may84 = makeMonth(1984, 5);
    expect(parseMonth('MAY84')).toBe(may84);
    expect(parseMonth('MAY 84')).toBe(may84);
    expect(parseMonth('may 1984')).toBe(may84);
    expect(parseMonth('AUG75')).toBe(makeMonth(1975, 8));
    expect(formatMonth(may84)).toBe('MAY 84');
    expect(formatMonth(may84, 'compact')).toBe('MAY84');
    expect(tryParseMonth('305HAA')).toBeNull();
    expect(tryParseMonth('XYZ84')).toBeNull();
    expect(() => parseMonth('')).toThrow();
  });

  it('does month arithmetic across years', () => {
    expect(formatMonth(addMonths(parseMonth('DEC76'), 1))).toBe('JAN 77');
    expect(monthCount(parseMonth('AUG75'), parseMonth('DEC76'))).toBe(17);
  });

  it('starts the fiscal year in October', () => {
    expect(fiscalYear(parseMonth('SEP84'))).toBe(1984);
    expect(fiscalYear(parseMonth('OCT84'))).toBe(1985);
    expect(fiscalYear(parseMonth('SEP85'))).toBe(1985);
    expect(fiscalQuarter(parseMonth('OCT84'))).toBe(1);
    expect(fiscalQuarter(parseMonth('DEC84'))).toBe(1);
    expect(fiscalQuarter(parseMonth('JAN85'))).toBe(2);
    expect(fiscalQuarter(parseMonth('JUN85'))).toBe(3);
    expect(fiscalQuarter(parseMonth('SEP85'))).toBe(4);
  });

  it('splits the fiscal year into POP1 (OCT to MAR) and POP2 (APR to SEP)', () => {
    expect(fiscalHalf(parseMonth('OCT84'))).toBe(1);
    expect(fiscalHalf(parseMonth('MAR85'))).toBe(1);
    expect(fiscalHalf(parseMonth('APR85'))).toBe(2);
    expect(fiscalHalf(parseMonth('SEP85'))).toBe(2);
  });

  it('maps 533 status months to quarters and rejects the rest (PDF 60 to 61)', () => {
    expect(quarter533(parseMonth('SEP84'))).toBe(1);
    expect(quarter533(parseMonth('DEC84'))).toBe(2);
    expect(quarter533(parseMonth('MAR85'))).toBe(3);
    expect(quarter533(parseMonth('JUN85'))).toBe(4);
    for (const m of ['JAN', 'FEB', 'APR', 'MAY', 'JUL', 'AUG', 'OCT', 'NOV']) {
      expect(quarter533(parseMonth(`${m}85`))).toBeNull();
    }
    expect(error533(parseMonth('OCT84'))).toBe('*** 533 REPORT CANNOT BE GENERATED FOR STATUS MONTH OCT ***');
  });
});

describe('spread (PDF 44 to 45)', () => {
  const abnormal = spread({
    first: 'AUG75',
    firstHours: 10,
    firstDollars: 1000,
    last: 'DEC76',
    lastHours: 100,
    lastDollars: 77000,
    abnormal: { hoursPct: 25, dollarsPct: 20 },
  });

  it('reproduces the abnormal spread, including the 98 hour drift', () => {
    expect(abnormal.map((r) => r.hours)).toEqual([10, 13, 16, 19, 22, 25, 28, 31, 34, 42, 50, 58, 66, 74, 82, 90, 98]);
    expect(abnormal.map((r) => r.dollars)).toEqual([
      1000, 2900, 4800, 6700, 8600, 10500, 12400, 14300, 16200, 23800, 31400, 39000, 46600, 54200, 61800, 69400, 77000,
    ]);
    expect(abnormal[0].month).toBe('AUG 75');
    expect(abnormal[16].month).toBe('DEC 76');
  });

  it('MANUALs DEC76 to 100 hours and deletes with ****', () => {
    const record = manual(spreadToRows(abnormal), 'DEC76', 100, 77000);
    expect(record).toHaveLength(17);
    expect(record[16]).toMatchObject({ month: 'DEC 76', eacHours: 100, eacDollars: 77000 });
    const deleted = manual(record, 'DEC 76', 0, 0, '****');
    expect(deleted).toHaveLength(16);
    expect(deleted.at(-1)?.month).toBe('NOV 76');
    const added = manual(deleted, 'JAN 77', 101, 78000);
    expect(added.at(-1)).toMatchObject({ month: 'JAN 77', eacHours: 101 });
  });

  it('normal spread rounds each increment (C-1, PDF 121, before its MANUAL final month)', () => {
    const normal = spread({ first: 'FEB82', firstHours: 0, firstDollars: 0, last: 'AUG82', lastHours: 124, lastDollars: 4976 });
    expect(normal.slice(0, 6).map((r) => [r.hours, r.dollars])).toEqual([
      [0, 0],
      [21, 829],
      [42, 1658],
      [63, 2487],
      [84, 3316],
      [105, 4145],
    ]);
    // The record's table is MANL; its final month holds the exact total.
    expect(normal[6]).toMatchObject({ hours: 126, dollars: 4974 });
    const record = manual(spreadToRows(normal), 'AUG 82', 124, 4976);
    expect(record[6]).toMatchObject({ eacHours: 124, eacDollars: 4976 });
  });
});

// SYS ITEM 125, W.A. 3005 HAA, before and after the ETC update (PDF 96, 98).
const BEFORE_125 = rows([
  R('SEP 83', 538, 22541, 538, 22541, 1676, 68755),
  R('OCT 83', 633, 26392, 538, 22541, 1676, 68755),
  R('NOV 83', 728, 30243, 538, 23095, 1676, 68755),
  R('DEC 83', 564, 24089, 564, 24089, 1509, 65764),
  R('JAN 84', 669, 28720, 589, 25107, 1509, 65764),
  R('FEB 84', 774, 33351, 622, 27953, 1509, 65764),
  R('MAR 84', 879, 37982, 647, 29187, 1509, 65764),
  R('APR 84', 984, 42613, 656, 30257, 1509, 65764),
  R('MAY 84', 1089, 47244, 698, 32046, 1509, 65764),
  R('JUN 84', 1194, 51875, 0, 0, 0, 0),
  R('JUL 84', 1299, 56506, 0, 0, 0, 0),
  R('AUG 84', 1404, 61137, 0, 0, 0, 0),
  R('SEP 84', 1509, 65764, 0, 0, 0, 0),
  R('OCT 84', 1509, 65764, 0, 0, 0, 0),
]);
const AFTER_125 = rows([
  R('SEP 83', 538, 22541, 538, 22541, 1676, 68755),
  R('OCT 83', 633, 26392, 538, 22541, 1676, 68755),
  R('NOV 83', 728, 30243, 538, 23095, 1676, 68755),
  R('DEC 83', 564, 24089, 564, 24089, 1509, 65764),
  R('JAN 84', 669, 28720, 589, 25107, 1509, 65764),
  R('FEB 84', 774, 33351, 622, 27953, 1509, 65764),
  R('MAR 84', 879, 37982, 647, 29187, 1509, 65764),
  R('APR 84', 984, 42613, 656, 30257, 1509, 65764),
  R('MAY 84', 698, 32046, 698, 32046, 998, 47500),
  R('JUN 84', 773, 35910, 0, 0, 998, 47500),
  R('JUL 84', 848, 39774, 0, 0, 0, 0),
  R('AUG 84', 923, 43638, 0, 0, 0, 0),
  R('SEP 84', 998, 47502, 0, 0, 0, 0),
  R('OCT 84', 998, 47500, 0, 0, 0, 0),
]);

describe('ETC/EAC update (PDF 95 to 98)', () => {
  it('reproduces the SYS 125 record after the update, drift included', () => {
    const result = etcUpdate(BEFORE_125, 'MAY84', 300, 15454);
    expect(result.eacHours).toBe(998);
    expect(result.eacDollars).toBe(47500);
    expect(result.rows).toEqual(AFTER_125);
  });

  it('shows the same reset at DEC83 in the pre-update record, except SEP84 dollars', () => {
    const before = BEFORE_125.slice(0, 3).concat(
      BEFORE_125.slice(3).map((r) => ({ ...r, eacHours: 0, eacDollars: 0 })),
    );
    const { rows: rebuilt } = etcUpdate(before, 'DEC 83', 1509 - 564, 65764 - 24089);
    const eac = (list: MonthRow[]) => list.slice(3).map((r) => [r.month, r.eacHours, r.eacDollars]);
    const expected = eac(BEFORE_125);
    // The rule's cumulative 4631 increments reach 65768 at SEP84; the printed
    // record holds the exact 65764 there, so that month was set another way.
    expected[9] = ['SEP 84', 1509, 65768];
    expect(eac(rebuilt)).toEqual(expected);
  });

  it('prices an ETC with the printed rate formula', () => {
    expect(eacFromRates(300, 2220, { hourRate: 10, odcRate: 1.5 })).toBe(6330);
    // The session's 15454 is marked BOGUS and does not follow from its own rates.
    expect(eacFromRates(300, 2220, { hourRate: 33.33, odcRate: 100 })).not.toBe(15454);
  });
});

describe('rates (PDF 123, 126)', () => {
  it('applies BUDGET DOLLARS = HRS X RATE + ODC.DOL X RATE', () => {
    const table = { H: { 1984: { hourRate: 11.11, odcRate: 1.1 } } };
    const rate = lookupRate(table, 'H', 1984);
    expect(rate).not.toBeNull();
    expect(budgetDollars(100, 1000, rate!)).toBe(2211);
    expect(lookupRate(table, 'H', 1985)).toBeNull();
    expect(RATES_NOTE).toMatch(/illustrative/);
  });

  // D-5 time table: contract value and base fee, in thousands.
  const D5: [string, number, number][] = [
    ['A', 7805, 701.96],
    ['B', 358, 32.2],
    ['C', 344, 30.94],
    ['D', 833, 74.92],
    ['E', 2599, 233.74],
    ['F', 3061, 275.3],
    ['G', 1455, 130.86],
    ['H', 3926, 353.09],
    ['L', 1266, 113.86],
    ['N', 10421, 937.23],
    ['P', 754, 67.81],
    ['T', 314, 28.24],
    ['V', 999, 89.85],
  ];

  it('rounds each base fee to 3070 x CV / 34135, except task E', () => {
    for (const [task, cv, printed] of D5) {
      // Task E rounds to 233.75; the printout gives 233.74 so the column totals 3070.00.
      const expected = task === 'E' ? 233.75 : printed;
      expect(baseFee(cv, 3070, 34135), task).toBe(expected);
    }
  });

  it('reproduces every printed base fee when the pool is split by largest remainder', () => {
    const fees = baseFees(Object.fromEntries(D5.map(([task, cv]) => [task, cv])), 3070);
    for (const [task, , printed] of D5) expect(fees[task], task).toBe(printed);
    expect(Math.round(Object.values(fees).reduce((a, b) => a + b, 0) * 100)).toBe(307000);
  });
});

describe('entire record (C-1, PDF 121)', () => {
  const record = rows([
    R('FEB 82', 0, 0, 0, 0, 0, 4976),
    R('MAR 82', 21, 829, 52, 2070, 124, 4976),
    R('APR 82', 42, 1658, 82, 2791, 124, 4976),
    R('MAY 82', 63, 2487, 93, 3057, 124, 4976),
    R('JUN 82', 84, 3316, 93, 3057, 124, 4976),
    R('JUL 82', 105, 4145, 93, 3057, 124, 4976),
    R('AUG 82', 124, 4976, 108, 3321, 108, 3321),
  ]);
  // % of EAC spent hours/dollars, % of AUT spent hours/dollars, % time passed.
  const printed = [
    [0, 0, 0, 0, 14],
    [41, 41, 41, 41, 28],
    [66, 56, 66, 56, 42],
    [75, 61, 75, 61, 57],
    [75, 61, 75, 61, 71],
    [75, 61, 75, 61, 85],
    [100, 100, 87, 66, 100],
  ];

  it('truncates every deviation percent', () => {
    record.forEach((row, i) => {
      const p = entireRecordPercents(row, 124, 4976);
      expect([p.eacSpentHours, p.eacSpentDollars, p.autSpentHours, p.autSpentDollars, timePassed(i + 1, 7)], row.month).toEqual(
        printed[i],
      );
    });
  });

  it("ends a completed task's EAC at its actuals", () => {
    const last = record.at(-1)!;
    expect([last.compHours, last.compDollars]).toEqual([last.actHours, last.actDollars]);
  });
});

// O-2: actuals H/D, ETC H/D, committed H/D, uncommitted H/D, authorized H/D;
// % time passed, % actuals/EAC H/D; contract value H/D (PDF 168).
const O2: [string, number[], number[], number[]][] = [
  ['A', [96345, 6044844, 14713, 1091023, 111058, 7135867, 45, 133, 111103, 7136000], [84.62, 86.7, 84.7], [115000, 7805000]],
  ['B', [6670, 333517, 0, 0, 6670, 333517, 30, 4484, 6700, 338001], [84.62, 99.6, 98.7], [6700, 358000]],
  ['C', [4293, 217340, 1846, 116101, 6139, 333441, 661, 37559, 6800, 371000], [84.62, 63.1, 58.6], [6200, 344000]],
  ['D', [4226, 205056, 6326, 321716, 10552, 526772, 4648, 234228, 15200, 761000], [84.62, 27.8, 26.9], [16400, 833000]],
  ['E', [48614, 2416790, 3878, 280911, 52492, 2697701, 2009, 102301, 54501, 2800002], [84.62, 89.2, 86.3], [50700, 2599000]],
  ['F', [54506, 2616145, 6934, 366673, 61440, 2982818, 57, 186, 61497, 2983004], [84.62, 88.6, 87.7], [62300, 3061000]],
  ['G', [19754, 1038219, 1882, 116658, 21636, 1154877, 68, 1123, 21704, 1156000], [84.62, 91.0, 89.8], [24200, 1455000]],
  ['H', [75427, 3290960, 4286, 194659, 79713, 3485619, 87, 381, 79800, 3486000], [84.62, 94.5, 94.4], [83400, 3926000]],
  ['J', [13849, 1017837, 1179, 135008, 15028, 1152845, 472, 93155, 15500, 1246000], [84.62, 89.3, 81.7], [15000, 1428000]],
  ['L', [22533, 737764, 3556, 140698, 26089, 878462, 12, 542, 26101, 879004], [84.62, 86.3, 83.9], [27200, 1266000]],
  ['M', [21658, 1857076, 3418, 271650, 25076, 2128726, 1424, 51274, 26500, 2180000], [84.62, 81.7, 85.2], [9000, 1100000]],
  ['N', [1471, 7809602, 0, 1410309, 1471, 9219911, 0, 89, 1471, 9220000], [84.62, 100.0, 84.7], [0, 10421000]],
  ['P', [0, 512626, 0, 111822, 0, 624448, 0, 552, 0, 625000], [84.62, 0.0, 82.0], [0, 754000]],
  ['R', [18425, 2040113, 6363, 1683113, 24788, 3723226, 212, 962774, 25000, 4686000], [84.62, 73.7, 43.5], [48000, 5584000]],
  ['S', [0, 0, 16175, 1135760, 16175, 1135760, 0, 0, 16175, 1135760], [26.09, 0.0, 0.0], [13038, 2400000]],
  ['T', [7500, 534651, 10, 3974, 7510, 538625, 0, 26, 7510, 538651], [84.62, 99.9, 99.3], [3000, 314000]],
  ['V', [17574, 767944, 2212, 99855, 19786, 867799, 17, 24201, 19803, 892000], [84.62, 88.7, 86.1], [20700, 999000]],
  ['W', [0, 60000, 0, 60000, 0, 120000, 0, 480000, 0, 600000], [84.62, 0.0, 10.0], [0, 900000]],
  ['X', [0, 0, 0, 27976, 0, 27976, 0, 42024, 0, 70000], [84.62, 0.0, 0.0], [0, 60000]],
];
const O2_TOTALS = [412845, 31500484, 72778, 7567906, 485623, 39068390, 9742, 2035032, 495365, 41103422];

describe('task summary (O-2, PDF 168)', () => {
  it('reproduces committed EAC, authorized EAC and % actuals/EAC on every row', () => {
    for (const [task, v, pct] of O2) {
      const row = taskSummaryRow({
        actHours: v[0],
        actDollars: v[1],
        etcHours: v[2],
        etcDollars: v[3],
        uncommittedHours: v[6],
        uncommittedDollars: v[7],
      });
      expect(
        [row.committedHours, row.committedDollars, row.authorizedHours, row.authorizedDollars, row.pctHours, row.pctDollars],
        task,
      ).toEqual([v[4], v[5], v[8], v[9], pct[1], pct[2]]);
    }
  });

  it('reproduces the TOTALS line', () => {
    const sums = O2_TOTALS.map((_, i) => O2.reduce((s, [, v]) => s + v[i], 0));
    expect(sums).toEqual(O2_TOTALS);
    expect(percent(O2_TOTALS[0], O2_TOTALS[8], 1)).toBe(83.3);
    expect(percent(O2_TOTALS[1], O2_TOTALS[9], 1)).toBe(76.6);
  });
});

// O-4: contract value H/D, committed EAC H/D, variance H/D, % time passed,
// % variance/CV H/D (PDF 170).
const O4: [string, number[]][] = [
  ['A', [115000, 7805000, 111058, 7135867, -3942, -669133, 84.62, -3.4, -8.6]],
  ['B', [6700, 358000, 6670, 333517, -30, -24483, 84.62, -0.4, -6.8]],
  ['C', [6200, 344000, 6139, 333441, -61, -10559, 84.62, -1.0, -3.1]],
  ['D', [16400, 833000, 10552, 526772, -5848, -306228, 84.62, -35.7, -36.8]],
  ['E', [50700, 2599000, 52492, 2697701, 1792, 98701, 84.62, 3.5, 3.8]],
  ['F', [62300, 3061000, 61440, 2982818, -860, -78182, 84.62, -1.4, -2.6]],
  ['G', [24200, 1455000, 21636, 1154877, -2564, -300123, 84.62, -10.6, -20.6]],
  ['H', [83400, 3926000, 79713, 3485619, -3687, -440381, 84.62, -4.4, -11.2]],
  ['L', [27200, 1266000, 26089, 878462, -1111, -387538, 84.62, -4.1, -30.6]],
  ['N', [0, 10421000, 1471, 9219911, 1471, -1201089, 84.62, 0.0, -11.5]],
  ['P', [0, 754000, 0, 624448, 0, -129552, 84.62, 0.0, -17.2]],
  ['T', [3000, 314000, 7510, 538625, 4510, 224625, 84.62, 150.3, 71.5]],
  ['V', [20700, 999000, 19786, 867799, -914, -131201, 84.62, -4.4, -13.1]],
  ['W', [0, 900000, 0, 120000, 0, -780000, 84.62, 0.0, -86.7]],
  ['J', [15000, 1428000, 15028, 1152845, 28, -275155, 84.62, 0.2, -19.3]],
  ['M', [9000, 1100000, 25076, 2128726, 16076, 1028726, 84.62, 178.6, 93.5]],
  ['R', [48000, 5584000, 24788, 3723226, -23212, -1860774, 84.62, -48.4, -33.3]],
  ['S', [13038, 2400000, 16175, 1135760, 3137, -1264240, 26.09, 24.1, -52.7]],
  ['X', [0, 60000, 0, 27976, 0, -32024, 84.62, 0.0, -53.4]],
];

describe('variance summary (O-4, PDF 170)', () => {
  it('reproduces variance and % variance/CV on every row and the totals', () => {
    for (const [task, v] of O4) {
      const row = varianceRow({ cvHours: v[0], cvDollars: v[1], eacHours: v[2], eacDollars: v[3] });
      expect([row.varianceHours, row.varianceDollars, row.pctHours, row.pctDollars], task).toEqual([v[4], v[5], v[7], v[8]]);
    }
    const total = varianceRow({ cvHours: 500838, cvDollars: 45607000, eacHours: 485623, eacDollars: 39068390 });
    expect(total).toEqual({ varianceHours: -15215, varianceDollars: -6538610, pctHours: -3.0, pctDollars: -14.3 });
  });

  it('agrees with O-2 on contract value and committed EAC', () => {
    const o2 = new Map(O2.map(([task, v, , cv]) => [task, [...cv, v[4], v[5]]]));
    for (const [task, v] of O4) expect(v.slice(0, 4), task).toEqual(o2.get(task));
  });

  it('fits % time passed as elapsed / total months', () => {
    // Task periods are not printed; these month counts fit the printed values.
    expect(timePassed2(11, 13)).toBe(84.62);
    expect(timePassed2(6, 23)).toBe(26.09);
    for (const [task, v] of O4) expect(v[6], task).toBe(task === 'S' ? timePassed2(6, 23) : timePassed2(11, 13));
  });
});

describe('W.A. summary (O-3, PDF 169)', () => {
  it('reproduces EAC and % of EAC', () => {
    expect(waSummaryRow({ actHours: 0, actDollars: 33067, etcHours: 0, etcDollars: 6930 })).toEqual({
      eacHours: 0,
      eacDollars: 39997,
      pctHours: 0,
      pctDollars: 82.67,
    });
    expect(waSummaryRow({ actHours: 339, actDollars: 1023506, etcHours: 0, etcDollars: 205225 })).toEqual({
      eacHours: 339,
      eacDollars: 1228731,
      pctHours: 100,
      pctDollars: 83.3,
    });
    expect(waSummaryRow({ actHours: 21, actDollars: 12491, etcHours: 0, etcDollars: 8209 })).toEqual({
      eacHours: 21,
      eacDollars: 20700,
      pctHours: 100,
      pctDollars: 60.34,
    });
  });
});

describe('balance sheet (L-1, PDF 164)', () => {
  it('holds AUTHOR. + BALANCE = BUDGETED and BUDGETED + FUTURE = TOTAL on every row', () => {
    for (const [task, v] of O2) {
      // L-1 authorized = O-2 committed EAC, balance = uncommitted EAC, future 0.
      const row = balanceRow({ authHours: v[4], authDollars: v[5], balanceHours: v[6], balanceDollars: v[7], futureHours: 0, futureDollars: 0 });
      expect([row.budgetedHours, row.budgetedDollars, row.totalHours, row.totalDollars], task).toEqual([v[8], v[9], v[8], v[9]]);
    }
    const total = balanceRow({ authHours: 485623, authDollars: 39068390, balanceHours: 9742, balanceDollars: 2035032, futureHours: 0, futureDollars: 0 });
    expect(total).toEqual({ budgetedHours: 495365, budgetedDollars: 41103422, totalHours: 495365, totalDollars: 41103422 });
  });
});

describe('533 report (E-2 to E-3A, PDF 128 to 131)', () => {
  type Printed = [string, number[]];
  const toRow = (v: number[]): Row533 => Object.fromEntries(COLUMNS_533.map((c, i) => [c, v[i]])) as Row533;
  const input = (v: number[]): Input533 => {
    const row: Partial<Row533> = toRow(v);
    delete row['7C'];
    delete row['8J'];
    delete row['9A'];
    return row as Input533;
  };
  const check = (printed: Printed[]) => {
    for (const [name, v] of printed) expect(row533(input(v)), name).toEqual(toRow(v));
  };
  const byName = (printed: Printed[]) => new Map(printed.map(([n, v]) => [n, toRow(v)]));

  // PDF 128: 2nd quarter, FPI dollars (thousands).
  const E2: Printed[] = [
    ['A', [5210, 126, 5336, 157, 156, 156, 469, 469, 0, 0, 458, 0, 1865, 7201, 7805]],
    ['B', [283, 2, 285, 5, 5, 5, 16, 13, 0, 0, 13, 0, 57, 342, 358]],
    ['C', [166, 0, 166, 8, 9, 46, 52, 13, 0, 0, 47, 8, 183, 349, 344]],
    ['D', [133, 19, 152, 41, 41, 87, 114, 114, 0, 0, 114, 106, 617, 769, 833]],
    ['E', [2148, 49, 2197, 94, 76, 54, 167, 133, 0, 0, 85, 11, 620, 2817, 2599]],
    ['F', [2300, 50, 2350, 40, 40, 42, 126, 129, 0, 0, 98, 0, 475, 2825, 3061]],
    ['G', [910, 14, 924, 20, 25, 29, 74, 74, 0, 0, 65, 0, 287, 1211, 1455]],
    ['H', [3040, 23, 3063, 39, 34, 34, 34, 52, 0, 0, 48, 2, 243, 3306, 3926]],
    ['L', [629, 19, 648, 17, 21, 24, 62, 62, 0, 0, 62, 0, 248, 896, 1266]],
    ['N', [6637, 156, 6793, 166, 186, 221, 573, 573, 0, 0, 557, 0, 2276, 9069, 10421]],
    ['P', [436, 9, 445, 10, 14, 18, 41, 41, 0, 0, 41, 0, 165, 610, 754]],
    ['T', [535, 0, 535, 1, 1, 1, 3, 3, 0, 0, 3, 0, 12, 547, 314]],
    ['V', [675, 12, 687, 8, 9, 14, 32, 32, 0, 0, 32, 0, 127, 814, 999]],
  ];
  const E2_FEES: Printed[] = [
    ['INCENTIVE FEE', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 844, 844, 844, 0]],
    ['PROFIT', [2078, 43, 2121, 55, 55, 66, 159, 154, 0, 0, 146, 314, 949, 3070, 3070]],
    ['AWARD', [60, 0, 60, 0, 0, 0, 60, 60, 0, 0, 420, 0, 540, 600, 900]],
  ];
  const E2_THRU_GA = [23102, 479, 23581, 606, 617, 731, 1763, 1708, 0, 0, 1623, 127, 7175, 30756, 34135];
  const E2_TOTAL_FPI = [25240, 522, 25762, 661, 672, 797, 1982, 1922, 0, 0, 2189, 1285, 9508, 35270, 38105];

  // PDF 129: 2nd quarter, CPFF dollars.
  const E2A: Printed[] = [
    ['J', [965, 7, 972, 25, 26, 22, 65, 65, 0, 0, 69, 402, 674, 1646, 1428]],
    ['M', [1569, 82, 1651, 41, 41, 50, 77, 62, 0, 0, 62, 147, 480, 2131, 1100]],
    ['R', [1801, 28, 1829, 178, 228, 199, 605, 605, 0, 0, 612, 77, 2504, 4333, 5584]],
  ];
  const E2A_TOTAL_COST = [4335, 117, 4452, 244, 295, 271, 747, 732, 0, 0, 743, 626, 3658, 8110, 8112];
  const E2A_FIXED_FEE = [338, 9, 347, 19, 23, 21, 58, 57, 0, 0, 58, 50, 286, 633, 633];
  const E2A_TOTAL_CPFF = [4673, 126, 4799, 263, 318, 292, 805, 789, 0, 0, 801, 676, 3944, 8743, 8745];
  const E2A_RETRANSFER = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 70, 70, 70, 60];
  const E2A_TOTAL_CONTRACT = [29913, 648, 30561, 924, 990, 1089, 2787, 2711, 0, 0, 2990, 2031, 13522, 44083, 46910];

  // PDF 130: 3rd quarter, FPI hours.
  const E3: Printed[] = [
    ['A', [90270, 2527, 92797, 2084, 2084, 2084, 6248, 0, 0, 0, 5759, 0, 18259, 111056, 115000]],
    ['B', [6069, 277, 6346, 260, 150, 1, 5, 0, 0, 0, 5, 0, 421, 6767, 6700]],
    ['C', [3463, 193, 3656, 229, 374, 703, 230, 0, 0, 0, 885, 0, 2421, 6077, 6200]],
    ['D', [3903, 323, 4226, 0, 0, 540, 2150, 0, 0, 0, 3627, 0, 6317, 10543, 16400]],
    ['E', [42613, 938, 43551, 614, 321, 372, 2488, 0, 0, 0, 1587, 0, 5382, 48933, 50700]],
    ['F', [51560, 1156, 52716, 865, 904, 904, 3072, 0, 0, 0, 3066, 0, 8811, 61527, 62300]],
    ['G', [17821, 396, 18217, 294, 294, 294, 885, 0, 0, 0, 836, 0, 2603, 20820, 24200]],
    ['H', [68966, 1148, 70114, 986, 426, 426, 2067, 0, 0, 0, 2536, 0, 6441, 76555, 83400]],
    ['L', [21098, 638, 21736, 429, 496, 496, 1488, 0, 0, 0, 1488, 0, 4397, 26133, 27200]],
    ['N', [733, 635, 1368, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1368, 0]],
    ['P', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    ['T', [7380, 0, 7380, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7380, 3000]],
    ['V', [16468, 428, 16896, 330, 330, 330, 996, 0, 0, 0, 898, 0, 2884, 19780, 20700]],
  ];
  const E3_TOTAL = [330344, 8659, 339003, 6091, 5379, 6150, 19629, 0, 0, 0, 20687, 0, 57936, 396939, 415800];

  // PDF 131: 3rd quarter, CPFF hours.
  const E3A: Printed[] = [
    ['J', [13619, 171, 13790, 137, 136, 136, 414, 0, 0, 0, 412, 0, 1235, 15025, 15000]],
    ['M', [7898, 726, 8624, 473, 337, 440, 965, 0, 0, 0, 924, 0, 3139, 11763, 9000]],
    ['R', [16618, 509, 17127, 697, 757, 1035, 2405, 0, 0, 0, 2193, 0, 7087, 24214, 48000]],
  ];
  const E3A_TOTAL = [38135, 1406, 39541, 1307, 1230, 1611, 3784, 0, 0, 0, 3529, 0, 11461, 51002, 72000];
  const E3A_S = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13038, 0, 13038, 13038, 13038];
  const E3A_TOTAL_CONTRACT = [368479, 10065, 378544, 7398, 6609, 7761, 23413, 0, 0, 0, 37254, 0, 82435, 460979, 500838];

  it('derives 7C, 8J and 9A on every printed row', () => {
    check(E2);
    check(E2_FEES);
    check([['THRU G & A', E2_THRU_GA], ['TOTAL FPI', E2_TOTAL_FPI]]);
    check(E2A);
    check([
      ['TOTAL COST', E2A_TOTAL_COST],
      ['FIXED FEE', E2A_FIXED_FEE],
      ['TOTAL CPFF', E2A_TOTAL_CPFF],
      ['RETRANSFER', E2A_RETRANSFER],
      ['TOTAL CONTRACT', E2A_TOTAL_CONTRACT],
    ]);
    check(E3);
    check(E3A);
    check([['S', E3A_S], ['TOTAL CONTRACT', E3A_TOTAL_CONTRACT]]);
  });

  it('rolls up the dollar forms with fee rows', () => {
    const fees = byName(E2_FEES);
    const fpi = rollup533Fpi(
      E2.map(([, v]) => toRow(v)),
      { incentiveFee: fees.get('INCENTIVE FEE')!, profit: fees.get('PROFIT')!, award: fees.get('AWARD')! },
    );
    expect(fpi.thruGA).toEqual(toRow(E2_THRU_GA));
    expect(fpi.total).toEqual(toRow(E2_TOTAL_FPI));
    const cpff = rollup533Cpff(E2A.map(([, v]) => toRow(v)), toRow(E2A_FIXED_FEE));
    expect(cpff.totalCost).toEqual(toRow(E2A_TOTAL_COST));
    expect(cpff.total).toEqual(toRow(E2A_TOTAL_CPFF));
    expect(totalContract533(fpi.total, cpff.total, toRow(E2A_RETRANSFER))).toEqual(toRow(E2A_TOTAL_CONTRACT));
  });

  it('rolls up the hours forms without fee rows, adding category S', () => {
    const fpi = rollup533Fpi(E3.map(([, v]) => toRow(v)));
    expect(fpi.thruGA).toEqual(toRow(E3_TOTAL));
    expect(fpi.total).toEqual(toRow(E3_TOTAL));
    const cpff = rollup533Cpff(E3A.map(([, v]) => toRow(v)));
    expect(cpff.total).toEqual(toRow(E3A_TOTAL));
    expect(totalContract533(fpi.total, cpff.total, toRow(E3A_S))).toEqual(toRow(E3A_TOTAL_CONTRACT));
  });
});

describe('POP reports (F-1A, F-2A, PDF 134 and 136)', () => {
  // POP1: prior, 1st qtr, JAN..JUN, 4th qtr, FY85, FY86 qtrs 1..4, FY86, FY87, FY88, grand.
  const POP1: Record<string, number[]> = {
    COSTS: [29107, 2252, 592, 756, 1013, 721, 824, 1193, 3183, 10534, 4699, 18, 0, 0, 4717, 1356, 0, 45714],
    '490-400': [733, 41, 4, 5, 19, 2, 14, 20, 54, 159, 220, 0, 0, 0, 220, 13, 0, 1125],
    '490-483': [541, 3, 6, 5, 2, 2, 0, 8, 24, 50, 29, 0, 0, 0, 29, 55, 0, 675],
    '490-492': [118, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 118],
    '490-493': [27624, 1074, 237, 329, 420, 332, 356, 332, 888, 3968, 924, 1, 0, 0, 925, 74, 0, 32591],
    '563-493': [91, 1134, 345, 417, 572, 385, 454, 833, 2217, 6357, 3526, 17, 0, 0, 3543, 1214, 0, 11205],
  };
  // POP2: prior, thru June, JUL, AUG, SEP, FY85, OCT..MAR, 3rd qtr, 4th qtr, FY86, FY87, FY88, grand.
  const POP2: Record<string, number[]> = {
    COSTS: [29107, 7351, 1069, 1060, 1054, 10534, 1107, 1039, 2553, 18, 0, 0, 0, 0, 4717, 1356, 0, 45714],
    '490-400': [733, 105, 18, 18, 18, 159, 49, 41, 130, 0, 0, 0, 0, 0, 220, 13, 0, 1125],
    '490-483': [541, 26, 8, 8, 8, 50, 8, 8, 13, 0, 0, 0, 0, 0, 29, 55, 0, 675],
    '490-492': [118, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 118],
    '490-493': [27624, 3080, 300, 294, 294, 3968, 304, 293, 327, 1, 0, 0, 0, 0, 925, 74, 0, 32591],
    '563-493': [91, 4140, 743, 740, 734, 6357, 746, 697, 2083, 17, 0, 0, 0, 0, 3543, 1214, 0, 11205],
  };

  // One monthly series per line, built from both printouts: each value lands
  // in a single month of its bucket, so both reports must re-derive the
  // other's columns for the test to pass.
  function monthly(p1: number[], p2: number[]): Record<string, number> {
    const m: Record<string, number> = { SEP84: p1[0], OCT84: p1[1] };
    ['JAN85', 'FEB85', 'MAR85', 'APR85', 'MAY85', 'JUN85'].forEach((k, i) => (m[k] = p1[2 + i]));
    ['JUL85', 'AUG85', 'SEP85'].forEach((k, i) => (m[k] = p2[2 + i]));
    ['OCT85', 'NOV85', 'DEC85', 'JAN86', 'FEB86', 'MAR86'].forEach((k, i) => (m[k] = p2[6 + i]));
    m.APR86 = p2[12];
    m.JUL86 = p2[13];
    m.OCT86 = p2[15];
    m.OCT87 = p2[16];
    return m;
  }

  const flat1 = (r: ReturnType<typeof pop1>) => [
    r.prior, r.q1, ...r.months, r.q4, r.fyTotal, ...r.nextQuarters, r.nextTotal, r.fy2Total, r.fy3Total, r.grand,
  ];
  const flat2 = (r: ReturnType<typeof pop2>) => [
    r.prior, r.thruJune, ...r.months, r.fyTotal, ...r.nextMonths, r.nextQ3, r.nextQ4, r.nextTotal, r.fy2Total, r.fy3Total, r.grand,
  ];

  it('reproduces every POP1 and POP2 line from one monthly series and ties them', () => {
    for (const line of Object.keys(POP1)) {
      const series = monthly(POP1[line], POP2[line]);
      expect(flat1(pop1(series, 1985)), line).toEqual(POP1[line]);
      expect(flat2(pop2(series, 1985)), line).toEqual(POP2[line]);
    }
    expect(POP1.COSTS[17]).toBe(45714);
  });

  it('sums the program lines to COSTS in every column', () => {
    for (const table of [POP1, POP2]) {
      const lines = ['490-400', '490-483', '490-492', '490-493', '563-493'].map((k) => table[k]);
      expect(table.COSTS.map((_, i) => lines.reduce((s, l) => s + l[i], 0))).toEqual(table.COSTS);
    }
  });
});

describe('processing report (N-1, PDF 166)', () => {
  const POOLS = { HAA: 26908, HCAA: 0, HCAC: 39456, HCAD: 18330, HQA: 35676, HQB: 4846 };
  // WA code, vehicle, cost, percentage, SUST., WA total, then HAA..HQB cells.
  const N1: [string, string, number, number, number, number, number[]][] = [
    ['HAE', '7206', 1122, 0.359, 450, 1572, [97, 0, 142, 66, 128, 17]],
    ['HAJ', '8209', 132000, 42.285, 52947, 184947, [11378, 0, 16684, 7751, 15085, 2049]],
    ['HAN', '7207', 22093, 7.077, 8861, 30954, [1904, 0, 2792, 1297, 2525, 343]],
    ['HAT', '8212', 32784, 10.502, 13151, 45935, [2826, 0, 4144, 1925, 3747, 509]],
    ['HAV', '8215', 13462, 4.312, 5398, 18860, [1160, 0, 1701, 790, 1538, 209]],
    ['HBCF', '8209', 10278, 3.292, 4124, 14402, [886, 0, 1299, 604, 1175, 160]],
    ['HBCF', '8211', 10278, 3.292, 4124, 14402, [886, 0, 1299, 604, 1175, 160]],
    ['HBCF', '8213', 10278, 3.292, 4124, 14402, [886, 0, 1299, 604, 1175, 160]],
    ['HBCF', '8214', 10278, 3.292, 4124, 14402, [886, 0, 1299, 604, 1175, 160]],
    ['HBAA', '8218', 69597, 22.295, 27917, 97514, [5999, 0, 8797, 4087, 7954, 1080]],
  ];
  const report = processingReport(
    N1.map(([waCode, vehicle, cost]) => ({ waCode, vehicle, cost })),
    POOLS,
  );

  it('reproduces every row', () => {
    report.rows.forEach((row, i) => {
      const [, vehicle, , pct, sust, waTotal, cells] = N1[i];
      expect([row.percentage, row.sust, row.waTotal, Object.values(row.sustaining)], vehicle).toEqual([pct, sust, waTotal, cells]);
    });
  });

  it('prints pool totals that differ from the rounded cells, as the report does', () => {
    expect([report.totalCost, report.totalSust, report.totalWa]).toEqual([312170, 125220, 437390]);
    expect(report.sustainingTotals).toEqual(POOLS);
    const cellSums = Object.keys(POOLS).map((jo) => report.rows.reduce((s, r) => s + r.sustaining[jo], 0));
    expect(cellSums).toEqual([26908, 0, 39456, 18332, 35677, 4847]);
  });
});

describe('cost reports (G-2A, G-3A, PDF 140 and 142)', () => {
  it('totals a task across the program columns', () => {
    expect(programTotal({ dod493: 9527, navy492: 1255, foreign483: 0, nasa400: 2996 })).toBe(13778);
    expect(programTotal({ dod493: 316777, navy492: 0, foreign483: 0, nasa400: 58215 })).toBe(374992);
    expect(programTotal({ dod493: 0, navy492: 116431, foreign483: 0, nasa400: 0 })).toBe(116431);
    expect(programTotal({ dod493: 2225315, navy492: 117686, foreign483: 0, nasa400: 61211 })).toBe(2404212);
  });

  it('shares a W.A. amount by job-order percent', () => {
    expect(jobOrderShare(10, 2820)).toBe(282);
    expect(jobOrderShare(10, 5770)).toBe(577);
    // Two job orders at 10% each give the NASA total.
    expect(jobOrderShare(10, 2820) * 2).toBe(564);
    expect(jobOrderShare(10, 5770) * 2).toBe(1154);
  });
});

describe('proration (J-2A, J-3A, PDF 158 and 160)', () => {
  it('splits R sub-job costs in fixed ratios', () => {
    expect(prorate(1307532, [1, 1, 2])).toEqual([326883, 326883, 653766]);
    expect(prorate(9918, [1, 1])).toEqual([4959, 4959]);
    expect(prorate(9917, [1, 1])).toEqual([4958, 4959]);
    expect(prorate(22314, [1, 1])).toEqual([11157, 11157]);
  });
});
