import { setRequestLocale, getTranslations } from "next-intl/server";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Ladder from "@/components/home/Ladder";
import WhyConai from "@/components/home/WhyConai";
import ProjectsTeaser from "@/components/home/ProjectsTeaser";
import Process from "@/components/home/Process";
import FinalCta from "@/components/home/FinalCta";

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
