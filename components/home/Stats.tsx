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

function StatValue({ item }: { item: StatItem }) {
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

  const long = item.display.length > 7;
  return (
    <span
      ref={ref}
      className={`whitespace-nowrap font-mono font-medium tracking-tight ${
        long ? "text-3xl md:text-4xl" : "text-5xl md:text-[3.4rem]"
      }`}
    >
      {item.display}
    </span>
  );
}

export default function Stats() {
  const t = useTranslations("home.stats");
  const items = t.raw("items") as StatItem[];

  return (
    <div className="hairline-t hairline-b bg-ink-950">
      <Container>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal
              key={item.source + i}
              delay={i * 0.08}
              className={`flex flex-col gap-4 py-14 sm:px-8 lg:py-20 ${
                i > 0 ? "sm:border-l sm:border-line" : ""
              } ${i >= 2 ? "max-lg:border-t max-lg:border-line" : ""} ${i === 1 ? "max-sm:border-t max-sm:border-line" : ""}`}
            >
              <dt className="sr-only">{item.source}</dt>
              <dd className="flex flex-1 flex-col gap-4">
                <StatValue item={item} />
                <span className="text-sm leading-relaxed text-fg-muted">
                  {item.caption}
                </span>
                <span className="mt-auto font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
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
