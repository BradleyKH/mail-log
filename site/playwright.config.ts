import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 5180);
// Set E2E_BASE_PATH (e.g. /maillog/) after a build with the same BASE_PATH to also run the deep-link
// specs against that build, served the way GitHub Pages serves a project site.
const BASE_PATH = process.env.E2E_BASE_PATH?.replace(/\/?$/, "/");
const BASE_PORT = PORT + 100;

// The suite runs against a production build by default: under parallel load the dev server's per-module
// transforms of every lazy route and content file made first renders miss expect timeouts. E2E_DEV=1
// runs against the dev server instead, for iterating on a spec.
const E2E_OUT_DIR = "node_modules/.cache/e2e-dist";
const webServer: NonNullable<PlaywrightTestConfig["webServer"]> = [
  {
    command: process.env.E2E_DEV
      ? `pnpm exec vite --port ${PORT} --strictPort`
      : `pnpm exec vite build --outDir ${E2E_OUT_DIR} --emptyOutDir --logLevel warn && pnpm exec vite preview --outDir ${E2E_OUT_DIR} --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    timeout: 180_000,
    reuseExistingServer: false,
  },
];
if (BASE_PATH) {
  webServer.push({
    command: `pnpm exec tsx scripts/preview/pages-server.ts ${BASE_PORT} dist`,
    url: `http://localhost:${BASE_PORT}${BASE_PATH}`,
    env: { BASE_PATH },
    reuseExistingServer: false,
  });
}

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    { name: "light", use: { ...devices["Desktop Chrome"], colorScheme: "light" } },
    { name: "dark", use: { ...devices["Desktop Chrome"], colorScheme: "dark" } },
    ...(BASE_PATH
      ? [
          {
            name: "base-path",
            testMatch: /deeplinks\.spec\.ts/,
            use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${BASE_PORT}${BASE_PATH}` },
          },
        ]
      : []),
  ],
  webServer,
});
