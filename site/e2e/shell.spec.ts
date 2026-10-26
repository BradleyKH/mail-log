import { expect, test } from "@playwright/test";

const ROUTES: [path: string, heading: RegExp][] = [
  ["/", /MAIL LOG/],
  ["/about", /About/],
  ["/glossary", /Glossary/],
  ["/archive", /Archive/],
  ["/archive?q=MAGSAT", /Archive/],
  ["/archive/cr-159065", /CR-159065/],
  ["/archive/cr-159064/page/87", /CR-159064, page 87/],
  ["/terminal?record=dir&step=3&view=1979", /Terminal/],
  ["/code", /Code/],
  ["/code/AUSEA?line=0823", /AUSEA/],
  ["/map?layer=code&routine=AUSEA", /Map/],
  ["/no/such/page", /Record not found/],
];

for (const [path, heading] of ROUTES) {
  test(`renders ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    expect(errors).toEqual([]);
  });
}

test("section links redirect to the section's first page", async ({ page }) => {
  await page.goto("/archive/cr-159065/section/4.1");
  await expect(page).toHaveURL(/\/archive\/cr-159065\/page\/21$/);
});

test("unknown section links redirect to the report", async ({ page }) => {
  await page.goto("/archive/cr-159065/section/99.9");
  await expect(page).toHaveURL(/\/archive\/cr-159065$/);
});

test("top nav reaches every room", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  for (const [label, url] of [
    ["Archive", /\/archive$/],
    ["Terminal", /\/terminal$/],
    ["Code", /\/code$/],
    ["Map", /\/map$/],
    ["Glossary", /\/glossary$/],
    ["About", /\/about$/],
    ["Home", /\/$/],
  ] as const) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(url);
    await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
  }
});

test("theme toggle switches and persists", async ({ page }, info) => {
  await page.goto("/");
  const html = page.locator("html");
  const startsDark = info.project.name === "dark";
  await expect(html).toHaveClass(startsDark ? /dark/ : /^(?!.*dark)/);
  await page.getByTestId("theme-toggle").click();
  await expect(html).toHaveClass(startsDark ? /^(?!.*dark)/ : /dark/);
  await page.reload();
  await expect(html).toHaveClass(startsDark ? /^(?!.*dark)/ : /dark/);
});

test("screenshots", async ({ page }, info) => {
  for (const path of ["/", "/archive", "/terminal"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.screenshot({ path: `test-results/screens/${info.project.name}${path.replace(/\//g, "_")}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/archive");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu.getByRole("link", { name: "Terminal" })).toBeVisible();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `test-results/screens/${info.project.name}_mobile-menu.png` });
  await menu.getByRole("link", { name: "Terminal" }).click();
  await expect(page).toHaveURL(/\/terminal$/);
  await expect(menu).toBeHidden();
});
