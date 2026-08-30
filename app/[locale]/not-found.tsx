import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="kicker">404</p>
      <h1 className="text-display text-4xl sm:text-5xl">{t("title")}</h1>
      <p className="max-w-md text-fg-muted">{t("description")}</p>
      <div className="mt-2">
        <Button href="/">{t("cta")}</Button>
      </div>
    </main>
  );
}
