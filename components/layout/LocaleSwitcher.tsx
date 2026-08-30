"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Module scope: React Compiler's immutability rule (correctly) refuses
// external mutations inside component bodies.
function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax;Secure`;
}

/**
 * Locale prefixes never appear in URLs, so switching is a cookie write plus a
 * FULL reload. A soft refresh is not enough: other routes' prefetched RSC
 * payloads sit in the client router cache under the old locale (~5 min) and
 * would render mixed-language pages.
 */
export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const switchTo = (next: string) => {
    if (next === locale) return;
    setLocaleCookie(next);
    if (pathname.startsWith("/insights/")) {
      // Article slugs are locale-specific — land on the listing instead.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- deliberate full navigation: bypasses the router cache and the slug doesn't exist in the target locale
      window.location.assign("/insights");
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-fg-faint/50">/</span>}
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-current={l === locale ? "true" : undefined}
            className={
              l === locale
                ? "text-fg"
                : "cursor-pointer text-fg-faint transition-colors hover:text-fg"
            }
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
