const fs = require("node:fs");
const path = require("node:path");

function titleOf(file) {
  try {
    const s = fs.readFileSync(file, "utf8");
    const m = s.match(/<title>([^<]+)<\/title>/i);
    if (m) return m[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
  } catch (e) {}
  return path.basename(file);
}

function scan() {
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
        if (fs.existsSync(idx)) {
          pages.push({ slug: e.name, title: titleOf(idx), url: "/" + e.name, kind: "Live website" });
        }
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
  const pages = scan();
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  res.status(200).send(JSON.stringify({ count: pages.length, pages }));
};
