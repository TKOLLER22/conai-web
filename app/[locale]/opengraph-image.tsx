import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ConAI";

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "home.meta" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0e0e15",
          backgroundImage:
            "radial-gradient(ellipse 60% 55% at 85% 20%, rgba(109,40,217,0.45), transparent 70%), radial-gradient(ellipse 50% 45% at 10% 100%, rgba(152,67,198,0.3), transparent 70%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ fontSize: 140, fontWeight: 700, color: "#f4f4f6", letterSpacing: "-0.03em" }}>
            Con
          </span>
          <span style={{ fontSize: 140, fontWeight: 700, color: "#a78bfa", letterSpacing: "-0.03em" }}>
            AI
          </span>
        </div>
        <div style={{ marginTop: 28, fontSize: 44, color: "#a3a3b2", maxWidth: 900 }}>
          {t("ogTagline")}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            fontSize: 26,
            color: "#71717f",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          conai.sk
        </div>
      </div>
    ),
    size,
  );
}
