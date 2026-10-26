import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { applyKnownGaps, parseDenylist, run, validateContent, type Issue } from "./validate-content.ts";

const fixtures = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../content/fixtures");
const TEST_NAME = "Zebulon Quackenbush";

const messages = (issues: Issue[], level: Issue["level"]) =>
  issues.filter((i) => i.level === level).map((i) => `${i.file}: ${i.message}`);

describe("validateContent", () => {
  it("accepts a complete, consistent content tree with no warnings", () => {
    expect(validateContent(path.join(fixtures, "valid"), { denylist: [TEST_NAME] })).toEqual([]);
  });

  it("reports every class of error in the invalid fixture", () => {
    const issues = validateContent(path.join(fixtures, "invalid"));
    const errors = messages(issues, "error");
    const expected = [
      /docs\/cr-999999: docId "cr-999999" is not one of the in-site reports/,
      /cr-159065\/figures.json: figure 1 references unknown sectionId "8.8"/,
      /cr-159065\/pages\/page-001.md: unknown sectionId "9.9"/,
      /cr-159065\/pages\/page-001.md: unknown figure 5\.4\.1-18/,
      /cr-159065\/pages\/page-002.md: pdfPage 5 does not match file name/,
      /cr-159065\/overrides\/page-001.md: invalid page/,
      /cr-159064\/pages\/page-001.md: AUSEA: sequence 0003 decreases after 0004/,
      /cr-159064\/pages\/page-002.md: AUSEA: sequence 0002 decreases after 0004/,
      /flows\/correspondence.json: entryStep 50 does not exist/,
      /flows\/correspondence.json: step 1 branch "S" goes to missing step 99/,
      /flows\/correspondence.json: step 1 next goes to missing step 98/,
    ];
    for (const re of expected) expect(errors.some((e) => re.test(e)), `expected an error matching ${re}`).toBe(true);
    const warnings = messages(issues, "warning");
    expect(warnings).toContainEqual(expect.stringMatching(/cr-159064\/pages\/page-001.md: AUSEA: gap from 0001 to 0004/));
    expect(warnings).toContainEqual(expect.stringMatching(/cr-159065\/pages: missing pages: 003/));
  });

  it("accepts a routine name that recurs in two appendices with restarted numbering", () => {
    const issues = validateContent(path.join(fixtures, "valid"));
    expect(messages(issues, "error")).toEqual([]);
    expect(messages(issues, "warning")).toEqual([]);
  });

  it("accepts dotted string figure ids and errors on dangling ones", () => {
    expect(messages(validateContent(path.join(fixtures, "valid")), "error")).toEqual([]);
    expect(messages(validateContent(path.join(fixtures, "invalid")), "error")).toContainEqual(
      expect.stringMatching(/unknown figure 5\.4\.1-18/),
    );
  });

  it("checks sample records against figures and fields only when those files exist", () => {
    const issues = validateContent(path.join(fixtures, "invalid"));
    expect(messages(issues, "warning")).toContainEqual(expect.stringMatching(/program\/fields\/correspondence.json: missing/));
  });

  it("fails when a content file contains a denylisted name", () => {
    const issues = validateContent(path.join(fixtures, "denylist"), { denylist: [TEST_NAME.toUpperCase()] });
    const errors = messages(issues, "error");
    expect(errors).toEqual(["docs/cr-159065/pages/page-001.md: contains denylisted name #1"]);
    expect(errors.join("\n")).not.toContain("Quackenbush");
  });

  it("skips the name check when the denylist is empty", () => {
    expect(messages(validateContent(path.join(fixtures, "denylist"), { denylist: parseDenylist(undefined) }), "error")).toEqual([]);
  });
});

describe("parseDenylist", () => {
  it("splits on commas and drops blanks", () => {
    expect(parseDenylist(" Ann Example , ,Bob Example")).toEqual(["Ann Example", "Bob Example"]);
  });
});

describe("known gaps", () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), "content-gaps-"));
  const root = path.join(tmp, "content");
  cpSync(path.join(fixtures, "valid"), root, { recursive: true });
  // Removing the page leaves exactly one warning: "missing pages: 003".
  rmSync(path.join(root, "docs/cr-159065/pages/page-003.md"));
  const gapsFile = path.join(tmp, "gaps.json");
  const write = (gaps: unknown) => writeFileSync(gapsFile, JSON.stringify(gaps));
  const args = ["--root", root, "--known-gaps", gapsFile, "--strict"];

  afterAll(() => rmSync(tmp, { recursive: true, force: true }));

  it("fails --strict on a warning that is not listed", () => {
    write([{ file: "docs/cr-159065/pages", messagePrefix: "no pages yet", reason: "unrelated" }]);
    expect(run(args, {}).code).toBe(1);
  });

  it("passes --strict when the warning is allowlisted, and reports it as a known gap", () => {
    write([{ file: "docs/cr-159065/pages", messagePrefix: "missing pages: 003", reason: "page is a scan artifact" }]);
    const result = run(args, {});
    expect(result.code).toBe(0);
    expect(result.lines.join("\n")).toContain("known docs/cr-159065/pages: missing pages: 003 (page is a scan artifact)");
  });

  it("treats an absent allowlist file as no allowlist", () => {
    rmSync(gapsFile, { force: true });
    expect(run(args, {}).code).toBe(1);
  });

  it("never suppresses errors", () => {
    const issues: Issue[] = [{ level: "error", file: "a.json", message: "bad" }];
    const { issues: kept, known } = applyKnownGaps(issues, [{ file: "a.json", messagePrefix: "bad", reason: "x" }]);
    expect(kept).toEqual(issues);
    expect(known).toEqual([]);
  });
});

describe("1985 volumes and SPADS data", () => {
  const PLACEHOLDER = "Zed Placeholder";
  const trees: string[] = [];
  afterAll(() => trees.forEach((t) => rmSync(t, { recursive: true, force: true })));

  const page = (n: number, body: string) =>
    `---
pdfPage: ${n}
folio: null
sectionId: null
kind: text
source: ai
confidence: 90
figures: []
---
${body}
`;
  const write = (root: string, rel: string, content: string) => {
    mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    writeFileSync(path.join(root, rel), content);
  };
  function tree(docId = "cr-177949"): string {
    const root = mkdtempSync(path.join(os.tmpdir(), "spads-"));
    trees.push(root);
    const meta = {
      docId,
      reportNumber: "CR-177949",
      title: "Test volume",
      date: "1985-07",
      ntrsId: "19850024000",
      pdfPath: "x.pdf",
      stem: "x",
      pageCount: 1,
    };
    write(root, `docs/${docId}/doc.json`, JSON.stringify(meta));
    write(root, `docs/${docId}/sections.json`, "[]");
    write(root, `docs/${docId}/figures.json`, "[]");
    write(root, `docs/${docId}/glossary.json`, "[]");
    return root;
  }
  const errorsOf = (root: string, denylist: string[] = []) => messages(validateContent(root, { denylist }), "error");

  it("validates a cr-177949 doc dated 1985-07 with an ai-sourced page", () => {
    const root = tree();
    write(root, "docs/cr-177949/pages/page-001.md", page(1, "Body"));
    expect(errorsOf(root)).toEqual([]);
  });

  it("accepts ai and reviewed overrides but rejects an ocr override", () => {
    const root = tree();
    write(root, "docs/cr-177949/overrides/page-001.md", page(1, "Body"));
    expect(errorsOf(root)).toEqual([]);

    write(root, "docs/cr-177949/overrides/page-001.md", page(1, "Body").replace("source: ai", "source: ocr"));
    expect(errorsOf(root)).toContainEqual(expect.stringMatching(/override pages must have source "reviewed" or "ai"/));
  });

  it("still rejects an unknown docId", () => {
    const root = tree();
    write(root, "docs/cr-177999/doc.json", "{}");
    expect(errorsOf(root)).toContainEqual(expect.stringMatching(/docs\/cr-177999: docId "cr-177999" is not one of/));
  });

  it("allows a denylisted name in 1985 page transcriptions but not in spads data or other reports", () => {
    const root = tree();
    write(root, "docs/cr-177949/pages/page-001.md", page(1, PLACEHOLDER));
    write(root, "docs/cr-177949/overrides/page-001.md", page(1, PLACEHOLDER).replace("source: ai", "source: reviewed"));
    expect(errorsOf(root, [PLACEHOLDER])).toEqual([]);

    write(root, "spads/menus.json", JSON.stringify({ main: PLACEHOLDER }));
    expect(errorsOf(root, [PLACEHOLDER])).toEqual(["spads/menus.json: contains denylisted name #1"]);

    const other = tree("cr-159065");
    write(other, "docs/cr-159065/doc.json", JSON.stringify({ docId: "cr-159065", reportNumber: "CR-159065", title: "T", date: "1979-05", ntrsId: "19790019000", pdfPath: "x.pdf", stem: "x", pageCount: 1 }));
    write(other, "docs/cr-159065/pages/page-001.md", page(1, PLACEHOLDER));
    expect(errorsOf(other, [PLACEHOLDER])).toEqual(["docs/cr-159065/pages/page-001.md: contains denylisted name #1"]);
  });

  it("validates spads data files when present and reports schema errors", () => {
    const root = tree();
    write(root, "spads/fields.json", JSON.stringify([{ n: 1, name: "SYSNUM", label: "System number", description: "d", pdfPage: 12 }]));
    write(root, "spads/menus.json", JSON.stringify({ main: ["1. A", "2. B"] }));
    expect(errorsOf(root)).toEqual([]);
    write(root, "spads/reports.json", JSON.stringify([{ id: "O-4" }]));
    expect(errorsOf(root).some((e) => e.startsWith("spads/reports.json: "))).toBe(true);
  });
});
