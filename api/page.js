const fs = require("node:fs");
const path = require("node:path");

const categories = ["mobile-apps", "websites", "dashboards", "components"];

module.exports = function handler(req, res) {
  const slug = typeof req.query.slug === "string" ? req.query.slug : "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    res.status(400).send("Invalid page name.");
    return;
  }
  const candidates = [];
  candidates.push(path.join(process.cwd(), "sites", slug + ".html"));
  candidates.push(path.join(process.cwd(), "sites", slug, "index.html"));
  for (const category of categories) {
    candidates.push(path.join(process.cwd(), "categories", category, slug + ".html"));
  }
  for (const file of candidates) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
      res.status(200).send(fs.readFileSync(file));
      return;
    }
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(fs.readFileSync(path.join(process.cwd(), "index.html")));
};
