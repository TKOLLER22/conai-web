import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section, { Container } from "@/components/ui/Section";

const SPANS = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4"];

type Featured = { tag: string; title: string };

export default function ProjectsTeaser() {
  const t = useTranslations("home.projects");
  const featured = t.raw("featured") as Featured[];
  const tags = t.raw("tags") as string[];

  return (
    <Section rule container={false} className="overflow-hidden">
      <Container>
        <Reveal>
          <Kicker>{t("kicker")}</Kicker>
          <h2 className="text-display mt-5 max-w-2xl text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </Reveal>
      </Container>

      {/* Tag marquee — full bleed */}
      <Reveal className="mt-12">
        <div className="marquee flex overflow-hidden" aria-hidden>
          {[0, 1].map((copy) => (
            <ul key={copy} className="marquee-track flex shrink-0 items-center gap-3 pr-3">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="whitespace-nowrap rounded-full border border-line px-4 py-1.5 font-mono text-xs text-fg-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Reveal>

      <Container>
        <div className="mt-12 grid gap-4 md:grid-cols-6">
          {featured.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.06} className={SPANS[i]}>
              <Link
                href="/work"
                className="group flex min-h-52 flex-col justify-between rounded-3xl border border-line bg-ink-850/80 p-7 transition-colors duration-300 hover:border-brand-400/50 md:min-h-60 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="kicker !text-fg-faint">{project.tag}</span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-5 shrink-0 text-fg-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-400"
                  />
                </div>
                <h3 className="mt-8 max-w-[24ch] font-display text-xl font-semibold leading-snug tracking-tight md:text-2xl">
                  {project.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Button href="/work" variant="link">
            {t("more")}
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
