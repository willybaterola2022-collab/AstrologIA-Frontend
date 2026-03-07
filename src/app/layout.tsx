import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "AstrologIA — El Manual del Ser | Tu mapa psicológico-cósmico completo",
  description: "No es tu horóscopo. No es tu signo solar. Es el mapa completo de tu psicología, tus heridas, tu misión y el momento exacto en que debes actuar. Basado en Swiss Ephemeris + IA Clínica.",
  keywords: "carta natal, astrología, autoconocimiento, quirón, nodo norte, venus, marte, saturno, jung, kabbalah",
  openGraph: {
    title: "AstrologIA — El Manual del Ser",
    description: "El sistema de autoconocimiento más preciso del universo. 18 módulos. 8 dimensiones del alma.",
    type: "website",
  },
};

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600&family=Cinzel:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
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
                  send_page_view: true
                });
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
