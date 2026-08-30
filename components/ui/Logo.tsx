import Image from "next/image";

/** Wordmark with white lettering (dark theme) or ink lettering (light theme). */
export default function Logo({ priority = false }: { priority?: boolean }) {
  return (
    <>
      <Image
        src="/brand/logo-232.png"
        alt="ConAI"
        width={101}
        height={31}
        priority={priority}
        className="theme-dark-only"
      />
      <Image
        src="/brand/logo-232-light.png"
        alt="ConAI"
        width={101}
        height={31}
        loading="lazy"
        fetchPriority="low"
        className="theme-light-only"
      />
    </>
  );
}
