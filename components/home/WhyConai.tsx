import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

const ROW_LINKS = ["/services#local", "/advisor", null] as const;

type Row = { title: string; body: string; link?: string };

export default function WhyConai() {
  const t = useTranslations("home.why");
  const rows = t.raw("rows") as Row[];

  return (
    <Section rule>
      <Reveal>
        <Kicker>{t("kicker")}</Kicker>
        <h2 className="text-display mt-5 max-w-3xl text-4xl md:text-6xl">
          {t("title")}
        </h2>
      </Reveal>

      <div className="mt-8 md:mt-4">
        {rows.map((row, i) => (
          <Reveal key={row.title}>
            <div
              className={`grid items-center gap-8 py-14 md:py-20 lg:grid-cols-12 ${
                i > 0 ? "hairline-t" : ""
              }`}
            >
              <div
                aria-hidden
                className={`hidden select-none lg:block lg:col-span-5 ${
                  i % 2 ? "lg:order-2 text-right" : ""
                }`}
              >
                <span className="text-outline-brand font-display text-[10rem] font-bold leading-none xl:text-[12rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className={`lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`}>
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-display text-3xl md:text-4xl">
                    {row.title}
                  </h3>
                  {i > 0 && (
                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-signal-300/90">
                      <span className="size-1.5 animate-pulse rounded-full bg-signal-300" />
                      {t("badge")}
                    </span>
                  )}
                </div>
                <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-fg-muted">
                  {row.body}
                </p>
                {row.link && ROW_LINKS[i] && (
                  <div className="mt-6">
                    <Button href={ROW_LINKS[i]!} variant="link">
                      {row.link}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
