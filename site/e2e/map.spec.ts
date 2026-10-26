import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

// Headless Chromium only offers WebGL through SwiftShader.
test.use({ launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] } });

const readJson = (rel: string) => JSON.parse(readFileSync(new URL(`../../content/${rel}`, import.meta.url), "utf8"));
const correspondence = readJson("program/flows/correspondence.json") as { steps: { n: number; prompt: string[]; pdfPage: number; input?: { pattern: string } }[] };
const codeIndex = readJson("code/index.json") as { routines: { id: string; description: string | null; lines: number }[] };

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

// SwiftShader renders WebGL on the CPU, so the first frame can take a while under parallel load.
async function waitForScene(page: Page) {
  await expect(page.locator("[data-testid=map-viewport] canvas")).toBeVisible({ timeout: 30_000 });
}

async function disableWebGL(page: Page) {
  await page.addInitScript({
    content: `{
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        return /webgl/.test(type) ? null : original.call(this, type, ...rest);
      };
    }`,
  });
}

test("manual deep link focuses a step and its popover matches the manual", async ({ page }) => {
  const errors = collectErrors(page);
  const step = correspondence.steps.find((s) => s.n === 330)!;
  await page.goto("/map?layer=manual&record=correspondence&step=330");
  await expect(page.getByTestId("map-viewport")).toHaveAttribute("data-view", "3d");
  await waitForScene(page);
  const popover = page.getByTestId("map-popover");
  await expect(popover.getByTestId("map-popover-title")).toHaveText("Step #30");
  await expect(popover.getByTestId("map-prompt")).toContainText(step.prompt[0]);
  await expect(popover.getByTestId("map-input-pattern")).toHaveText(step.input!.pattern);
  const panel = page.getByTestId("map-panel");
  await expect(panel.getByTestId("map-panel-title")).toHaveText("Step #30");
  await expect(panel.getByRole("link", { name: `The manual, page ${step.pdfPage}` })).toHaveAttribute("href", `/archive/cr-159065/page/${step.pdfPage}`);
  await expect(panel.getByRole("link", { name: "This step in the Terminal" })).toHaveAttribute("href", "/terminal?record=correspondence&step=330");
  await expect(panel.getByRole("link", { name: "AUSEA" })).toHaveAttribute("href", "/code/AUSEA?line=0804.1");
  expect(errors).toEqual([]);
});

test("code deep link shows the routine's description and calls", async ({ page }) => {
  const errors = collectErrors(page);
  const ausea = codeIndex.routines.find((r) => r.id === "AUSEA")!;
  await page.goto("/map?layer=code&routine=AUSEA");
  await waitForScene(page);
  const popover = page.getByTestId("map-popover");
  await expect(popover.getByTestId("map-popover-title")).toHaveText("AUSEA");
  await expect(popover).toContainText(`${ausea.lines} lines`);
  await expect(popover.getByTestId("map-routine-description")).toHaveText(ausea.description!);
  const panel = page.getByTestId("map-panel");
  for (const name of ["SCRNHD", "SCRNPT", "HARDHD", "HARDPT"]) await expect(panel.getByRole("button", { name, exact: true })).toBeVisible();
  await expect(panel.getByRole("link", { name: "Read the FORTRAN in the Code room" })).toHaveAttribute("href", "/code/AUSEA");
  await panel.getByRole("button", { name: "SCRNHD", exact: true }).click();
  await expect(page).toHaveURL(/layer=code&routine=SCRNHD/);
  await expect(page.getByTestId("map-popover").getByTestId("map-popover-title")).toHaveText("SCRNHD");
  expect(errors).toEqual([]);
});

test("selection carries across layers in both directions", async ({ page }) => {
  await page.goto("/map?layer=manual&record=correspondence&step=330");
  await waitForScene(page);
  await page.getByRole("radio", { name: "Code" }).click();
  await expect(page).toHaveURL(/layer=code&record=correspondence&step=330/);
  await expect(page.getByTestId("map-popover").getByTestId("map-popover-title")).toHaveText("AUSEA");

  await page.goto("/map?layer=code&routine=AUSEA");
  await page.getByRole("radio", { name: "Manual" }).click();
  await expect(page).toHaveURL(/layer=manual&routine=AUSEA/);
  await expect(page.getByTestId("map-popover").getByTestId("map-popover-title")).toHaveText("Step #30");

  await page.getByTestId("map-panel").getByRole("button", { name: "Step #31" }).click();
  await expect(page).toHaveURL(/layer=manual&record=correspondence&step=331/);
  await page.getByTestId("map-panel").getByRole("button", { name: "Show in Code layer" }).click();
  await expect(page).toHaveURL(/layer=code&routine=AUSEA/);
});

test("hovering a node in the scene shows its popover", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/map?layer=code&routine=SCRNHD");
  await waitForScene(page);
  await expect(page.getByTestId("map-popover-title")).toHaveText("SCRNHD");
  await page.getByRole("button", { name: "Clear selection" }).click();
  await expect(page.getByTestId("map-popover")).toHaveCount(0);
  const box = (await page.getByTestId("map-viewport").boundingBox())!;
  // Clearing leaves the camera centered on SCRNHD, and reduced motion means it got there instantly.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.getByTestId("map-popover-title")).toHaveText("SCRNHD");
});

test("trace follows the author/source search in both layers", async ({ page }) => {
  await page.goto("/map");
  await page.getByRole("button", { name: "Trace author search" }).click();
  await expect(page.getByTestId("map-trace").getByRole("listitem")).toHaveCount(19);
  await page.getByRole("radio", { name: "Code" }).click();
  await expect(page.getByTestId("map-trace").getByRole("button")).toHaveText(["SEAC", "AUSEA", "SCRNHD", "SCRNPT", "HARDHD", "HARDPT"]);
});

test("the finder selects nodes from the keyboard", async ({ page }) => {
  await page.goto("/map?layer=manual");
  await page.getByLabel("Find a step").selectOption("step:dir:308");
  await expect(page).toHaveURL(/record=dir&step=308/);
  await expect(page.getByTestId("map-panel-title")).toHaveText("Step #8");
});

test("without WebGL the flat map keeps selection and links", async ({ page }) => {
  const errors = collectErrors(page);
  await disableWebGL(page);
  await page.goto("/map?layer=manual");
  await expect(page.getByTestId("map-viewport")).toHaveAttribute("data-view", "2d");
  await expect(page.getByRole("button", { name: "Flat view" })).toHaveCount(0);
  await page.locator('svg [data-node="step:correspondence:330"]').click();
  await expect(page).toHaveURL(/record=correspondence&step=330/);
  await expect(page.getByTestId("map-popover-title")).toHaveText("Step #30");
  await expect(page.getByTestId("map-panel").getByRole("link", { name: "This step in the Terminal" })).toBeVisible();
  await page.getByRole("radio", { name: "Code" }).click();
  await expect(page.locator('svg [data-node="routine:AUSEA"]')).toBeVisible();
  await page.locator('svg [data-node="file:DRAW"]').click();
  await expect(page.getByTestId("map-panel-title")).toHaveText("DRAW");
  expect(errors).toEqual([]);
});

test("fits a phone screen without sideways scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/map?layer=manual&record=dir&step=308");
  await expect(page.getByTestId("map-panel-title")).toHaveText("Step #8");
  await waitForScene(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
