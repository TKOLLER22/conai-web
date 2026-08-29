import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { use } from "react";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("home.hero");

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-display text-5xl">{t("title")}</h1>
    </main>
  );
}
