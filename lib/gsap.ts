import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, useGSAP);
}

/** Media conditions used across all animation code. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = `${MOTION_OK} and (pointer: fine) and (min-width: 768px)`;

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, useGSAP };
