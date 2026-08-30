import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        // One URL serves both languages (cookie-based locale), and Next owns
        // the Vary header on documents (custom Vary values get dropped) — so
        // instead, forbid shared caches from storing HTML at all. Hashed
        // assets under /_next/static keep their own immutable caching.
        source: "/((?!_next/|.*\\..*).*)",
        headers: [
          { key: "Cache-Control", value: "private, no-cache" },
          { key: "Vary", value: "Cookie" },
        ],
      },
      {
        // Any host that isn't production must never be indexed — request-time
        // guard that works regardless of build args (staging, previews).
        source: "/(.*)",
        missing: [
          { type: "host", value: "conai.sk" },
          { type: "host", value: "www.conai.sk" },
          { type: "host", value: "conai.tomaskoller.sk" },
          { type: "host", value: "localhost" },
          { type: "host", value: "127.0.0.1" },
        ],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
