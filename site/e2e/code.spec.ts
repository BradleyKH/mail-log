import { expect, test } from "@playwright/test";

test("list to AUSEA, follow a CALL to SCRNHD", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/code");
  await expect(page.getByText("PRIME 300")).toBeVisible();
  await page.getByLabel("Filter routines").fill("AUSEA");
  await page.getByRole("link", { name: "AUSEA", exact: true }).click();
  await expect(page).toHaveURL(/\/code\/AUSEA$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("AUSEA");
  await page.getByRole("complementary").getByRole("link", { name: "SCRNHD" }).click();
  await expect(page).toHaveURL(/\/code\/SCRNHD/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SCRNHD");
  expect(errors).toEqual([]);
});

test("?line= highlights the line", async ({ page }) => {
  await page.goto("/code/AUSEA?line=0823");
  const marked = page.locator('[data-line-id][data-active]');
  await expect(marked).toHaveCount(1);
  await expect(marked).toContainText("(0823)");
  await expect(marked).toBeInViewport();
});

test("scan tabs show the listing and flowchart pages", async ({ page }) => {
  await page.goto("/code/AUSEA");
  await page.getByRole("tab", { name: "Listing scans" }).click();
  await expect(page.locator('img[src="/scans/cr-159064/page-086.webp"]')).toBeVisible();
  await expect(page.locator('img[src="/scans/cr-159064/page-087.webp"]')).toHaveCount(1);
  await page.getByRole("tab", { name: "Flowchart scans" }).click();
  await expect(page.locator('img[src="/scans/cr-159063/page-180.webp"]')).toBeVisible();
});

test("steps link to Terminal and Map; ids with @ resolve", async ({ page }) => {
  await page.goto("/code/AUSEA");
  const side = page.getByRole("complementary");
  await expect(side.getByRole("link", { name: "Terminal" }).first()).toHaveAttribute("href", /^\/terminal\?record=correspondence&step=3\d\d$/);
  await expect(side.getByRole("link", { name: "Map" }).first()).toHaveAttribute("href", /^\/map\?layer=manual&record=correspondence&step=/);
  await page.goto("/code/TINPUT%40C");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("TINPUT@C");
});

test("mobile layout has no horizontal page scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  for (const path of ["/code", "/code/AUSEA?line=0823"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (path.includes("line=")) await expect(page.locator("[data-line-id][data-active]")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  }
  await page.screenshot({ path: "test-results/code-mobile.png" });
});
