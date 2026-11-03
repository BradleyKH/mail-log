/** List items, numbered headings, and all-caps lines keep their own line when prose is reflowed. */
const KEEP_BREAK = /(?<=^[A-Z0-9 ,./'-]+)\n|\n(?=\s*(?:\(?\d+(?:\.\d+)*[.)]?\s|\(?[a-zA-Z][.)]\s|[-*•]\s|[A-Z0-9 ,./'-]+$))/gm;

/**
 * Joins a prose paragraph's printed line breaks into running text: words hyphenated across a line
 * are rejoined, and lines that look like list items or all-caps headings keep their break.
 * Column layouts (lines starting with `|`) are left as printed.
 */
export function reflowProse(text: string): string {
  if (/^\|/m.test(text)) return text;
  const MARK = "\u0000";
  return text
    .replace(/([a-z])-\n([a-z])/g, "$1$2")
    .replace(KEEP_BREAK, MARK)
    .replace(/[ \t]*\n[ \t]*/g, " ")
    .replaceAll(MARK, "\n");
}
