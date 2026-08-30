import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

export default function FinalCta({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const t = useTranslations("common.cta");

  return (
    <Section rule className="overflow-hidden">
      <div
        aria-hidden
        className="aura-brand absolute left-1/2 top-full h-[90vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/3"
      />
      <Reveal className="relative flex flex-col items-center gap-10 py-10 text-center md:py-16">
        <h2 className="text-display max-w-4xl text-4xl md:text-7xl">{title}</h2>
        {subtitle && (
          <p className="-mt-3 max-w-xl text-lg text-fg-muted md:text-xl">{subtitle}</p>
        )}
        <Button href="/book-audit" size="lg">
          {t("bookAudit")}
        </Button>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-fg-faint">
          {t("auditMeta")}
        </p>
      </Reveal>
    </Section>
  );
}
