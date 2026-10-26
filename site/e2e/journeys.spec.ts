import { expect, test } from "@playwright/test";

// Headless Chromium only offers WebGL through SwiftShader.
test.use({ launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] } });

test("manual step to the Map, across to the Code layer, into the Code room, to the Terminal, and back", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/archive/cr-159065/page/40?view=text");
  await page.locator("[data-pane=text]").getByRole("link", { name: "Step #30 on the Map" }).click();
  await expect(page).toHaveURL(/\/map\?layer=manual&record=correspondence&step=330/);
  const panel = page.getByTestId("map-panel");
  await expect(panel.getByTestId("map-panel-title")).toHaveText("Step #30", { timeout: 30_000 });

  await page.getByRole("radio", { name: "Code" }).click();
  await expect(page).toHaveURL(/layer=code/);
  await expect(page.getByTestId("map-popover").getByTestId("map-popover-title")).toHaveText("AUSEA");
  await panel.getByRole("link", { name: "AUSEA", exact: true }).click();
  await expect(page).toHaveURL(/\/code\/AUSEA\?line=0804/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("AUSEA");

  const terminal = page.getByRole("complementary").getByRole("link", { name: "Terminal" }).first();
  const href = await terminal.getAttribute("href");
  await terminal.click();
  await expect(page).toHaveURL((url) => url.pathname + url.search === href);
  await expect(page.getByTestId("hood-step")).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/code\/AUSEA\?line=0804/);
  await page.goBack();
  await expect(page).toHaveURL(/\/map\?layer=code/);
  expect(errors).toEqual([]);
});

test("a listing line opens the Code room at that line", async ({ page }) => {
  await page.goto("/archive/cr-159064/page/86?view=text");
  await page.locator("[data-slot=fortran-block]").getByRole("link", { name: "0793", exact: true }).click();
  await expect(page).toHaveURL(/\/code\/AUSEA\?line=0793$/);
  await expect(page.locator("[data-line-id='0793.1']")).toHaveAttribute("data-active", "true");
  await expect(page.locator("[data-line-id='0793.1']")).toBeInViewport();
});

test("the header search and / reach the Archive search from any room", async ({ page }) => {
  await page.goto("/code");
  await page.keyboard.press("/");
  await expect(page).toHaveURL(/\/archive$/);
  const box = page.getByRole("searchbox", { name: "Search the reports" });
  await expect(box).toBeFocused();
  await box.fill("MAGSAT HEATSHIELD");
  await box.press("Enter");
  const results = page.getByTestId("results-cr-159065");
  await expect(results).toBeVisible({ timeout: 30_000 });
  await results.getByRole("link").first().click();
  await expect(page).toHaveURL(/\/archive\/cr-159065\/page\/\d+/);
  await expect(page.getByText(/MAGSAT HEATSHIELD/).first()).toBeVisible();

  await page.goto("/map");
  await page.getByRole("link", { name: "Search the reports (press /)" }).click();
  await expect(page).toHaveURL(/\/archive$/);
  await expect(box).toBeFocused();
});

test("glossary terms open their definition and source page", async ({ page }) => {
  await page.goto("/archive/cr-159065/page/21?view=text");
  const term = page.locator("[data-pane=text] button.cursor-help").first();
  await expect(term).toBeVisible();
  await term.click();
  const pop = page.getByRole("dialog");
  await expect(pop.getByRole("link", { name: /Source: page \d+/ })).toBeVisible();
  await pop.getByRole("link", { name: /Source: page \d+/ }).click();
  await expect(page).toHaveURL(/\/archive\/cr-159065\/page\/1(4[6-9]|50)/);
});
