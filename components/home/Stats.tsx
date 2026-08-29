"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { gsap, motionDisabled, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Container } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

type StatItem = {
  display: string;
  count?: { to: number; suffix?: string; prefix?: string };
  caption: string;
  source: string;
};

function StatValue({ item, className = "" }: { item: StatItem; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!item.count) return;
    const el = ref.current!;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      if (motionDisabled()) return;
      const state = { v: 0 };
      gsap.to(state, {
        v: item.count!.to,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = `${item.count!.prefix ?? ""}${Math.round(state.v)}${item.count!.suffix ?? ""}`;
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <span
      ref={ref}
      className={`text-display block whitespace-nowrap font-display font-bold ${className}`}
    >
      {item.display}
    </span>
  );
}

/**
 * Asymmetric editorial stat placement — no cards, no dividers.
 * The 11% vs 41% gap is the argument, so it gets the spotlight.
 */
const PLACEMENT = [
  { wrap: "lg:col-span-4 lg:col-start-1", num: "text-6xl md:text-7xl" },
  {
    wrap: "lg:col-span-7 lg:col-start-6 lg:-mt-10 lg:justify-self-end lg:text-right",
    num: "text-gradient-brand text-6xl md:text-[clamp(4rem,6.5vw,7rem)]",
  },
  { wrap: "lg:col-span-4 lg:col-start-2 lg:mt-4", num: "text-6xl md:text-7xl" },
  { wrap: "lg:col-span-5 lg:col-start-8 lg:-mt-6", num: "text-6xl md:text-7xl" },
];

export default function Stats() {
  const t = useTranslations("home.stats");
  const items = t.raw("items") as StatItem[];

  return (
    <div className="hairline-t relative overflow-hidden py-24 md:py-36">
      <Container>
        <dl className="grid grid-cols-1 gap-y-16 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-12 lg:gap-y-24">
          {items.map((item, i) => (
            <Reveal key={item.source + i} delay={i * 0.08} className={PLACEMENT[i].wrap}>
              <dt className="sr-only">{item.source}</dt>
              <dd className="flex max-w-md flex-col gap-4">
                <StatValue item={item} className={PLACEMENT[i].num} />
                <span className="text-base leading-relaxed text-fg-muted md:text-lg">
                  {item.caption}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
                  {item.source}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </div>
  );
}
