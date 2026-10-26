import type { HighlighterCore, ThemedToken } from "shiki/core";

export type LineTokens = ThemedToken[];

let highlighter: Promise<HighlighterCore> | undefined;

// Fine-grained imports keep the Shiki bundle to one grammar and two themes.
function getHighlighter(): Promise<HighlighterCore> {
  highlighter ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, lang, light, dark] = await Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
      import("@shikijs/langs/fortran-fixed-form"),
      import("@shikijs/themes/github-light-high-contrast"),
      import("@shikijs/themes/github-dark"),
    ]);
    return createHighlighterCore({
      engine: createJavaScriptRegexEngine(),
      langs: [lang.default],
      themes: [light.default, dark.default],
    });
  })();
  return highlighter;
}

/** Tokenizes source for both themes at once; each token carries `--shiki-light` and `--shiki-dark` in `htmlStyle`. */
export async function tokenizeFortran(code: string): Promise<LineTokens[]> {
  const hl = await getHighlighter();
  const { tokens } = hl.codeToTokens(code, {
    lang: "fortran-fixed-form",
    themes: { light: "github-light-high-contrast", dark: "github-dark" },
    defaultColor: false,
  });
  return tokens;
}
