# Dethanev Blog

Dethanev 的個人網站與部落格。這裡放開發筆記、專案紀錄、近況頁，以及一些做東西時踩到的坑。

網站以 Astro 為主，內容走靜態產生，互動與動效用少量 client-side script 補上。視覺風格是 Neubrutalism：粗框、硬陰影、高彩度貼紙色、display 字體與一點故意不太正經的語氣。

## Tech Stack

- Astro 7
- TypeScript
- MDX content collections
- Tailwind CSS v4
- GSAP
- Lenis
- Astro sitemap
- Fontsource variable fonts

## Project Structure

```text
src/
  components/       Reusable Astro components
  content/posts/    Blog posts in MDX
  layouts/          Base and post layouts
  lib/              Shared utilities
  pages/            Astro routes
  scripts/          Browser-side interactions and animations
  styles/           Global CSS and design tokens

public/             Static public assets
astro.config.mjs    Astro configuration
src/content.config.ts
                    Content collection schema
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run local development server:

```bash
npm run dev
```

Build static output:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Content

Blog posts live in `src/content/posts/` and use MDX.

Required frontmatter:

```yaml
---
title: "Post title"
description: "Short post description"
date: 2026-06-05
tags: ["project", "astro"]
variant: "yellow"
---
```

Supported `variant` values:

```text
paper
pink
yellow
lime
violet
```

Draft posts can be hidden from listing pages with:

```yaml
draft: true
```

## Main Routes

- `/` - Home page with intro, latest posts, project showcase, and stack cards.
- `/blog` - Blog index and tag filtering.
- `/blog/[slug]` - Individual post pages.
- `/about` - Public self-introduction.
- `/now` - Current status page.

## Design Notes

The site uses CSS tokens defined in `src/styles/global.css`. New UI should reuse the existing colors, typography, borders, shadows, and component patterns instead of introducing a separate design system.

Core visual rules:

- Use `var(--bg)`, `var(--ink)`, `var(--paper)`, and `var(--accent-*)`.
- Keep the rough Neubrutalism feel: thick borders, hard shadows, high contrast, and small rotations.
- Prefer scoped Astro styles for page/component-specific CSS.
- Avoid soft SaaS cards, glassmorphism, generic gradients, and unrelated UI frameworks.

## Local-Only Notes

Local AI/project notes are kept under `.local-docs/` and are intentionally ignored by git.

Examples:

```text
.local-docs/instructions/
.local-docs/style/
.local-docs/info/
```

These files are for local planning and agent guidance only. They should not be committed as part of the public site.

## Deployment

The site is configured as a static Astro build with:

```js
site: "https://dethanev.app"
output: "static"
```

The production artifact is generated in `dist/` by `npm run build`.
