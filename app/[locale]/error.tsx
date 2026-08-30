"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="kicker">500</p>
      <h1 className="text-display text-4xl sm:text-5xl">{t("title")}</h1>
      <p className="max-w-md text-fg-muted">{t("description")}</p>
      <button
        type="button"
        onClick={reset}
        className="group mt-2 inline-flex items-center justify-center rounded-full bg-linear-135 from-brand-500 to-brand-400 px-6 py-3 text-sm font-medium text-white"
      >
        {t("retry")}
      </button>
    </main>
  );
}
