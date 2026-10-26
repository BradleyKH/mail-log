import { expect, test } from "@playwright/test";

test("shelf to section 4.1.3 of the operating instructions", async ({ page }) => {
  await page.goto("/archive");
  await expect(page.getByTestId("shelf").getByRole("heading", { level: 2 })).toHaveCount(2);
  await page.getByRole("link", { name: "MAIL LOG - Program Operating Instructions" }).click();
  await expect(page).toHaveURL(/\/archive\/cr-159065$/);
  await expect(page.getByTestId("thumbnail-strip").locator("li")).toHaveCount(150);
  await page.getByTestId("toc").getByRole("link", { name: /4\.1\.3 SEARCH MODE/ }).click();
  await expect(page).toHaveURL(/\/archive\/cr-159065\/page\/32$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/CR-159065, page 32/);
});

test("arrow keys page through the report and view toggles switch panes", async ({ page }) => {
  await page.goto("/archive/cr-159065/page/40?view=both");
  await expect(page.locator("[data-pane=text]")).toBeVisible();
  await expect(page.locator("[data-pane=scan]")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/\/page\/41\?view=both$/);
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/page\/40\?view=both$/);

  await page.getByRole("radio", { name: "Scan" }).click();
  await expect(page.locator("[data-pane=text]")).toHaveCount(0);
  await expect(page.getByRole("img", { name: /Scan of page 40/ })).toBeVisible();
  await page.getByRole("radio", { name: "Text" }).click();
  await expect(page.locator("[data-pane=scan]")).toHaveCount(0);
  await expect(page.locator("[data-pane=text]")).toContainText("AUTHOR/SOURCE");
});

test("scan zoom grows the image", async ({ page }) => {
  await page.goto("/archive/cr-159065/page/40?view=scan");
  const img = page.getByRole("img", { name: /Scan of page 40/ });
  await expect(img).toBeVisible();
  const before = (await img.boundingBox())!.width;
  await page.getByRole("button", { name: "Zoom in" }).click();
  await expect.poll(async () => (await img.boundingBox())!.width).toBeGreaterThan(before * 1.4);
});

test("manual steps link to the Terminal and the Map", async ({ page }) => {
  await page.goto("/archive/cr-159065/page/40?view=text");
  const link = page.locator("[data-pane=text]").getByRole("link", { name: "Step #30", exact: true });
  await expect(link).toHaveAttribute("href", /\/terminal\?record=correspondence&step=330/);
  await expect(page.locator("[data-pane=text]").getByRole("link", { name: "Step #30 on the Map" })).toHaveAttribute(
    "href",
    /\/map\?layer=manual&record=correspondence&step=330/,
  );
});

test("OCR pages carry a badge and low confidence pages open scan first", async ({ page }) => {
  await page.goto("/archive/cr-159064/page/28");
  await expect(page.getByText("OCR text", { exact: true })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Scan" })).toHaveAttribute("data-state", "on");
});

test("text blocks scroll sideways instead of wrapping", async ({ page }) => {
  await page.goto("/archive/cr-159065/page/115?view=text");
  const block = page.locator("[data-slot=text-block]").first();
  await expect(block).toBeVisible();
  await expect(block).toHaveCSS("white-space", "pre");
});

test("listing sequence numbers link into the Code room", async ({ page }) => {
  await page.goto("/archive/cr-159064/page/86?view=text");
  const block = page.locator("[data-slot=fortran-block]");
  await expect(block).toBeVisible();
  await block.getByRole("link", { name: "0793", exact: true }).click();
  await expect(page).toHaveURL(/\/code\/AUSEA\?line=0793$/);
});

test("flowchart pages show the scan large with a routine link", async ({ page }) => {
  await page.goto("/archive/cr-159063/page/180");
  await expect(page.getByRole("img", { name: /Scan of page 180/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "AUSEA", exact: true })).toHaveAttribute("href", /\/code\/AUSEA$/);
});

test("search MAGSAT leads to the sample output figure", async ({ page }) => {
  await page.goto("/archive?q=MAGSAT");
  const results = page.getByTestId("results-cr-159065");
  await expect(results).toBeVisible({ timeout: 30_000 });
  await expect(results.locator("mark").first()).toBeVisible();
  await results.getByRole("link").first().click();
  await expect(page).toHaveURL(/\/archive\/cr-159065\/page\/\d+/);
});

test("search finds AUTHOR/SOURCE and groups by report", async ({ page }) => {
  await page.goto("/archive");
  const box = page.getByRole("searchbox", { name: "Search the reports" });
  await expect(box).toBeVisible();
  await page.keyboard.press("/");
  await expect(box).toBeFocused();
  await page.keyboard.type("author/source");
  await expect(page).toHaveURL(/\/archive\?q=author%2Fsource/);
  await expect(page.getByTestId("results-cr-159065").getByRole("link", { name: /Page 40/ })).toBeVisible({ timeout: 30_000 });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test("page view fits the width and offers text and scan only", async ({ page }) => {
    await page.goto("/archive/cr-159065/page/40");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/page 40/);
    await expect(page.getByRole("radio", { name: "Both" })).toBeHidden();
    await expect(page.locator("[data-pane=text]")).toBeVisible();
    await expect(page.locator("[data-pane=scan]")).toHaveCount(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.getByRole("radio", { name: "Scan" }).click();
    await expect(page.getByRole("img", { name: /Scan of page 40/ })).toBeVisible();
  });

  test("shelf and report pages fit the width", async ({ page }) => {
    for (const path of ["/archive", "/archive/cr-159063", "/archive?q=AUSEA"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    }
  });
});

test("unknown report and page show a not found message", async ({ page }) => {
  await page.goto("/archive/cr-159065/page/999");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  await page.goto("/archive/nope");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Unknown report");
});

test("the 1985 shelf lists the SPADS manuals and an AI transcribed page carries its badge", async ({ page }) => {
  await page.goto("/archive");
  const shelf = page.getByTestId("shelf");
  await expect(shelf.getByRole("heading", { level: 2, name: "SPADS user's manuals, July 1985" })).toBeVisible();
  await shelf.locator("a[href=\"/archive/cr-177949\"]").last().click();
  await expect(page).toHaveURL(/\/archive\/cr-177949$/);

  await page.goto("/archive/cr-177949/page/160");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/CR-177949, page 160/);
  await expect(page.getByText("AI transcription", { exact: true })).toBeVisible();
});

test("searching proration and Dallas tape finds SPADS manual pages", async ({ page }) => {
  for (const query of ["proration", "Dallas tape"]) {
    await page.goto(`/archive?q=${encodeURIComponent(query)}`);
    const results = page.getByTestId("results-cr-177949");
    await expect(results).toBeVisible({ timeout: 30_000 });
    await expect(results.getByRole("link").first()).toHaveAttribute("href", /\/archive\/cr-177949\/page\/\d+/);
  }
});
