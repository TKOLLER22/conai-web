import type { ReactNode } from "react";

/** Pulsing status tag — used for "práve vyvíjame" / "coming soon" labels. */
export default function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-signal-300/90">
      <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-signal-300" />
      {children}
    </span>
  );
}
