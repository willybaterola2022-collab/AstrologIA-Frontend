import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── i18n — Multilingual architecture (Sprint F) ──────────────────────
  // Subdirectory strategy (/es/, /en/, /de/) — NOT subdomains
  // Subdirs consolidate domain authority vs. splitting it across subdomains
  // Activate when Twin.so content is ready per language
  // i18n: {
  //   locales: ["es", "en", "de", "it", "hi", "zh", "ar"],
  //   defaultLocale: "es",
  //   localeDetection: true,
  // },

  async redirects() {
    return [
      // ── Sprint A+B module URL upgrades (301 permanent) ───────────────
      { source: "/nodo-norte", destination: "/mision-de-vida-nodo-norte", permanent: true },
      { source: "/patrones", destination: "/por-que-repites-patrones-en-amor", permanent: true },
      { source: "/retorno-saturno", destination: "/retorno-de-saturno-calculadora", permanent: true },
      { source: "/sinastria", destination: "/compatibilidad-de-pareja-astrologica", permanent: true },
      { source: "/quiron", destination: "/herida-del-alma-quiron-astral", permanent: true },
      { source: "/manual-del-ser", destination: "/quien-soy-yo-segun-mi-carta-natal", permanent: true },

      // ── SEO Vertical Hubs — 10 Autoridad Temática ────────────────────
      // VERTICAL 1: Carta Natal (hub → subpáginas by planet+sign combo)
      { source: "/carta-natal-gratis", destination: "/carta-natal", permanent: true },
      { source: "/horoscopo-natal", destination: "/carta-natal", permanent: true },

      // VERTICAL 2: Compatibilidad
      { source: "/compatibilidad", destination: "/compatibilidad-de-pareja-astrologica", permanent: true },
      { source: "/sinastria-parejas", destination: "/compatibilidad-de-pareja-astrologica", permanent: true },

      // VERTICAL 3: Bienestar emocional (high conversion — ansiedad, soledad, depresión)
      { source: "/bienestar", destination: "/bienestar-astrologico", permanent: false }, // future page
      { source: "/ansiedad-astrologia", destination: "/bienestar-astrologico", permanent: false },

      // VERTICAL 4: Astrología Financiera
      { source: "/dinero-astrologia", destination: "/ventanas-de-fortuna-astrologica", permanent: true },
      { source: "/wealth-timer", destination: "/ventanas-de-fortuna-astrologica", permanent: true },

      // VERTICAL 5: Clima cósmico / tránsitos
      { source: "/clima-hoy", destination: "/el-clima-cosmico-de-hoy", permanent: true },
      { source: "/transitos", destination: "/el-clima-cosmico-de-hoy", permanent: true },
      { source: "/horoscopo-hoy", destination: "/el-clima-cosmico-de-hoy", permanent: true },

      // VERTICAL 6: Kabbalah
      { source: "/kabbalah", destination: "/kabbalah-astrologica", permanent: false }, // future
      { source: "/arbol-vida", destination: "/kabbalah-astrologica", permanent: false },

      // VERTICAL 7: Arquetipos Jung
      { source: "/arquetipos", destination: "/arquetipos-personalidad", permanent: false }, // future
      { source: "/sombra-jung", destination: "/arquetipos-personalidad", permanent: false },

      // VERTICAL 8: Vocación
      { source: "/vocacion", destination: "/mejor-carrera-segun-tu-carta-natal", permanent: false },
      { source: "/carrera-astrologia", destination: "/mejor-carrera-segun-tu-carta-natal", permanent: false },

      // VERTICAL 9: Celebridades
      { source: "/famosos", destination: "/cartas-astrologicas-de-famosos", permanent: false },
      { source: "/celebrities", destination: "/cartas-astrologicas-de-famosos", permanent: false },

      // VERTICAL 10: Match Astral
      { source: "/match", destination: "/match-astral-por-carta-natal", permanent: false },
      { source: "/alma-gemela", destination: "/match-astral-por-carta-natal", permanent: false },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security headers
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Cache static assets aggressively
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // HTML pages — revalidate faster
        source: "/",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
