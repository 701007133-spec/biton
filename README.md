# BITON

BITON is a free, open library of documented interface flows, design systems, and components. The current site is a single-page static application with its catalogue and UI embedded in `index.html`. Browse or search by topic, phone/desktop/web app type, and accent color. The catalogue also includes clearly labeled original concept studies alongside its design references.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server. There is no package installation, build step, database, or server-side runtime. Saved designs are stored locally in each visitor's browser.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Import that repository in Vercel and set the project root to the repository root.
3. Use the `Other` framework preset, leave the build command empty, and set the output directory to `.`.
4. Deploy. Vercel serves `index.html` directly; in-app routes use URL fragments, so they do not require server rewrites.

`vercel.json` configures the static output and baseline security headers. No environment variables or credentials are required. The catalogue is static; a server-side API should be added only if the product later needs shared user data, submissions, or live catalogue updates.

## Domain

`biton.is-a.dev` is a candidate domain, not a registered or configured domain. Connect it to the deployed Vercel project only after deployment and domain ownership are confirmed.

## License

The source code is available under the MIT License in `LICENSE`. The BITON name and logo are brand assets and are not licensed by that code license.
