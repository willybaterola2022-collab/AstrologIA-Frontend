import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // SEO URL upgrades — 301 permanent redirects
      // Old short URL → SEO longtail URL
      {
        source: "/nodo-norte",
        destination: "/mision-de-vida-nodo-norte",
        permanent: true,
      },
      {
        source: "/patrones",
        destination: "/por-que-repites-patrones-en-amor",
        permanent: true,
      },
      {
        source: "/retorno-saturno",
        destination: "/retorno-de-saturno-calculadora",
        permanent: true,
      },
      {
        source: "/sinastria",
        destination: "/compatibilidad-de-pareja-astrologica",
        permanent: true,
      },
      {
        source: "/quiron",
        destination: "/herida-del-alma-quiron-astral",
        permanent: true,
      },
      {
        source: "/manual-del-ser",
        destination: "/quien-soy-yo-segun-mi-carta-natal",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

