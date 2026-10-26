export type BodyBlock =
  | { type: "prose"; text: string }
  | { type: "code"; lang: "text" | "fortran"; code: string };

const FENCE = /```(\w*)\n([\s\S]*?)```/g;

/** Splits a page body into prose paragraphs and fenced code blocks, in order. */
export function parseBody(body: string): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  const pushProse = (chunk: string) => {
    for (const para of chunk.split(/\n\s*\n/)) {
      const text = para.trim();
      if (text) blocks.push({ type: "prose", text });
    }
  };
  let last = 0;
  for (const m of body.matchAll(FENCE)) {
    pushProse(body.slice(last, m.index));
    blocks.push({ type: "code", lang: m[1] === "fortran" ? "fortran" : "text", code: m[2].replace(/\n$/, "") });
    last = m.index + m[0].length;
  }
  pushProse(body.slice(last));
  return blocks;
}
