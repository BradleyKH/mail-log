import { expect, test, type Page } from "@playwright/test";

// Paths are relative so they resolve under whatever base the project serves (`/` in dev, `/maillog/` in the Pages preview).
const ROUTES: [path: string, heading: RegExp][] = [
  ["./", /MAIL LOG/],
  ["about", /About/],
  ["glossary", /Glossary/],
  ["reports", /Reports/],
  ["reports?q=MAGSAT", /Reports/],
  ["reports/cr-159063", /CR-159063/],
  ["reports/cr-159065/page/40", /^(NASA )?CR-159065$/],
  ["reports/cr-159064/page/87", /^(NASA )?CR-159064$/],
  ["spads", /What SPADS became/i],
  ["spads/terminal?screen=analysisMain", /Contract Analysis Terminal/i],
  ["spads/spread-reports", /Month Spread and Reports/i],
  ["spads#terminal", /Contract Analysis Terminal/i],
  ["reports/cr-177949/page/160", /^(NASA )?CR-177949$/],
  ["terminal?record=dir&step=3&view=1979", /Terminal/],
  ["terminal?record=correspondence&view=today", /Terminal/],
  ["code", /Code/],
  ["code/AUSEA?line=0823", /AUSEA/],
  ["code/TINPUT%40C", /TINPUT@C/],
  ["map?layer=manual&record=correspondence&step=330", /Map/],
  ["map?layer=code&routine=AUSEA", /Map/],
  ["no/such/page", /Record not found/],
];

function watch(page: Page) {
  const problems: string[] = [];
  page.on("pageerror", (e) => problems.push(`error: ${e.message}`));
  page.on("response", (r) => {
    // A deep link's document is 404.html on Pages by design; every asset it pulls must still load.
    if (r.request().resourceType() !== "document" && r.status() >= 400) problems.push(`${r.status()} ${r.url()}`);
  });
  page.on("requestfailed", (r) => {
    if (!/net::ERR_ABORTED/.test(r.failure()?.errorText ?? "")) problems.push(`failed ${r.url()}`);
  });
  return problems;
}

const basePath = (baseURL: string | undefined) => new URL(baseURL ?? "http://localhost/").pathname;

for (const [path, heading] of ROUTES) {
  test(`deep link ${path}`, async ({ page }) => {
    const problems = watch(page);
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading, { timeout: 20_000 });
    await page.waitForLoadState("networkidle");
    expect(problems).toEqual([]);
  });
}

test("section links redirect under the base", async ({ page, baseURL }) => {
  await page.goto("reports/cr-159065/section/4.1.3");
  await expect(page).toHaveURL(new RegExp(`${basePath(baseURL)}reports/cr-159065/page/[0-9]+$`));
});

test("scans load under the base", async ({ page }) => {
  for (const [path, name] of [
    ["reports/cr-159065/page/40?view=scan", /Scan of page 40/],
    ["./", /Cover of NASA/],
  ] as const) {
    await page.goto(path);
    const img = page.getByRole("img", { name }).first();
    await expect(img).toBeVisible();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0);
  }
  await page.goto("code/AUSEA");
  await page.getByRole("tab", { name: /Listing/ }).click();
  const scan = page.locator("img[src*='scans/cr-159064/']").first();
  await expect(scan).toBeVisible();
  await expect.poll(() => scan.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0);
});

test("in-app links keep the base", async ({ page, baseURL }) => {
  const base = basePath(baseURL);
  await page.goto("reports/cr-159064/page/86?view=text");
  await page.locator("[data-slot=fortran-block]").getByRole("link", { name: "0793", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${base}code/AUSEA[?]line=0793$`));
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Logic Map", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${base}map$`));
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Map/);
});

test("unknown paths fall back to the app's not-found page", async ({ page }) => {
  const response = await page.goto("no/such/page");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Record not found");
  await page.getByRole("link", { name: "Return to the main menu" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("NASA MAIL LOG");
  // Only the Pages preview answers with a real 404; the dev server answers 200.
  if (basePath(test.info().project.use.baseURL) !== "/") expect(response?.status()).toBe(404);
});
