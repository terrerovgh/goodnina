# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Portfolio site for tattoo artist Nina Romero at [goodnina.com](https://goodnina.com). Astro 5 with `output: "static"` and Tailwind v4, no UI framework, plus an admin panel at `/admin` backed by Cloudflare Pages Functions. Cloudflare Pages builds and deploys on every push to `main` (Git integration); the GitHub Actions workflow only checks that the build passes.

## Commands

```sh
npm ci
npm run dev        # generate missing image sizes, then astro dev on 0.0.0.0:4321
npm run build      # generate missing image sizes, then static build into dist/ (the only CI check)
npm run typecheck  # tsc for src/ and for functions/ (two tsconfigs)
npm run preview    # serve dist/ with Astro
npx wrangler pages dev dist   # serve dist/ the way Cloudflare does: _headers, _redirects and the /api/admin Functions
```

Node 22+ (`.nvmrc`). There are no automated tests and no linter. `npm run check` runs `astro check`, but `@astrojs/check` is not a dependency, so it prompts to install it on first use.

The admin API only exists under `wrangler pages dev`, not under `astro dev`. It needs a `.dev.vars` file (copy `.dev.vars.example`); set `GITHUB_BRANCH` to a scratch branch there so test publishes never reach `main`.

## Architecture

### Content: data files, edited by the admin panel
What the artist can change lives in `src/data/`: `gallery.json` (works in mosaic order, plus `cover`, the ids of the homepage strip), `texts.json` (hero, intro and its two photos, styles, quote, FAQ, booking) and `news.json` (announcements). Every text leaf there is `{ es, en }`.

`src/lib/schema.ts` defines those shapes and validates them. It is imported by the site build, the admin panel and the Pages Functions, so it must stay free of imports and of DOM or Node APIs. Its error messages are in Spanish because the panel shows them as they are.

`src/lib/content.ts` parses the data files (a malformed file fails the build) and merges them with the text that stays in code (SEO titles, navigation, gallery labels, footer, legal pages) into the `copy.en` / `copy.es` objects the components read. Components contain layout only.

### Admin panel
`/admin` (`src/pages/admin/index.astro`, `src/admin/*.ts`) is a framework-free page with its own stylesheet (`src/admin/admin.css`, `adm-` class names, excluded from Tailwind by `@source not` in `src/styles.css`) so nothing from it reaches the public pages. Edits accumulate in the browser; **Publicar** sends everything in one request.

`functions/api/admin/` are Cloudflare Pages Functions; the logic they share is in `src/server/`:

- `_middleware.ts` verifies the Cloudflare Access JWT and an email allow-list on every request. This is required, not a second layer: `*.pages.dev` is not behind Access.
- `state.ts` returns the data files from the head of the branch, with that commit's sha.
- `publish.ts` validates the content, then writes the data files, new photos and deletions as **one commit** through the Git Data API (`src/server/github.ts`). `src/server/publish.ts` is the pure function that decides which files change. If the branch moved since the panel loaded, it answers 409.
- `image.ts` serves an original photo from the repository, for thumbnails of photos that are committed but not deployed yet.

The panel reads and writes the repository, not the deployed site. After a publish it polls `/version.json` (the commit the live build came from) to tell when the change is online.

Ids of new photos and announcements are slugs generated in the panel from the description or title. A photo never overwrites an existing file: a changed photo always gets a new id.

### Bilingual on a single URL
There are no per-language routes. Pages are rendered in English, and Spanish is swapped in on the client by `applyLang` in `src/scripts/site.ts`. The choice comes from `localStorage["nina-lang"]`, falling back to the browser language.

Every piece of translatable markup therefore carries both strings:

- text: `data-en` and `data-es` on the element, with the English string as its content. The swap sets `textContent`, so such an element must contain only text, no child elements.
- image alts: `data-alt-en` / `data-alt-es`
- aria labels: `data-aria-en` / `data-aria-es`
- page title and description: `data-title-*` / `data-desc-*` on `<html>`, set by `Base.astro`

Text added without these attributes stays English after the switch. Canonical URLs, Open Graph tags, and JSON-LD are emitted in English only.

Route slugs and section anchors are Spanish (`/galeria`, `/aviso`, `/privacidad`, `#sobre`, `#agendar`, `#contenido`) regardless of display language.

### Client script and its data attributes
`src/scripts/site.ts` is the only JavaScript on public pages, loaded from `Base.astro`. It finds everything through data attributes, so the components and the script must agree on them:

- `data-lang-btn="es|en"`: language buttons
- `data-header`, `data-over-hero`, `data-on-photo`: the header is transparent over the hero photo until the page scrolls (styles in `src/styles.css`)
- `data-gallery` root with `data-open="<work id>"` buttons: opens `<dialog id="lightbox">` (`Lightbox.astro`)
- `data-filter` chips and `data-category` items: gallery filtering; the lightbox steps through visible items only
- `data-scroller` and `data-scroll="±1"`: the draggable homepage strip

### Images
A work's `id` is its filename. The original is `public/images/gallery/<id>.jpg` (long side at most 1600 px; the panel downsizes uploads in the browser), and pages load `/images/opt/gallery/<id>-480.webp` and `<id>-960.webp` (`src/lib/img.ts`; the lightbox builds the same path by hand in `site.ts`). Announcement photos follow the same layout under `news/`.

`scripts/build-images.mjs` runs before `dev` and `build` and generates any missing WebP from its original. The WebP files that were already in git stay tracked; the ones for photos added later are build output and ignored (see `.gitignore`). The two photos of the intro section ("Drawn for the person wearing it") are their own kind, `intro/`, listed in `texts.json` under `intro.images` (large photo first) and replaced from the Textos tab; they are not gallery works, so removing a work cannot break the homepage.

### SEO
`Base.astro` takes a `page` prop (`SeoPage` in `src/lib/seo.ts`) and derives title, description, canonical, and the JSON-LD graph from it. Adding an indexable page touches four places: the `SeoPage` union, `seoFor` and the breadcrumb list in `seo.ts`, meta copy in `content.ts`, and the `indexed` set in `astro.config.mjs` that filters the sitemap.

### Redirects
Legacy URLs (old English and German paths) are redirected twice: in `public/_redirects` for Cloudflare, and as stub pages in `src/pages/` that call `Astro.redirect`. Keep both in step when adding one.

### Styling
Tailwind v4 has no config file here. Design tokens (colors, type scale, shadows) are in the `@theme` block of `src/styles.css`, along with the handful of non-utility rules (header states, filter chips, lightbox).

## Performance constraints

The homepage was rebuilt to score 100 on mobile PageSpeed, which is why it looks the way it does. Keep these in place:

- no client framework or hydration on public pages; `site.ts` is the only script, and gallery setup waits for idle time
- `site.ts` is inlined into each page only while its bundle stays under Vite's 4 KB `assetsInlineLimit`; it is close to that now, and past it Astro emits a separate request. The announcement expiry check is an inline script in `News.astro` for that reason
- CSS is inlined (`build.inlineStylesheets: "always"`)
- fonts are self-hosted in `public/fonts/` with `font-display: optional`
- only `hero-720.webp` is preloaded, and only on pages that pass `overHero`
- sections below the hero use `.below-fold` (`content-visibility: auto`)
- images have explicit `width` and `height`, and everything but the hero is `loading="lazy"`
