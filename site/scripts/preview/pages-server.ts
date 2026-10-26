import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

/**
 * Serves `dist/` the way GitHub Pages serves a project site: files under the base path,
 * and `404.html` with a 404 status for anything else. `vite preview` falls back to
 * index.html on its own, which would hide a missing or broken 404.html.
 */
const port = Number(process.argv[2] ?? 4180);
const base = (process.env.BASE_PATH ?? "/").replace(/\/?$/, "/");
const root = path.resolve(process.argv[3] ?? "dist");

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".wasm": "application/wasm",
};

function send(res: import("node:http").ServerResponse, file: string, status = 200) {
  res.writeHead(status, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  if (pathname.startsWith(base) || `${pathname}/` === base) {
    const rel = pathname.slice(base.length);
    let file = path.join(root, rel);
    if (file.startsWith(root) && existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (file.startsWith(root) && existsSync(file) && statSync(file).isFile()) return send(res, file);
  }
  send(res, path.join(root, "404.html"), 404);
}).listen(port, () => console.log(`Pages preview of ${root} at http://localhost:${port}${base}`));
