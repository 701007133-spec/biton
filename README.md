# BITON

BITON is a free, open library of fictional interface concepts for people and AI agents. Every catalogue entry is an original design study, not a real product, verified product reference, or screenshot. Concepts include a proposed palette, typography, spacing, components, and a written flow.

BITON is built for everyone, with Daemon as its integrated agent. Concept pages and copied prompts give Daemon the proposed palette, typography, spacing, flow, and components to build from. Anyone can explore the library, and copied prompts can also be used with other AI agents. Explore the live project at [biton-eta.vercel.app](https://biton-eta.vercel.app/).

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server. There is no package installation, build step, database, or server-side runtime. Saved designs are stored locally in each visitor's browser.

## Project files

- `index.html` contains the complete single-page site, its concept catalogue, styles, and scripts.
- `categories/` holds complete HTML pages, organized by category. A page such as `categories/mobile-apps/vault-x.html` is served at `/vault-x` after it is merged to the main branch.
- `LICENSE` contains the MIT License for the source code. The BITON name and logo are brand assets and are not licensed by that code license.

## Add a webpage without installing anything

Choose a category in the site's contribution section, create a complete `.html` file in that folder using GitHub's web editor, and open a pull request. No local tools are needed. After review and merge, the page is available at a clean URL based on its filename: `vault-x.html` becomes `/vault-x`. Pages are served as HTML, not listed as data or imported into BITON's concept catalogue.
