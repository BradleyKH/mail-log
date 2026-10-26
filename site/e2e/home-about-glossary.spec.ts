import { readdirSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const codeIndex = JSON.parse(readFileSync(new URL("../../content/code/index.json", import.meta.url), "utf8")) as { totals: { lines: number } };
const docsDir = new URL("../../content/docs/", import.meta.url);
const PAGES = readdirSync(docsDir)
  .reduce((sum, id) => sum + (JSON.parse(readFileSync(new URL(`${id}/doc.json`, docsDir), "utf8")) as { pageCount: number }).pageCount, 0)
  .toLocaleString("en-US");
const LINES = codeIndex.totals.lines.toLocaleString("en-US");

test.describe("home", () => {
  test("shows hero, numbers, doors", async ({ page }, info) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("MAIL LOG");
    await expect(page.getByAltText(/Cover of NASA Contractor Report CR-159065/)).toBeVisible();
    await expect(page.getByText(LINES)).toBeVisible();
    await expect(page.getByText(PAGES, { exact: true })).toBeVisible();
    for (const [name, url] of [["Archive", /\/archive$/], ["Terminal", /\/terminal$/], ["Code", /\/code$/], ["Map", /\/map$/]] as const) {
      await page.goto("/");
      await page.getByRole("region", { name: "Rooms" }).getByRole("link", { name: new RegExp(`^${name}`) }).click();
      await expect(page).toHaveURL(url);
    }
    await page.goto("/");
    await expect(page.getByAltText(/Cover of NASA/)).toBeVisible();
    await expect(page.getByText(LINES)).toBeVisible();
    await page.screenshot({ path: `test-results/screens/home-${info.project.name}.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    await expect(page.getByText(LINES)).toBeVisible();
    await page.screenshot({ path: `test-results/screens/home-mobile-${info.project.name}.png`, fullPage: true });
  });
});

test.describe("about", () => {
  test("renders and links resolve", async ({ page }, info) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
    await expect(page.getByText("I was the last guy out the door turning off the lights.")).toBeVisible();
    await expect(page.getByRole("link", { name: /^NTRS \d+/ })).toHaveCount(7);
    await page.screenshot({ path: `test-results/screens/about-${info.project.name}.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 800 });
    await page.screenshot({ path: `test-results/screens/about-mobile-${info.project.name}.png`, fullPage: true });
    await page.getByRole("link", { name: "Archive search for MAGSAT" }).click();
    await expect(page).toHaveURL(/\/archive\?q=MAGSAT$/);
    await page.goto("/about");
    await page.getByRole("link", { name: "preface as printed" }).click();
    await expect(page).toHaveURL(/\/archive\/cr-159065\/page\/12$/);
  });
});

test.describe("glossary", () => {
  test("filters and links to source pages", async ({ page }, info) => {
    await page.goto("/glossary");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Glossary");
    const rows = page.getByTestId("glossary-row");
    const total = await rows.count();
    expect(total).toBe(136);
    await page.screenshot({ path: `test-results/screens/glossary-${info.project.name}.png` });
    await page.getByLabel("Filter glossary").fill("archive");
    expect(await rows.count()).toBeLessThan(total);
    await expect(rows.first()).toContainText(/archive/i);
    await page.getByLabel("Report", { exact: true }).selectOption("cr-159064");
    await expect(rows.first().getByText("NASA CR-159064")).toBeVisible();
    await rows.first().getByRole("link").click();
    await expect(page).toHaveURL(/\/archive\/cr-159064\/page\/\d+$/);
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/glossary");
    await expect(rows.first()).toBeVisible();
    await page.screenshot({ path: `test-results/screens/glossary-mobile-${info.project.name}.png` });
  });
});
