// Code points for figure dash, en dash, em dash, horizontal bar, minus sign, and the other dash
// variants OCR can produce.
const DASH_CODE_POINTS = [0x2012, 0x2013, 0x2014, 0x2015, 0x2212, 0x2e3a, 0x2e3b, 0xfe58, 0xfe63, 0xff0d];
const DASHES = new RegExp(`[${DASH_CODE_POINTS.map((c) => String.fromCodePoint(c)).join("")}]`, "g");

/** Normalizes dash-like characters in generated UI copy to a plain hyphen. */
export function displayText(s: string): string {
  return s.replace(DASHES, "-");
}
