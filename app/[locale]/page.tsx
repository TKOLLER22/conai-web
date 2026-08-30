import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { seoAlternates } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Ladder from "@/components/home/Ladder";
import WhyConai from "@/components/home/WhyConai";
import ProjectsTeaser from "@/components/home/ProjectsTeaser";
import Process from "@/components/home/Process";
import FinalCta from "@/components/ui/FinalCta";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoAlternates(locale, "/"),
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <main>
      <Hero />
      <Stats />
      <Ladder />
      <WhyConai />
      <ProjectsTeaser />
      <Process />
      <FinalCta title={t("cta.title")} />
    </main>
  );
}
