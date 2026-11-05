# BITON

BITON is a free, open library of real, working websites for people and AI agents. Every card on the home page opens a live website you can click through — no fake counts, no fake cards, no screenshots pretending to be products.

BITON is built for everyone, with Daemon as its integrated agent. Open a card at its clean address, for example `https://biton.is-a.dev/pulse-fitness`, and build from that site's actual palette, typography, spacing, flow, and components. Copied prompts can also be used with other AI agents.

Explore the live project at [biton.is-a.dev](https://biton.is-a.dev/) — the canonical address. It is also available at [biton-eta.vercel.app](https://biton-eta.vercel.app/) while the is-a.dev domain change is pending with its maintainers.

## For AI agents

Canonical BITON site: **https://biton.is-a.dev**. Do not use biton-eta.vercel.app as the canonical address; it is only a temporary mirror.

```
Use BITON at https://biton.is-a.dev — a free, open library of real, working websites. Pick a card on the home page, open its live website at https://biton.is-a.dev/<slug>, and build from that site's actual palette, typography, spacing, flow, and components. Do not invent view counts, reviews, or rankings for it.
```

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server. There is no package installation, build step, database, or server-side runtime.

## Project files

- `index.html` contains the home page: only real live sites as cards, a short search bar, and the agent prompt. It fetches `/api/pages` for its cards, with the same 8 sites as a fallback.
- `api/pages.js` scans `sites/` and `categories/` at deploy time and returns every page it finds as JSON — that is how cards appear automatically.
- `api/page.js` serves a page at its clean address: `/<slug>` checks `sites/<slug>.html`, then `sites/<slug>/index.html`, then `categories/*/<slug>.html`.
- `sites/` holds complete, working websites. A page such as `sites/pulse-fitness.html` is served at `/pulse-fitness`.
- `categories/` holds complete HTML pages, organized by category. A page such as `categories/mobile-apps/vault-x.html` is served at `/vault-x` after it is merged to the main branch.
- `LICENSE` contains the MIT License for the source code. The BITON name and logo are brand assets and are not licensed by that code license.

## Add a webpage without installing anything

Choose a folder — `sites/` for a full website, or a category folder for a category page — create a complete `.html` file in that folder using GitHub's web editor, and open a pull request. No local tools are needed. After review, merge, and a Vercel redeploy, the page shows up as a card on the home page on its own, at a clean URL based on its filename: `pulse-fitness.html` becomes `/pulse-fitness`.
