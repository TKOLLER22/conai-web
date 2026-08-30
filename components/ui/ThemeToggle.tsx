"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

// All toggle instances stay in sync by observing the html[data-theme]
// attribute (set by the boot script before hydration, and by toggles).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const t = useTranslations("common.a11y");
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("conai-theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? t("themeDark") : t("themeLight")}
      className="p-2 text-fg-muted transition-colors hover:text-fg"
    >
      {theme === "light" ? (
        <Moon strokeWidth={1.5} className="size-[18px]" />
      ) : (
        <Sun strokeWidth={1.5} className="size-[18px]" />
      )}
    </button>
  );
}
