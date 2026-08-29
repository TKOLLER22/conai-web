import type { ReactNode } from "react";

/** Mono uppercase section label with a hairline tail. */
export default function Kicker({
  children,
  index,
  className = "",
}: {
  children: ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <p className={`kicker flex items-center gap-3 ${className}`}>
      {index && <span className="text-fg-faint">{index}</span>}
      <span>{children}</span>
      <span aria-hidden className="h-px w-10 bg-brand-400/40" />
    </p>
  );
}
