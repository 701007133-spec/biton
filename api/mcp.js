const fs = require("node:fs");
const path = require("node:path");

function titleOf(file) {
  try {
    const s = fs.readFileSync(file, "utf8");
    const m = s.match(/<title>([^<]+)<\/title>/i);
    if (m) return m[1].replace(/&amp;/g, "&").trim();
  } catch (e) {}
  return path.basename(file);
}

function findPage(slug) {
  const root = process.cwd();
  const candidates = [
    path.join(root, "sites", slug + ".html"),
    path.join(root, "sites", slug, "index.html")
  ];
  const catsDir = path.join(root, "categories");
  if (fs.existsSync(catsDir)) {
    for (const c of fs.readdirSync(catsDir, { withFileTypes: true })) {
      if (c.isDirectory()) candidates.push(path.join(catsDir, c.name, slug + ".html"));
    }
  }
  for (const file of candidates) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  return null;
}

function listPages() {
  const root = process.cwd();
  const pages = [];
  const sitesDir = path.join(root, "sites");
  if (fs.existsSync(sitesDir)) {
    for (const e of fs.readdirSync(sitesDir, { withFileTypes: true })) {
      if (e.isFile() && e.name.endsWith(".html")) {
        const slug = e.name.replace(/\.html$/, "");
        pages.push({ slug, title: titleOf(path.join(sitesDir, e.name)), url: "/" + slug, kind: "Live website" });
      } else if (e.isDirectory()) {
        const idx = path.join(sitesDir, e.name, "index.html");
        if (fs.existsSync(idx)) pages.push({ slug: e.name, title: titleOf(idx), url: "/" + e.name, kind: "Live website" });
      }
    }
  }
  const catsDir = path.join(root, "categories");
  if (fs.existsSync(catsDir)) {
    for (const c of fs.readdirSync(catsDir, { withFileTypes: true })) {
      if (!c.isDirectory()) continue;
      const dir = path.join(catsDir, c.name);
      for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        if (f.isFile() && f.name.endsWith(".html")) {
          const slug = f.name.replace(/\.html$/, "");
          pages.push({ slug, title: titleOf(path.join(dir, f.name)), url: "/" + slug, kind: "Category page" });
        }
      }
    }
  }
  pages.sort((a, b) => a.title.localeCompare(b.title));
  return pages;
}

module.exports = function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  const tool = req.query.tool || "list";
  const pages = listPages();
  if (tool === "list" || tool === "list_pages") {
    return res.status(200).send(JSON.stringify({ tool: "list_pages", count: pages.length, pages }));
  }
  if (tool === "search" || tool === "search_designs") {
    const q = String(req.query.q || "").trim().toLowerCase();
    const hits = q ? pages.filter(p => (p.title + " " + p.slug + " " + p.kind).toLowerCase().includes(q)) : pages;
    return res.status(200).send(JSON.stringify({ tool: "search_designs", query: q, count: hits.length, pages: hits }));
  }
  if (tool === "get_design" || tool === "get_page") {
    const slug = String(req.query.slug || "").trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return res.status(400).send(JSON.stringify({ error: "Invalid slug." }));
    const file = findPage(slug);
    if (!file) return res.status(404).send(JSON.stringify({ error: "No page found for slug: " + slug }));
    const code = fs.readFileSync(file, "utf8");
    const meta = pages.find(p => p.slug === slug) || { slug, title: titleOf(file), url: "/" + slug, kind: "Live website" };
    return res.status(200).send(JSON.stringify({ tool: "get_design", ...meta, code, code_bytes: Buffer.byteLength(code, "utf8") }));
  }
  if (tool === "get_stats") {
    return res.status(200).send(JSON.stringify({ tool: "get_stats", count: pages.length, pages: pages.length }));
  }
  return res.status(200).send(JSON.stringify({
    name: "BITON MCP",
    description: "BITON is a free, open library of real, working websites. Use these tools to find a page, then get its whole code.",
    tools: [
      { name: "list_pages", usage: "/api/mcp?tool=list_pages", returns: "Every live page, with slug, title, url and kind." },
      { name: "search_designs", usage: "/api/mcp?tool=search_designs&q=pulse", returns: "Pages matching the query." },
      { name: "get_design", usage: "/api/mcp?tool=get_design&slug=pulse-fitness", returns: "The page's title, url, kind and its whole HTML code in 'code' — read it all before you rebuild from it." },
      { name: "get_stats", usage: "/api/mcp?tool=get_stats", returns: "How many live pages there are, counted from the real files." }
    ],
    docs: "/mcp",
    site: "https://biton.is-a.dev"
  }));
};
