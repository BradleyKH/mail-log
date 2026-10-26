import { describe, expect, it } from "vitest";
import { getFlow, loadCodeIndex, loadXref } from "@/content/load";
import type { CodeIndex, Flow, RecordType } from "@/content/types";
import { buildCodeGraph } from "./codeLayout";
import { routinesForStep, stepsForRoutine } from "./crossLinks";
import { distance } from "./geometry";
import { EXIT_NODE_ID, routineNodeId, stepNodeId } from "./ids";
import { RECORD_ORDER } from "./labels";
import { buildManualGraph } from "./manualLayout";
import { deriveMenuKeys } from "./menuKeys";
import { mapSearch, parseMapParams } from "./params";
import { highlightFor } from "./selection";
import { tracePath } from "./trace";
import type { MapGraph } from "./types";

const flows = Object.fromEntries(RECORD_ORDER.map((r) => [r, getFlow(r)])) as Record<RecordType, Flow>;
const index = (await loadCodeIndex()) as CodeIndex;
const xref = await loadXref();

function expectSoundLayout(graph: MapGraph, minGap: number) {
  const ids = new Set<string>();
  for (const n of graph.nodes) {
    expect(ids.has(n.id), `duplicate ${n.id}`).toBe(false);
    ids.add(n.id);
    for (const v of [...n.position, n.size]) expect(Number.isFinite(v), `${n.id} has a non-finite coordinate`).toBe(true);
  }
  for (const e of graph.edges) {
    expect(ids.has(e.from), e.id).toBe(true);
    expect(ids.has(e.to), e.id).toBe(true);
  }
  for (let a = 0; a < graph.nodes.length; a++) {
    for (let b = a + 1; b < graph.nodes.length; b++) {
      const na = graph.nodes[a];
      const nb = graph.nodes[b];
      const gap = distance(na.position, nb.position) - na.size - nb.size;
      expect(gap, `${na.id} overlaps ${nb.id}`).toBeGreaterThan(minGap);
    }
  }
}

describe("manual layout", () => {
  const graph = buildManualGraph(flows);

  it("is deterministic", () => {
    expect(buildManualGraph(flows)).toEqual(graph);
  });

  it("places every step of every flow once, with the shared core and exit at the center", () => {
    for (const record of RECORD_ORDER) {
      for (const s of flows[record].steps) expect(graph.nodes.some((n) => n.id === stepNodeId(record, s.n)), `${record} ${s.n}`).toBe(true);
    }
    const core = graph.nodes.filter((n) => n.group === "core");
    expect(core.map((n) => n.id).sort()).toEqual(["step:core:1", "step:core:2", "step:core:3", EXIT_NODE_ID].sort());
    for (const n of core) expect(Math.hypot(n.position[0], n.position[2])).toBeLessThan(8);
    const total = 4 + RECORD_ORDER.reduce((s, r) => s + flows[r].steps.filter((st) => st.n > 3).length, 0);
    expect(graph.nodes).toHaveLength(total);
  });

  it("keeps nodes apart and every edge between placed nodes", () => {
    expectSoundLayout(graph, 0.2);
  });

  it("links step 3 to each record's mode menu", () => {
    for (const record of RECORD_ORDER) expect(graph.edges.some((e) => e.id === `step:core:3->${stepNodeId(record, 4)}`)).toBe(true);
  });

  it("derives search menu edges from the menu's key rows", () => {
    const corr = deriveMenuKeys(flows.correspondence);
    expect(corr.unmatched).toEqual([]);
    expect(corr.keys.find((k) => k.key === "AUTH")?.goto).toBe(330);
    expect(corr.keys.find((k) => k.key === "QUIT")?.goto).toBe(350);
    for (const record of RECORD_ORDER) {
      const { keys, unmatched } = deriveMenuKeys(flows[record]);
      expect(unmatched, record).toEqual([]);
      expect(keys.length, record).toBeGreaterThan(7);
    }
    expect(deriveMenuKeys(flows.dir).keys.find((k) => k.key === "TITLE")?.goto).toBe(308);
    expect(deriveMenuKeys(flows.dir).keys.find((k) => k.key === "QUIT")?.goto).toBe(329);
    expect(deriveMenuKeys(flows["drawing-eo"]).keys.find((k) => k.key === "QUIT")?.goto).toBe(360);
    const menuEdge = graph.edges.find((e) => e.id === `${stepNodeId("correspondence", 301)}->${stepNodeId("correspondence", 330)}`);
    expect(menuEdge?.label).toBe("AUTH");
  });

  it("traces the author/source search along real edges", () => {
    const trace = tracePath("manual", graph);
    expect(trace.edgeIds).toHaveLength(18);
    expect(trace.nodeIds).toContain(stepNodeId("correspondence", 330));
  });
});

describe("code layout", () => {
  const graph = buildCodeGraph(index);

  it("is deterministic", () => {
    expect(buildCodeGraph(index)).toEqual(graph);
  });

  it("places every routine, every data file, and the shared externals", () => {
    for (const r of index.routines) expect(graph.nodes.some((n) => n.id === routineNodeId(r.id)), r.id).toBe(true);
    const units = new Set(index.routines.flatMap((r) => r.files.filter((f) => f.kind === "file").map((f) => f.unit)));
    expect(graph.nodes.filter((n) => n.shape === "file")).toHaveLength(units.size);
    expect(graph.nodes.some((n) => n.label.match(/^\d+$/) && n.shape === "file")).toBe(false);
    for (const n of graph.nodes.filter((x) => x.shape === "external")) expect(Math.hypot(n.position[0], n.position[2])).toBeLessThan(10);
  });

  it("keeps nodes apart and every edge between placed nodes", () => {
    expectSoundLayout(graph, 0.2);
  });

  it("sizes routines by line count", () => {
    const size = (id: string) => graph.nodes.find((n) => n.id === routineNodeId(id))!.size;
    const big = [...index.routines].sort((a, b) => b.lines - a.lines)[0];
    expect(size(big.id)).toBeGreaterThan(size("AUSEA"));
  });

  it("traces AUSEA to the screen and hard-copy printers", () => {
    const trace = tracePath("code", graph);
    for (const p of ["SCRNHD", "SCRNPT", "HARDHD", "HARDPT"]) expect(trace.edgeIds).toContain(`routine:AUSEA->routine:${p}`);
  });
});

describe("cross-layer links", () => {
  it("maps the author/source steps to AUSEA and back", () => {
    expect(routinesForStep(xref, "correspondence", 330)).toEqual(["AUSEA"]);
    expect(stepsForRoutine(xref, "AUSEA")).toEqual([
      { record: "correspondence", step: 330 },
      { record: "correspondence", step: 331 },
    ]);
  });

  it("highlights a step's routine in the code layer and a routine's steps in the manual layer", () => {
    const code = buildCodeGraph(index);
    const manual = buildManualGraph(flows);
    expect(highlightFor({ kind: "step", record: "correspondence", n: 330 }, "code", code, xref).focus).toEqual(["routine:AUSEA"]);
    expect(highlightFor({ kind: "routine", id: "AUSEA" }, "manual", manual, xref).focus).toEqual([
      "step:correspondence:330",
      "step:correspondence:331",
    ]);
  });

  it("round-trips the URL contract", () => {
    const p = parseMapParams(new URLSearchParams("layer=code&routine=TINPUT@C"));
    expect(p).toEqual({ layer: "code", record: null, selection: { kind: "routine", id: "TINPUT@C" } });
    const s = parseMapParams(new URLSearchParams("layer=manual&record=dir&step=308"));
    expect(mapSearch(s.layer, s.selection, s.record).toString()).toBe("layer=manual&record=dir&step=308");
    expect(parseMapParams(new URLSearchParams("record=bogus")).record).toBeNull();
  });
});
