import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "link";
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
};

const base =
  "group inline-flex items-center justify-center gap-2 font-medium transition-colors duration-300";

const variants = {
  primary:
    "relative overflow-hidden rounded-full bg-linear-135 from-brand-500 to-brand-400 text-white " +
    "after:absolute after:inset-0 after:rounded-full after:bg-linear-135 after:from-brand-600 after:to-brand-500 " +
    "after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100",
  secondary:
    "rounded-full border border-line-strong text-fg hover:border-brand-400/60 hover:bg-white/5",
  link: "text-brand-400 hover:text-brand-300",
} as const;

const sizes = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
} as const;

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = true,
  className = "",
}: Props) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const cls = [
    base,
    variants[variant],
    variant === "link" ? "" : sizes[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && (
        <ArrowRight strokeWidth={1.5}
          aria-hidden
          className="relative z-10 size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={cls}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
