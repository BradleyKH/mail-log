import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Headless Chromium only offers WebGL through SwiftShader.
test.use({ launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] } });

const PAGES: [name: string, path: string, ready: (page: Page) => Promise<void>][] = [
  ["home", "/", async (p) => void (await expect(p.getByRole("region", { name: "Rooms" })).toBeVisible())],
  ["about", "/about", async (p) => void (await expect(p.getByRole("heading", { level: 1 })).toBeVisible())],
  ["glossary", "/glossary", async (p) => void (await expect(p.getByRole("heading", { level: 1 })).toBeVisible())],
  ["archive", "/archive", async (p) => void (await expect(p.getByRole("searchbox")).toBeVisible())],
  ["search", "/archive?q=MAGSAT", async (p) => void (await expect(p.getByTestId("results-cr-159065")).toBeVisible({ timeout: 30_000 }))],
  ["report", "/archive/cr-159065", async (p) => void (await expect(p.getByTestId("toc")).toBeVisible())],
  ["page", "/archive/cr-159065/page/40?view=both", async (p) => void (await expect(p.getByRole("img", { name: /Scan of page 40/ })).toBeVisible())],
  ["listing", "/archive/cr-159064/page/86?view=text", async (p) => void (await expect(p.locator("[data-slot=fortran-block]")).toBeVisible())],
  ["figure", "/archive/cr-159065/page/115?view=text", async (p) => void (await expect(p.locator("[data-slot=text-block]").first()).toBeVisible())],
  ["spads", "/spads", async (p) => void (await expect(p.getByTestId("report-card").first()).toBeVisible({ timeout: 30_000 }))],
  ["spads-ai-page", "/archive/cr-177949/page/160", async (p) => void (await expect(p.getByText("AI transcription", { exact: true })).toBeVisible())],
  ["terminal", "/terminal?record=correspondence&step=330", async (p) => void (await expect(p.getByTestId("hood-step")).toBeVisible())],
  ["today", "/terminal?record=correspondence&view=today", async (p) => void (await expect(p.getByTestId("record-row").first()).toBeVisible())],
  ["code", "/code", async (p) => void (await expect(p.getByRole("heading", { level: 1 })).toBeVisible())],
  ["routine", "/code/AUSEA?line=0823", async (p) => void (await expect(p.locator("[data-active=true]")).toBeVisible())],
  ["map", "/map?layer=manual&record=correspondence&step=330", async (p) => void (await expect(p.getByTestId("map-panel")).toBeVisible({ timeout: 30_000 }))],
  ["map-2d", "/map?layer=code&routine=AUSEA", async (p) => void (await expect(p.getByTestId("map-panel")).toBeVisible({ timeout: 30_000 }))],
];

for (const [name, path, ready] of PAGES) {
  test(`axe: ${name}`, async ({ page }) => {
    if (name === "map-2d")
      await page.addInitScript({
        content: `{
          const original = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
            return /webgl/.test(type) ? null : original.call(this, type, ...rest);
          };
        }`,
      });
    await page.goto(path);
    await ready(page);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const summary = serious.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nodes, e.g. ${v.nodes[0]?.target.join(" ")} ${v.nodes.slice(0, 3).map((n) => n.html.slice(0, 160) + " :: " + (n.any[0]?.message ?? "")).join(" || ")}`);
    expect(summary).toEqual([]);
  });
}

test("the terminal is reachable and usable from the keyboard alone", async ({ page }) => {
  await page.goto("/terminal?record=correspondence");
  await page.getByRole("button", { name: "Instant" }).focus();
  await page.keyboard.press("Enter");
  for (let i = 0; i < 30; i++) {
    if ((await page.evaluate(() => document.activeElement?.id)) === "terminal-input") break;
    await page.keyboard.press("Tab");
  }
  await expect(page.getByLabel("Terminal input")).toBeFocused();
  await page.keyboard.type("login dkh");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/step=2/);
});

test("the 2D map fallback works from the keyboard", async ({ page }) => {
  await page.addInitScript({
    content: `{
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        return /webgl/.test(type) ? null : original.call(this, type, ...rest);
      };
    }`,
  });
  await page.goto("/map?layer=code");
  await expect(page.getByTestId("map-viewport")).toHaveAttribute("data-view", "2d");
  // The finder is the keyboard route to every node; the drawn nodes are pointer targets.
  const finder = page.getByLabel("Find a routine or file");
  await finder.focus();
  await finder.selectOption({ label: "AUSEA" });
  await expect(page).toHaveURL(/routine=AUSEA/);
  const link = page.getByTestId("map-panel").getByRole("link", { name: "Read the FORTRAN in the Code room" });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/code\/AUSEA$/);
});
