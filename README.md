# Nina Romero — [goodnina.com](https://goodnina.com)

Portfolio site. Astro 5 + React islands + Tailwind v4. Hosted on **Cloudflare Pages** from this repository.

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

Booking: [Venue](https://venue.ink/@goodnina_tattooing) · Instagram [@goodnina_tattooing](https://www.instagram.com/goodnina_tattooing/)
