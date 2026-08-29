import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Adds a top hairline separator. */
  rule?: boolean;
  container?: boolean;
};

export default function Section({
  children,
  id,
  className = "",
  rule = false,
  container = true,
}: Props) {
  return (
    <section
      id={id}
      className={`relative py-24 md:py-36 ${rule ? "hairline-t" : ""} ${className}`}
    >
      {container ? <Container>{children}</Container> : children}
    </section>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
