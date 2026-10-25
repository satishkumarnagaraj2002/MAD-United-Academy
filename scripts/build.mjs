import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { routeMetadata } from "../src/config.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const routes = Object.keys(routeMetadata);
const configuredSiteUrl = process.env.SITE_URL?.trim().replace(/\/+$/, "");
const siteUrl = configuredSiteUrl ? new URL(configuredSiteUrl).origin : "";
const enquiryEndpoint = process.env.ENQUIRY_ENDPOINT?.trim() ?? "";

if (siteUrl && !["http:", "https:"].includes(new URL(siteUrl).protocol)) {
  throw new Error("SITE_URL must use HTTP or HTTPS.");
}
if (enquiryEndpoint) {
  const endpointUrl = new URL(enquiryEndpoint);
  if (endpointUrl.protocol !== "https:" && endpointUrl.hostname !== "localhost" && endpointUrl.hostname !== "127.0.0.1") {
    throw new Error("ENQUIRY_ENDPOINT must use HTTPS, except for a localhost development endpoint.");
  }
  if (endpointUrl.username || endpointUrl.password || endpointUrl.hash) {
    throw new Error("ENQUIRY_ENDPOINT must not contain credentials or a URL fragment.");
  }
}

const escapeHtmlAttribute = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeXml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, "src"), path.join(output, "src"), { recursive: true });
await cp(path.join(root, "public"), output, { recursive: true });
const template = await readFile(path.join(root, "index.html"), "utf8");

for (const route of routes) {
  const [title, description] = routeMetadata[route];
  const canonical = siteUrl
    ? `<link rel="canonical" href="${siteUrl}${route === "/" ? "/" : route}">`
    : "";
  const page = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${title}">`)
    .replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${description}">`)
    .replace(/<meta name="enquiry-endpoint" content=".*?">/, `<meta name="enquiry-endpoint" content="${escapeHtmlAttribute(enquiryEndpoint)}">`)
    .replace("</head>", `${canonical}\n  </head>`);
  const routeDirectory = path.join(output, route.replace(/^\/|\/$/g, ""));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(path.join(routeDirectory, "index.html"), page);
}

await cp(path.join(root, "robots.txt"), path.join(output, "robots.txt"));

if (siteUrl) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${escapeXml(`${siteUrl}${route}`)}</loc></url>`).join("\n")}\n</urlset>\n`;
  await writeFile(path.join(output, "sitemap.xml"), sitemap);
  await writeFile(path.join(output, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  console.log(`Built ${routes.length} pages, canonical URLs, and sitemap for ${siteUrl}`);
} else {
  console.log(`Built ${routes.length} pages. Set SITE_URL to generate canonical URLs and sitemap.xml.`);
}
