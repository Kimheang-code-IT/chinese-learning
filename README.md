# Chinese Vocabulary Learning Site

A statically generated Nuxt site for learning Chinese vocabulary, with
[HanziWriter](https://hanziwriter.org/) stroke animation and per-book and
per-word routes.

## Stack

| Area | Technology |
| --- | --- |
| Framework | Nuxt, Vue 3, Vue Router |
| Animation | HanziWriter |
| Styling | Tailwind CSS, Nuxt UI |
| Fonts | Noto Serif SC (Simplified Chinese), Noto Sans Khmer |
| Content | XSLT-generated static vocabulary pages |
| SEO | `@nuxtjs/sitemap`, `@nuxt/image` |
| Hosting | Vercel (`vercel.json`) |

## Layout

```text
Frontend/
  app/
    pages/
      index.vue                 landing page
      words/[book]/index.vue    vocabulary list for a book
      words/[book]/[word].vue   detail view with stroke animation
      [...all].vue              catch-all
```

Most of the repository is generated static vocabulary content rendered through
XSLT.

## Setup

```bash
cd Frontend
pnpm install
pnpm dev
```

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` / `pnpm dev:vite` | Development server |
| `pnpm build` / `pnpm build:vite` | Production build |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `vue-tsc` |
