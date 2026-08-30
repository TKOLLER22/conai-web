@AGENTS.md

# ConAI Website

Marketing website for ConAI (conai.sk) — a rebuild of the current site with more personality, room to breathe, and conversion-focused copy.

## Plan

Always have a plan first, never ship the first iteration. Before implementing the plan, run `/replan:replan` on the plan to hone it.

## Company

ConAI is a firm focusing on implementing AI solutions for small to mid-sized clients. They don't want to replace human workforce but augment it using AI and AI tools.

ConAI also offers other solutions per request: websites, dashboards, RAG, automatization, consulting, etc.

The goal is to make companies more efficient with the assistance of AI.

## Design

The current design (conai.sk) lacks personality, feels conformist and crammed. Make it breathe more. Keep the colors, just make them bolder and make the gradients work in our favour. Run `/no-ai-slop` on design work.

We love animations — don't overdo it, but a nice set of GSAP. Install with:

```
npm install gsap
npm install @gsap/react
```

**Performance is everything.** If it has animation and looks cool but lacks performance, it is worth second to none. Make the scrolling smooth, make it satisfying.

### Brand reference (extracted from current conai.sk)

- Background: `#13131A` (body), `#0E0E14` (deep), surfaces `#1E1E28` / `rgba(30,30,40,0.55)`
- Violet accents: `#8B5CF6`, `#A78BFA`, `#C4B5FD`; secondary periwinkle `#9E9EFF`
- Support colors: emerald `#34D399` (checkmarks), orange `#FDBA74` (highlights/badges)
- Gradients: buttons `135deg #8B5CF6 → #A78BFA`; hero radial glow `rgba(147,51,234,0.28)`
- Font: Inter everywhere. H1 64px/700, letter-spacing -0.02em
- 3D logo asset: `/Users/tomaskoller/Blender/conai-icon.glb` — single mesh, ~11.8k verts, material "ConAI Purple Metal" (purple ≈ `#9843C6`, roughness 0.3, no textures)

## Technologies

Next.js with React and Tailwind (preferred).

## Typography

We are looking for conversion. Not just a plain old landing page — that's boring. We want personality; show that we are capable and trustworthy.

## Questions

Always ask as many questions as you need. If you aren't 100% sure, don't hesitate to ask.

## Deployment

Hosted on the user's Coolify instance on a VPS. Ask the user for anything needed for deployment (repo, domain, env, etc.).

## Roadmap (user-requested future features)

- Revisit the color palette — the user is NOT fully sold on the current violet-on-dark; propose bolder alternatives while keeping ConAI brand recognition. NOTE: both themes now consume the same tokens, so a palette change = editing the two variable blocks in app/globals.css (dark in @theme, light under [data-theme="light"]).

Done from this list: light/dark mode switch (2026-08-30 — dark default, localStorage + prefers-color-scheme boot script, tokens-only theming, light logo variant at public/brand/logo-232-light.png); prefix-less locale URLs (cookie/Accept-Language via next-intl `localePrefix: 'never'`, 2026-08-30). Deliberate tradeoff, user-approved: EN pages share URLs with SK so EN is not separately indexable (except insights articles, which keep locale-specific slugs and stay crawlable). Caching: Next owns the Vary header on documents (custom values are dropped, from middleware AND next.config), so HTML is made shared-cache-proof the blunt way — `Cache-Control: private, no-cache` on all documents via next.config headers() (verified on the wire); hashed /_next/static assets keep immutable year-long caching. A future CDN may cache assets freely but must never cache HTML. Indexing safety is host-based at request time (X-Robots-Tag + dynamic robots.txt for non-production hosts) and the Docker build-arg defaults to production — staging needs no configuration to be safe.
