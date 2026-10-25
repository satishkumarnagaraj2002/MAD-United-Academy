import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const useDist = process.argv.includes("--dist");
const base = path.join(root, useDist ? "dist" : "");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8"
};

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  let relative = decodeURIComponent(pathname).replace(/^\/+/, "");
  if (!relative) relative = "index.html";
  if (!useDist && (relative.startsWith("images/") || relative === "styles.css" || relative === "robots.txt")) {
    relative = path.join("public", relative);
  }
  if (relative === "sitemap.xml" && !useDist) {
    response.writeHead(404).end("Build with SITE_URL to generate the sitemap.");
    return;
  }

  let filePath = path.resolve(base, relative);
  if (!filePath.startsWith(`${base}${path.sep}`) && filePath !== path.join(base, "index.html")) {
    response.writeHead(400).end("Invalid path");
    return;
  }

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, "index.html");
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      response.writeHead(500).end("Unable to serve this page.");
      console.error(error);
      return;
    }
    if (path.extname(relative)) {
      response.writeHead(404).end("Not found");
      return;
    }
    try {
      const body = await readFile(path.join(base, "index.html"));
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      });
      response.end(request.method === "HEAD" ? undefined : body);
    } catch (fallbackError) {
      response.writeHead(500).end("Build the site before previewing it.");
      console.error(fallbackError);
    }
  }
});

const port = Number(process.env.PORT ?? 4173);
server.listen(port, "127.0.0.1", () => {
  console.log(`${useDist ? "Preview" : "Development"} server ready at http://127.0.0.1:${port}`);
});
