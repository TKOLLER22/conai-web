import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoAlternates } from "@/lib/seo";
import FinalCta from "@/components/home/FinalCta";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoAlternates(locale, "/work"),
  };
}

type Project = { title: string; desc?: string; tags: string[] };

// Wider slots for the projects that carry a description.
const WIDE = new Set([1, 2, 4, 8]);

export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const projects = t.raw("items") as Project[];

  return (
    <main>
      <PageHeader kicker={t("kicker")} title={t("title")} intro={t("intro")} />

      <Container className="pb-8">
        <div className="grid gap-5 md:grid-cols-6">
          {projects.map((project, i) => (
            <Reveal
              key={project.title}
              delay={(i % 3) * 0.05}
              className={WIDE.has(i) ? "md:col-span-4" : "md:col-span-2"}
            >
              <article className="flex h-full min-h-64 flex-col rounded-3xl border border-line bg-ink-850/80 p-8 transition-colors duration-300 hover:border-line-strong md:p-9">
                <h2 className="text-display max-w-[30ch] text-2xl md:text-3xl">
                  {project.title}
                </h2>
                {project.desc && (
                  <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-fg-muted md:text-lg">
                    {project.desc}
                  </p>
                )}
                <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] text-fg-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>

      <FinalCta title={t("ctaTitle")} subtitle={t("ctaDesc")} />
    </main>
  );
}
