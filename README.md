# ConAI Website

Marketing site for [conai.sk](https://conai.sk) — Next.js 16 (App Router), Tailwind v4, next-intl (sk/en), GSAP, react-three-fiber.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000 (redirects to /sk)
npm test           # vitest: ROI math, insights frontmatter, SEO alternates
npm run lint
```

Useful: append `?nomotion=1` to any URL to disable all entrance animations (visual testing, Lighthouse).

## Content

- Copy lives in `messages/sk.json` / `messages/en.json`, organized per page namespace.
- Blog articles are MDX files in `content/insights/{sk,en}/<slug>.mdx` — slug = filename, frontmatter: `title`, `date`, `category`, `excerpt`, `readMinutes`. New article = new file + redeploy.
- The hero 3D model is `public/models/conai-icon.glb` (optimized via gltf-transform from the Blender export).

## Build & deploy (Coolify)

Multi-stage `Dockerfile` (standalone output, node:22-alpine, port 3000, healthcheck on `/sk`).

```bash
docker build -t conai-web .
docker run -p 3000:3000 conai-web
```

In Coolify: new application → Git repository → build pack **Dockerfile** → port 3000 → attach domain. No environment variables required. For a staging deploy, set `NEXT_PUBLIC_SITE_URL` (build-time) so canonicals/sitemap don't point at conai.sk.

## SEO

- `app/sitemap.ts` + `app/robots.ts` (canonical host: https://conai.sk)
- Per-page localized metadata with hreflang alternates
- JSON-LD: Organization (global), FAQPage (/about), Article (insights)
- OG image generated per locale at `/{locale}/opengraph-image`
