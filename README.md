# Website

My website and blog, live at [violetcaulfield.com](https://violetcaulfield.com).

Built with [Astro](https://astro.build) as a static site, and served from [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/). The blog and RSS feed work the same way as the [Jellify website](https://jellify.app/blog).

## Getting Started

Use [Bun](https://bun.sh) (the version in `package.json`'s `packageManager`). Everything runs on Bun's runtime, including Astro and Wrangler, so Node isn't needed.

```bash
bun install
bun run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Writing a Post

Add a Markdown or MDX file to `src/content/blog/`. The file name is the URL, so `2026-11-19.mdx` is served at `/blog/2026-11-19`. A second post on the same day can be named `<date>-<slug>.mdx`.

```mdx
---
title: Hello, world
date: 2026-11-19
description: Optional. Shown on /blog and in the feed; falls back to the first paragraph.
---
```

Each post shows up on `/blog`, on the home page's "Recent posts", and in the full-text feed at `/blog/rss.xml`.

## Project Structure

| Path                    | What's there                                                                 |
| ----------------------- | ---------------------------------------------------------------------------- |
| `src/pages/`            | File-based routes: home, `/blog`, `/blog/[id]`, `/blog/rss.xml`, `/contact`  |
| `src/content/blog/`     | Blog posts                                                                   |
| `src/config/index.ts`   | Name, email, nav, social links, and projects                                 |
| `src/styles/global.css` | Theme colors and base styles: Jellify's primary purple with a pink accent    |
| `public/`               | Static assets served as-is, including the self-hosted Allo font in `fonts/`  |
| `src/assets/avatar.jpg` | Square profile photo that the avatar, favicon, and social card come from     |
| `scripts/og-image.mjs`  | Regenerates the avatar, favicon, touch icon, and `og.png` from the photo     |
| `wrangler.jsonc`        | Cloudflare Workers configuration, including the `violetcaulfield.com` route  |
| `design/`               | Penpot design file, plus the Allo OTFs to upload to Penpot as a team font    |

Light and dark themes follow the visitor's system preference. Text is set in [Allo](https://allo.joshpuckett.me) (SIL Open Font License), self-hosted from `public/fonts/` rather than installed from npm.

## Deploying

The first `bun run deploy` asks Wrangler to log in, then creates the Worker and attaches `violetcaulfield.com` as a [custom domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) (DNS record and certificate included).

The contact page links to `hello@violetcaulfield.com`. Turn on [Email Routing](https://developers.cloudflare.com/email-routing/) for the domain in the Cloudflare dashboard and forward that address to your inbox.

To serve `www.violetcaulfield.com` too, add it as a custom domain and a [redirect rule](https://developers.cloudflare.com/rules/url-forwarding/) to the apex.

## Scripts

| Command                  | Description                                                |
| ------------------------ | ---------------------------------------------------------- |
| `bun run dev`            | Start the dev server                                       |
| `bun run build`          | Production build into `dist/`                              |
| `bun run preview`        | Build and serve `dist/` locally with Wrangler              |
| `bun run lint`           | Lint with ESLint                                           |
| `bun run typecheck`      | Typecheck with `astro check`                               |
| `bun run og-image`       | Regenerate the avatar, favicon, touch icon, and social card |
| `bun run deploy`         | Build and deploy to Cloudflare Workers                     |
| `bun run deploy:version` | Build and upload a new Worker version without promoting it |
