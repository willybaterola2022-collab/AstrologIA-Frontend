import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
