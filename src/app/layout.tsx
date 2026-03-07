import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";


export const metadata: Metadata = {
  title: "AstrologIA — El Manual del Ser | Tu mapa psicológico-cósmico completo",
  description: "No es tu horóscopo. No es tu signo solar. Es el mapa completo de tu psicología, tus heridas, tu misión y el momento exacto en que debes actuar. Basado en Swiss Ephemeris + IA Clínica.",
  keywords: "carta natal, astrología, autoconocimiento, quirón, nodo norte, venus, marte, saturno, jung, kabbalah",
  // Google Search Console verification — add NEXT_PUBLIC_GSC_VERIFICATION to Vercel
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
  openGraph: {
    title: "AstrologIA — El Manual del Ser",
    description: "El sistema de autoconocimiento más preciso del universo. 18 módulos. 8 dimensiones del alma.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://crystal-cosmos.vercel.app",
    siteName: "AstrologIA",
  },
  twitter: {
    card: "summary_large_image",
    title: "AstrologIA — El Manual del Ser",
    description: "Swiss Ephemeris + Kabbalah + Jung + IA de voz. El sistema de autoconocimiento más preciso del mundo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://crystal-cosmos.vercel.app",
  },
};

// ── Google Tool IDs (configure en Vercel → Environment Variables) ──
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;   // GA4:  G-XXXXXXXXXX
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;   // GTM:  GTM-XXXXXXX
// GSC verification is handled via metadata.verification.google above

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600&family=Cinzel:wght@400;600&display=swap"
          rel="stylesheet"
        />

        {/* Canonical & domain */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || "https://crystal-cosmos.vercel.app"} />

        {/* GTM — Google Tag Manager (noscript goes in body) */}
        {GTM_ID && (
          <Script id="gtm-head" strategy="beforeInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}

        {/* GA4 — Google Analytics 4 (direct, no GTM needed) */}
        {GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: true,
                  allow_enhanced_conversions: true
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        {/* GTM noscript fallback */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
        {/* Vercel Analytics — activado desde Vercel Dashboard sin Google */}
        <Analytics />
        {/* Core Web Vitals — LCP, CLS, FID en tiempo real */}
        <SpeedInsights />
      </body>
    </html>
  );
}
