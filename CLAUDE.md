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

- Light/dark mode switch (site is dark-only today; build tokens accordingly).
- Better localization UX: no visible `/sk` / `/en` URL prefixes (cookie/negotiation-based, e.g. next-intl `localePrefix: 'never'`) — weigh SEO/hreflang tradeoffs before switching.
- Revisit the color palette — the user is NOT fully sold on the current violet-on-dark; propose bolder alternatives while keeping ConAI brand recognition.
