import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";

export default function PageHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48">
      <div
        aria-hidden
        className="aura-brand absolute -top-[45vmin] right-[-20vmin] h-[90vmin] w-[90vmin] opacity-50"
      />
      <Container>
        <Reveal>
          <Kicker>{kicker}</Kicker>
          <h1 className="text-display mt-6 max-w-4xl text-4xl sm:text-5xl md:text-7xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-fg-muted md:text-xl">
              {intro}
            </p>
          )}
        </Reveal>
      </Container>
    </header>
  );
}
