const fs = require("node:fs");
const path = require("node:path");

const categories = ["mobile-apps", "websites", "dashboards", "components"];
const pagesRoot = path.join(process.cwd(), "categories");

module.exports = function handler(req, res) {
  const slug = typeof req.query.slug === "string" ? req.query.slug : "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    res.status(400).send("Invalid page name.");
    return;
  }

  const matches = categories
    .map((category) => path.join(pagesRoot, category, `${slug}.html`))
    .filter((file) => fs.existsSync(file) && fs.statSync(file).isFile());

  if (matches.length > 1) {
    res.status(409).send("More than one category contains this page name.");
    return;
  }

  if (matches.length === 1) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(fs.readFileSync(matches[0]));
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(fs.readFileSync(path.join(process.cwd(), "index.html")));
};
