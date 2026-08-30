"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Locale prefixes never appear in URLs, so switching is a cookie write plus
 * a server-component refresh — the URL stays exactly as it is. (Navigating
 * to a prefixed URL and relying on the middleware redirect is racy with
 * Next's prefetch cache and can leave /sk visible in the address bar.)
 */
export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: string) => {
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;SameSite=Lax`;
    if (pathname.startsWith("/insights/")) {
      // Article slugs are locale-specific — land on the listing instead.
      window.location.assign("/insights");
    } else {
      router.refresh();
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
