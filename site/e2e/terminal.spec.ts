import { expect, test, type Page } from "@playwright/test";

const shots = "test-results/terminal";

async function typeLine(page: Page, text: string) {
  const input = page.getByLabel("Terminal input");
  await input.fill(text);
  await input.press("Enter");
}

async function typeAll(page: Page, lines: string[]) {
  for (const l of lines) await typeLine(page, l);
}

const log = (page: Page) => page.getByRole("log", { name: "MAIL LOG terminal output" });

test("a typed session runs the author/source search end to end", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/terminal?view=1979");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Terminal");
  await page.getByRole("button", { name: "Instant" }).click();
  await expect(page).toHaveURL(/record=correspondence&step=1/);

  await typeAll(page, ["login dkh", "MAIL", "COR"]);
  await expect(log(page)).toContainText("DKH (4) LOGGED IN AT");
  await expect(page.getByTestId("hood-step")).toHaveText(/MODE SELECTION/);

  await typeAll(page, ["SEA", "AUTH", "120778", "080178", "123178", "6"]);
  await expect(page).toHaveURL(/step=330/);
  await expect(page.getByTestId("hood-step")).toHaveText("You are at Step #30");
  await expect(page.getByRole("link", { name: "AUSEA", exact: true })).toBeVisible();

  await typeLine(page, "KEYNTON, R. J.");
  await expect(log(page)).toContainText("THERE ARE 6 DOCUMENTS WITH AN AUTHOR/SOURCE OF KEYNTON, R. J.");
  await expect(page).toHaveURL(/step=317/);
  await page.screenshot({ path: `${shots}/session-${info.project.name}.png`, fullPage: true });

  await typeLine(page, "");
  await expect(page).toHaveURL(/step=301/);
  expect(errors).toEqual([]);
});

test("an invalid date repeats the step", async ({ page }) => {
  await page.goto("/terminal?record=correspondence&step=303");
  await page.getByRole("button", { name: "Instant" }).click();
  await typeLine(page, "023078");
  await expect(log(page)).toContainText("ERROR IN DATES - PLEASE TRY AGAIN");
  await expect(page).toHaveURL(/step=303/);
});

test("a DIR deep link lands on the step and keeps the URL in step", async ({ page }, info) => {
  await page.goto("/terminal?record=dir&step=315");
  await page.getByRole("button", { name: "Instant" }).click();
  await expect(page.getByTestId("hood-step")).toHaveText("You are at Step #15");
  await expect(log(page)).toContainText("WHAT IS THE DESIRED DIR-REPORT NUMBER");
  await typeLine(page, "23DIR1992");
  await expect(log(page)).toContainText("SCOUT TRAJECTORY DATA ILLUSTRATI QUATERNION GUIDANCE EFFECTS");
  await expect(page).toHaveURL(/record=dir&step=301/);
  await page.screenshot({ path: `${shots}/dir-${info.project.name}.png`, fullPage: true });
});

test("the under-the-hood code link opens the routine at the matching line", async ({ page }) => {
  await page.goto("/terminal?record=correspondence&step=330");
  await expect(page.getByTestId("hood-step")).toHaveText("You are at Step #30");
  const block = page.locator("[data-hood-excerpt]");
  await expect(block.locator('[data-line-id="0804.1"]')).toContainText("AUTHOR/SOURCE SEARCH");
  await expect(block.locator('[data-line-id="0804.1"]')).toHaveAttribute("data-active", "true");
  await expect(page.getByRole("link", { name: "See it on the Map" })).toHaveAttribute("href", "/map?layer=code&routine=AUSEA");
  await page.getByRole("link", { name: "Read AUSEA in the Code room" }).click();
  await expect(page).toHaveURL(/\/code\/AUSEA\?line=0804$/);
});

test("the panel collapses", async ({ page }) => {
  await page.goto("/terminal?record=dir&step=4");
  const toggle = page.getByRole("button", { name: "Under the hood" });
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByTestId("hood-step")).toHaveCount(0);
});

test("reduced motion prints instantly with a steady cursor", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/terminal");
  await expect(page.getByRole("button", { name: "Instant" })).toBeDisabled();
  await typeAll(page, ["LOGIN DKH", "MAIL"]);
  await expect(log(page)).toContainText("DO YOU WISH TO WORK WITH THE DIR/REPORT DATA");
  await expect(page.getByRole("button", { name: /SKIP/ })).toHaveCount(0);
  const animation = await page.evaluate("getComputedStyle(document.querySelector('.terminal-crt [aria-hidden]')).animationName");
  expect(animation).toBe("none");
  await page.screenshot({ path: `${shots}/reduced-${info.project.name}.png` });
});

test("baud printing can be skipped", async ({ page }) => {
  await page.goto("/terminal");
  await page.getByRole("button", { name: "300 baud" }).click();
  await typeLine(page, "LOGIN DKH");
  await expect(page.getByRole("button", { name: /SKIP/ })).toBeVisible();
  await expect(log(page)).not.toContainText("PLEASE ENTER THE APPROPRIATE KEY");
  await page.getByLabel("Terminal input").press("Enter");
  await expect(log(page)).toContainText("PLEASE ENTER THE APPROPRIATE KEY");
  await expect(page.getByRole("button", { name: /SKIP/ })).toHaveCount(0);
});

test("works at phone width", async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/terminal?record=drawing-eo&step=301");
  await page.getByRole("button", { name: "Instant" }).click();
  await expect(log(page)).toContainText("PLEASE SELECT THE DESIRED MODE");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.screenshot({ path: `${shots}/mobile-${info.project.name}.png`, fullPage: true });
});
