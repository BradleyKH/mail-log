import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { buildSearchDocsFromDisk } from "./scripts/search/searchIndex.ts";
import { DOC_IDS } from "./src/content/schema.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(here, "../content");

/** Fails the build if content/docs holds any report other than the four in-site ones. */
function onlyInSiteDocs(): Plugin {
  return {
    name: "only-in-site-docs",
    buildStart() {
      const docsDir = path.join(contentDir, "docs");
      if (!existsSync(docsDir)) return;
      const extra = readdirSync(docsDir).filter(
        (d) => statSync(path.join(docsDir, d)).isDirectory() && !(DOC_IDS as readonly string[]).includes(d),
      );
      if (extra.length > 0) this.error(`content/docs contains reports that must not ship: ${extra.join(", ")}`);
    },
  };
}

/**
 * Serves the Archive's search documents as `virtual:search-index`, computed from content/ in Node so
 * the browser never fetches every page body to build its index.
 */
function searchIndex(): Plugin {
  const id = "virtual:search-index";
  const resolved = `\0${id}`;
  return {
    name: "search-index",
    resolveId: (source) => (source === id ? resolved : undefined),
    load(source) {
      if (source !== resolved) return;
      return `export default ${JSON.stringify(buildSearchDocsFromDisk(contentDir))};`;
    },
    configureServer(server) {
      const invalidate = (file: string) => {
        const rel = path.relative(contentDir, file).split(path.sep).join("/");
        if (!rel.startsWith("docs/") && rel !== "code/index.json") return;
        const mod = server.moduleGraph.getModuleById(resolved);
        if (mod) server.moduleGraph.invalidateModule(mod);
      };
      server.watcher.add(contentDir);
      server.watcher.on("change", invalidate).on("add", invalidate).on("unlink", invalidate);
    },
  };
}

/** GitHub Pages serves 404.html for unknown paths, which lets BrowserRouter handle deep links. */
function spaFallback(): Plugin {
  let outDir = "dist";
  return {
    name: "spa-404-fallback",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      copyFileSync(path.join(outDir, "index.html"), path.join(outDir, "404.html"));
    },
  };
}

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [onlyInSiteDocs(), searchIndex(), react(), tailwindcss(), spaFallback()],
  resolve: {
    alias: {
      "@": path.resolve(here, "src"),
      "@content": contentDir,
    },
  },
  server: {
    fs: { allow: [here, contentDir] },
  },
});
