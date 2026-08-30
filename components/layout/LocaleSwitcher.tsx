"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  // Insight slugs are locale-specific (SEO parity with the old site), so a
  // same-path switch on an article would 404 — send those to the listing.
  const target = pathname.startsWith("/insights/") ? "/insights" : pathname;

  return (
    <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-fg-faint/50">/</span>}
          <Link
            href={target}
            locale={l}
            aria-current={l === locale ? "true" : undefined}
            className={
              l === locale
                ? "text-fg"
                : "text-fg-faint transition-colors hover:text-fg"
            }
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
