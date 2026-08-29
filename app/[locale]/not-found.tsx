import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="kicker">404</p>
      <h1 className="text-display text-4xl sm:text-5xl">{t("title")}</h1>
      <p className="max-w-md text-fg-muted">{t("description")}</p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 px-6 py-3 text-sm font-medium text-white"
      >
        {t("cta")}
      </Link>
    </main>
  );
}
