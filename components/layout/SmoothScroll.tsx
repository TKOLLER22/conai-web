"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionDisabled, ScrollSmoother, useGSAP, DESKTOP } from "@/lib/gsap";

/**
 * GSAP ScrollSmoother, desktop pointer devices only. Touch devices and
 * reduced-motion users keep native scrolling. The fixed header lives
 * outside this wrapper (position: fixed breaks inside the transform).
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(DESKTOP, () => {
      if (motionDisabled()) return;
      const smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current!,
        content: contentRef.current!,
        smooth: 1,
        effects: true,
        smoothTouch: false,
      });

      // Native CSS smooth-behavior would double-smooth anchor jumps.
      document.documentElement.style.scrollBehavior = "auto";

      const onAnchorClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
          'a[href*="#"]',
        );
        if (!anchor) return;
        const url = new URL(anchor.href, location.href);
        if (url.pathname !== location.pathname || !url.hash) return;
        const target = document.querySelector(url.hash);
        if (!target) return;
        e.preventDefault();
        history.pushState(null, "", url.hash);
        smoother.scrollTo(target, true, "top 96px");
      };
      document.addEventListener("click", onAnchorClick);

      return () => {
        document.removeEventListener("click", onAnchorClick);
        document.documentElement.style.scrollBehavior = "";
        smoother.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={wrapperRef}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
