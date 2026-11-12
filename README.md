# Nina Romero — [goodnina.com](https://goodnina.com)

Portfolio site. Astro 5 (static HTML) + Tailwind v4. Hosted on **Cloudflare Pages** from this repository.

## Cloudflare Pages

In [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages):

1. **Create** → **Pages** → **Connect to Git** → `terrerovgh/goodnina`
2. Production branch: `main`
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
   - **Node.js version:** `22` (Environment variable `NODE_VERSION=22`, or this repo’s `.nvmrc`)
4. Save and deploy. Then **Custom domains** → `goodnina.com` (and `www` if you use it).

If a Pages project is already connected to this repo, pushing `main` is enough — Cloudflare rebuilds on every push.

Local preview of the production build: `npm ci && npm run build && npx wrangler pages dev dist`

## Admin panel (`/admin`)

Nina edits the gallery (drag to reorder, add and remove photos), announcements, and the main texts at `goodnina.com/admin`. Pressing **Publicar** writes one commit to `main` through the GitHub API, and Cloudflare rebuilds the site in a minute or two. The content lives in `src/data/*.json`; the public site stays static.

One-time setup:

1. **GitHub token.** Create a fine-grained personal access token limited to `terrerovgh/goodnina` with **Contents: Read and write**. If it has an expiry date, the panel stops publishing that day.
2. **Cloudflare Access.** In Zero Trust → Access → Applications, add a *self-hosted* application for `goodnina.com/admin` and `goodnina.com/api/admin`, with the One-time PIN login method and an *Allow* policy listing the emails that may enter. Note the team domain (`<team>.cloudflareaccess.com`) and the application's **AUD** tag.
3. **Pages project → Settings → Variables and Secrets**, added as secrets for Production:

   | Name | Value |
   |---|---|
   | `GITHUB_TOKEN` | the token from step 1 |
   | `ADMIN_EMAILS` | the allowed emails, comma-separated (same as the Access policy) |

   `GITHUB_REPO`, `GITHUB_BRANCH`, `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` are not secret and are set in `wrangler.jsonc`. Because that file defines `vars`, Pages takes plain variables from it rather than from the dashboard; secrets still come from the dashboard.

The API checks the Access token itself on every request, so `goodnina.pages.dev/api/admin/*` answers 401 even though Access only covers the custom domain.

To run the panel locally: copy `.dev.vars.example` to `.dev.vars`, fill in a token, then `npm run build && npx wrangler pages dev dist` and open `http://localhost:8788/admin`. Point `GITHUB_BRANCH` at a scratch branch so test publishes never reach `main`.

To undo something published from the panel, revert its commit (`Panel: actualiza …`) in git.

Booking: [Venue](https://venue.ink/@goodnina_tattooing) · Instagram [@goodnina_tattooing](https://www.instagram.com/goodnina_tattooing/)
