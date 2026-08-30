"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";

const NAV = [
  { key: "about", href: "/about" },
  {
    key: "services",
    href: "/services",
    children: [
      { key: "forCompanies", href: "/services" },
      { key: "forIndividuals", href: "/individuals" },
      { key: "roiCalc", href: "/pricing#roi" },
    ],
  },
  { key: "work", href: "/work" },
  { key: "pricing", href: "/pricing" },
  { key: "insights", href: "/insights" },
] as const;

// Mobile list = flattened desktop nav + contact (desktop reaches it via footer).
const MOBILE_NAV: { key: string; href: string }[] = [];
for (const item of NAV) {
  if ("children" in item) {
    for (const child of item.children) {
      if (!child.href.includes("#")) MOBILE_NAV.push(child);
    }
  } else {
    MOBILE_NAV.push(item);
  }
}
MOBILE_NAV.push({ key: "contact", href: "/contact" });

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export default function Header() {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 12,
    () => false,
  );

  // Scroll lock while the mobile menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        open
          ? // solid, unfiltered: backdrop-filter here would become the
            // containing block for the fixed menu overlay and clip it
            "border-b border-line bg-ink-900"
          : scrolled
            ? "border-b border-line bg-ink-900/85 backdrop-blur-md"
            : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[88rem] items-center justify-between px-6 sm:px-10 md:h-[76px]">
        <Link href="/" aria-label="ConAI" className="relative z-10 shrink-0" onClick={close}>
          <Logo priority />
        </Link>

        {/* Desktop nav */}
        <nav aria-label={t("a11y.mainNav")} className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm text-fg-muted">
            {NAV.map((item) =>
              "children" in item ? (
                <li key={item.key} className="group relative">
                  <button
                    type="button"
                    className="flex items-center gap-1 py-2 transition-colors hover:text-fg"
                    aria-haspopup="true"
                  >
                    {t(`nav.${item.key}`)}
                    <ChevronDown
                      aria-hidden
                      strokeWidth={1.5}
                      className="size-3.5 transition-transform duration-200 group-hover:rotate-180"
                    />
                  </button>
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-48 rounded-2xl border border-line bg-ink-800/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-md">
                      {item.children.map((child) => (
                        <li key={child.key}>
                          <Link
                            href={child.href}
                            className="block rounded-lg px-4 py-2.5 transition-colors hover:bg-fg/5 hover:text-fg"
                          >
                            {t(`nav.${child.key}`)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="py-2 transition-colors hover:text-fg"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <LocaleSwitcher />
          <Button href="/book-audit" className="!px-5 !py-2.5 !text-sm" arrow={false}>
            {t("cta.audit")}
          </Button>
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? t("a11y.closeMenu") : t("a11y.openMenu")}
          className="relative z-10 -mr-2 p-2 md:hidden"
        >
          {open ? (
            <X strokeWidth={1.5} className="size-6" />
          ) : (
            <Menu strokeWidth={1.5} className="size-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 -z-10 flex flex-col bg-ink-950/[0.98] px-6 pb-10 pt-24 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label={t("a11y.mobileNav")} className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {MOBILE_NAV.map((item, i) => (
              <li
                key={item.key}
                style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
                className={`transition-all duration-500 ease-out ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Link
                  href={item.href}
                  onClick={close}
                  className="block py-3 font-display text-3xl font-semibold tracking-tight"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={`flex items-center justify-between gap-4 transition-all delay-300 duration-500 ${
            open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Button href="/book-audit" arrow={false}>
            {t("cta.audit")}
          </Button>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
