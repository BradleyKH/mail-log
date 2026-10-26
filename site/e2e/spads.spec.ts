import { expect, test, type Page } from "@playwright/test";

const log = (page: Page) => page.getByRole("log", { name: "SPADS Contract Analysis terminal output" });

async function typeLine(page: Page, text: string) {
  const input = page.getByLabel("Terminal input");
  // Enter while output is still printing only skips the animation, so wait for the prompt first.
  await expect(page.getByRole("button", { name: "SKIP (ENTER)" })).toHaveCount(0);
  await input.fill(text);
  await input.press("Enter");
  await expect(input).toHaveValue("");
}

async function typeAll(page: Page, lines: string[]) {
  for (const l of lines) await typeLine(page, l);
}

/** Logs in and opens the NAS1-16200 analysis menu, with output printing instantly. */
async function toAnalysisMenu(page: Page) {
  await page.goto("/spads#terminal");
  await page.getByRole("button", { name: "Instant" }).click();
  await expect(log(page)).toContainText("OK, LOGIN PLEASE");
  await typeAll(page, ["LOGIN DKH", "", "", "8", "10"]);
  await expect(page.getByTestId("spads-hood-screen")).toHaveText("You are at the Analysis main menu");
  await expect(log(page)).toContainText("RETRIEVE");
}

test("SPADS page shows its sections and jump links", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/spads");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SPADS");
  const jumps = page.getByRole("navigation", { name: "On this page" });
  for (const name of ["Terminal", "Month spread", "Reports", "MAIL LOG in 1985"]) {
    await expect(jumps.getByRole("link", { name })).toBeVisible();
  }
  await expect(page.locator("#spread")).toBeAttached();
  await expect(page.locator("#reports")).toBeAttached();
  await expect(page.locator("#mail-log-1985")).toBeAttached();
  expect(errors).toEqual([]);
});

test("login reaches the NAS1-16200 analysis menu", async ({ page }) => {
  await toAnalysisMenu(page);
  await expect(page).toHaveURL(/screen=analysisMain/);
  await expect(page.getByRole("link", { name: /Read it in the manual/ })).toHaveAttribute("href", /\/archive\/cr-177949\/page\/14$/);
});

test("RETRIEVE shows SYS 125 and the ETC update prints 47502", async ({ page }, info) => {
  await toAnalysisMenu(page);

  await typeAll(page, ["1", "5", "125", ""]);
  await expect(log(page)).toContainText(/SYS ITEM NO: ?125/);
  await expect(log(page)).toContainText("PROCUREMENT & SHIPMENT OF MISCELLANEOUS ITEMS, VEHICLE PROCESSING");

  // Back out of RETRIEVE to the analysis menu, then run the printed ETC EAC-BUDGET update.
  await page.getByRole("button", { name: "Start over" }).click();
  await expect(log(page)).toContainText("OK, LOGIN PLEASE");
  await typeAll(page, ["LOGIN DKH", "", "", "8", "10"]);
  await expect(page.getByTestId("spads-hood-screen")).toHaveText("You are at the Analysis main menu");

  await typeAll(page, ["5", "3", "Y", "305HAA", "3005HAA", "300", "2220", "Y", "0", "0", ""]);
  await expect(log(page)).toContainText("WA = 3005HAA FOUND. RECORD NO. = 125");
  await expect(log(page)).toContainText("SEP 84 998 47502");
  await page.screenshot({ path: `test-results/spads/etc-${info.project.name}.png`, fullPage: true });
});

test("the spread explainer opens the manual's example preset", async ({ page }) => {
  await page.goto("/spads#spread");
  const section = page.locator("#spread");
  const manual = section.getByRole("button", { name: "The manual's example" });
  await expect(manual).toHaveAttribute("aria-pressed", "true");
  await expect(section.getByTestId("spread-row")).toHaveCount(17);
  await expect(section.getByRole("link", { name: /PDF page \d+/ }).first()).toHaveAttribute("href", /\/archive\/cr-177949\/page\/\d+$/);

  await section.getByRole("button", { name: /ETC update/ }).click();
  await expect(section.getByText(/SEP 84 prints 47502/)).toBeVisible();
  await manual.click();
  await expect(manual).toHaveAttribute("aria-pressed", "true");
});

test("report O-4 opens with its variance note and returns to the gallery", async ({ page }) => {
  await page.goto("/spads#reports");
  const cards = page.getByTestId("report-card");
  await expect(cards).toHaveCount(31);
  await cards.filter({ has: page.getByText("O-4", { exact: true }) }).click();
  const detail = page.getByTestId("report-detail");
  await expect(detail).toBeVisible();
  await expect(detail.getByTestId("formula-note").filter({ hasText: "EST. VARIANCE = committed EAC - contract value" })).toBeVisible();
  await expect(detail.getByRole("link", { name: "PDF page 170" }).first()).toHaveAttribute("href", /\/archive\/cr-177949\/page\/170$/);
  await detail.getByRole("button", { name: "Back to all reports" }).click();
  await expect(cards).toHaveCount(31);
});
