import { expect, test, type Page } from "@playwright/test";

const shots = "test-results/today";

async function typeLine(page: Page, text: string) {
  const input = page.getByLabel("Terminal input");
  await input.fill(text);
  await input.press("Enter");
}

const log = (page: Page) => page.getByRole("log", { name: "MAIL LOG terminal output" });

async function newDir(page: Page, number: string, title: string) {
  await page.getByRole("button", { name: "New record" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("DIR/REPORT NUMBER").fill(number);
  await dialog.getByLabel("TITLE").fill(title);
  await dialog.getByLabel("DATE", { exact: true }).fill("1979-05-07");
  await dialog.getByRole("button", { name: "Save record" }).click();
}

test("Today lists the manual's records and filters on searchable items", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/terminal?view=today");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Terminal");
  await expect(page.getByTestId("today-caption")).toContainText("1979 is the original");
  await expect(page.getByTestId("today-count")).toContainText("92 correspondence records");

  await page.getByLabel("Filter records").fill("keynton");
  await expect(page.getByTestId("today-count")).toContainText("6 of 92");
  await page.getByLabel("Search in").selectOption("subject");
  await expect(page.getByTestId("record-row")).toHaveCount(0);
  await page.getByLabel("Filter records").fill("");
  await page.getByLabel("Search in").selectOption("all");

  await page.getByRole("button", { name: "Input date" }).click();
  await expect(page.getByRole("columnheader", { name: "Input date" })).toHaveAttribute("aria-sort", "ascending");

  await page.getByTestId("record-row").first().click();
  await expect(page.getByRole("dialog")).toContainText("From the manual, Figure");
  await page.screenshot({ path: `${shots}/detail-${info.project.name}.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test("a record created in Today is found in the 1979 terminal", async ({ page }, info) => {
  await page.goto("/terminal?view=today&record=dir");
  await newDir(page, "99dir0001", "Scout wind tunnel summary");
  await expect(page.getByTestId("today-notice")).toContainText("Saved");
  await expect(page.getByRole("dialog")).toContainText("99DIR0001");
  await page.keyboard.press("Escape");
  await page.screenshot({ path: `${shots}/created-${info.project.name}.png`, fullPage: true });

  await page.getByRole("radio", { name: "1979" }).click();
  await expect(page).toHaveURL(/view=1979/);
  await expect(page).toHaveURL(/record=dir/);
  await page.getByRole("button", { name: "Instant" }).click();
  for (const l of ["login dkh", "MAIL", "DIR", "SEA", "DIR", "99DIR0001"]) await typeLine(page, l);
  await expect(log(page)).toContainText("SCOUT WIND TUNNEL SUMMARY");
});

test("a record entered at the 1979 terminal appears in Today and can be archived there", async ({ page }) => {
  await page.goto("/terminal?view=1979&record=dir");
  await page.getByRole("button", { name: "Instant" }).click();
  for (const l of ["login dkh", "MAIL", "DIR", "INP", "GO"]) await typeLine(page, l);
  await expect(page).toHaveURL(/step=1(06|07)/);
  const fromTerminal = ["TERMINAL ENTRY TITLE", "98DIR0002", "050779", "PROP", "35260000", "", "A", "050779", "NO"];
  for (const l of fromTerminal) {
    await typeLine(page, l);
    await page.waitForTimeout(50);
  }

  await page.getByRole("radio", { name: "Today" }).click();
  await expect(page).toHaveURL(/view=today/);
  await expect(page).toHaveURL(/record=dir/);
  await page.getByLabel("Filter records").fill("98DIR0002");
  await expect(page.getByTestId("record-row")).toHaveCount(1);
  await page.getByTestId("record-row").click();
  await expect(page.getByRole("dialog")).toContainText("Entered this session");
  await page.getByRole("button", { name: "Archive" }).click();
  await page.getByRole("button", { name: "Confirm archive" }).click();
  await expect(page.getByTestId("record-row")).toHaveCount(0);
  await expect(page.getByTestId("today-notice")).toContainText("Archived");
});

test("the toggle keeps the record type and updates the URL", async ({ page }) => {
  await page.goto("/terminal?view=today&record=drawing-eo");
  await expect(page.getByRole("link", { name: "Drawings / E.O." })).toHaveAttribute("aria-current", "page");
  await page.getByRole("radio", { name: "1979" }).click();
  await expect(page).toHaveURL(/view=1979/);
  await expect(page).toHaveURL(/record=drawing-eo/);
  await expect(page.getByTestId("hood-step")).toBeVisible();
  await page.getByRole("radio", { name: "Today" }).click();
  await expect(page).toHaveURL(/view=today&record=drawing-eo|record=drawing-eo&view=today/);
  await expect(page.getByRole("heading", { level: 2, name: "Drawings / E.O." })).toBeVisible();
});

test("the form applies the terminal's rules", async ({ page }) => {
  await page.goto("/terminal?view=today&record=correspondence");
  await page.getByRole("button", { name: "New record" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Save record" }).click();
  await expect(dialog).toContainText("Required");
  await dialog.getByLabel("MAIL STATUS").evaluate((el) => {
    el.removeAttribute("maxlength");
  });
  await dialog.getByLabel("MAIL STATUS").fill("ABC");
  await expect(dialog).toContainText("Text, up to 2 characters");
  await dialog.getByLabel("MAIL STATUS").fill("AB");
  await dialog.getByLabel("SUBJECT").fill("form rules");
  await dialog.getByRole("button", { name: "Save record" }).click();
  await expect(page.getByTestId("today-notice")).toContainText("input date-code");
});

test("Today works at phone width", async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/terminal?view=today");
  await expect(page.getByRole("button", { name: "New record" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.screenshot({ path: `${shots}/mobile-${info.project.name}.png`, fullPage: true });
});
