import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { IS_PRODUCTION_DOMAIN, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import "../globals.css";

// Variable fonts measure better than pinned static weights here: one file
// per subset beats 2× static instances (verified via Lighthouse, 2026-08-30).
const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  weight: ["400"],
  display: "swap",
  preload: false,
});

export async function generateMetadata({
  params,
}: Omit<LayoutProps<"/[locale]">, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    openGraph: {
      siteName: "ConAI",
      type: "website",
      locale: locale === "sk" ? "sk_SK" : "en_US",
    },
    twitter: { card: "summary_large_image" },
    ...(IS_PRODUCTION_DOMAIN ? {} : { robots: { index: false, follow: false } }),
  };
}

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ConAI",
  legalName: "ELYSIA, s. r. o.",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo-232.png`,
  email: "info@conai.sk",
  sameAs: ["https://www.linkedin.com/company/conai-ai-solutions-for-smes"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tranovského 36",
    postalCode: "841 02",
    addressLocality: "Bratislava",
    addressCountry: "SK",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${bricolage.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        {/* Theme boot: runs before paint of the content below — no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("conai-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        <JsonLd data={ORGANIZATION_JSONLD} />
        <noscript>
          <style>{`[data-reveal],[data-hero-fade]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <NextIntlClientProvider>
          <Header />
          <SmoothScroll>
            {children}
            <Footer />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
