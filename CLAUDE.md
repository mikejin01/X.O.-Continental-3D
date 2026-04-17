# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

XO Continental website — a React app that wraps and customizes a Webflow-exported template. Three pages: `/` (home with an injected custom hero), `/about`, `/contact`. Home has a custom hero section injected into the Webflow iframe; about and contact render Webflow HTML directly inside iframes.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Architecture

### Hybrid Webflow + React approach

The site serves pre-exported Webflow HTML pages from `public/site/` inside iframes. React handles routing and branding customization.

- **`src/main.jsx`** — React entry point, wraps `App` in `BrowserRouter` using `import.meta.env.BASE_URL` as basename
- **`src/App.jsx`** — Routes: `/` → `HomePage`, `/about` and `/contact` → `WebflowPage` (iframe into `public/site/`). Unknown paths redirect to `/`.
- **`src/utils/replaceBrand.js`** — `replaceBrandInDocument()` walks the iframe DOM to replace "Unusually" with "X.O. Continental", patch social links, rewrite the footer logo/brand block and footer bottom bar.
- **`src/components/HomePage.jsx`** — Loads the Webflow homepage in an iframe, applies branding, then calls `injectHero()` to insert the custom hero. Shows a loading screen (spinning logo) until the hero is ready.
- **`src/components/heroInjector.js`** — The core hero injection logic. Injects CSS + HTML directly into the Webflow iframe's DOM. Loads UnicornStudio SDK for the animated background. Runs GSAP entrance animations using the iframe window's GSAP instance (not the parent's).

### Key libraries

- **GSAP** — Animation (entrance timelines, ScrollTrigger in Webflow pages). The Webflow pages ship their own GSAP via `public/site/js/webflow.js`; the heroInjector uses that iframe-scoped instance.
- **UnicornStudio** — WebGL animated background in the hero. Loaded via CDN script injection (project ID: `ls2GMMfphEx75JbBhSXt`).
- **React Router DOM** — Client-side routing between pages.

### Static assets

- `public/site/` — Webflow export for `/about` and `/contact` pages (HTML, CSS, JS, fonts, images, videos). Served directly in iframes.
- `public/` (root) — Custom assets used by the injected hero and home page: cube videos/images, client logos, `projects/Chuan-Bistro-web.avif`, fonts.

### Deployment

- **GitHub Pages** — CI via `.github/workflows/deploy.yml`, deploys on push to `main`. Base path: `/X.O.-Continental-3D/`
- **Railway** — Detected via `RAILWAY_ENVIRONMENT` env var, uses base path `/`
- The `vite.config.js` `base` option switches between these two.

### Important patterns

- All image/asset paths in injected hero HTML must use the `import.meta.env.BASE_URL` prefix to work on both GitHub Pages and Railway.
- The Webflow iframe and React parent are same-origin (both served from the same Vite build), so direct DOM manipulation of `frame.contentDocument` works.
- Custom fonts (Coolvetica, Humane) are loaded via `@font-face` in the injected hero CSS, pointing to `public/fonts/`.
