"use client";

import Cal from "@calcom/embed-react";

export default function CalEmbed() {
  return (
    <div className="min-h-[640px] overflow-hidden rounded-3xl border border-line bg-ink-850/60">
      <Cal
        calLink="conai/audit"
        calOrigin="https://cal.eu"
        embedJsUrl="https://cal.eu/embed/embed.js"
        config={{ theme: "dark" }}
        style={{ width: "100%", height: "100%", minHeight: "640px" }}
      />
    </div>
  );
}
