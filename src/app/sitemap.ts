import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    // Update this URL when you get the custom domain
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://crystal-cosmos.vercel.app";

    const routes: MetadataRoute.Sitemap = [
        // Core pages — highest priority, weekly refresh
        { url: base, changeFrequency: "daily", priority: 1.0 },
        { url: `${base}/carta-natal`, changeFrequency: "weekly", priority: 0.95 },
        { url: `${base}/precios`, changeFrequency: "monthly", priority: 0.85 },

        // Module pages — SEO longtail URLs (all Sprint A+B+C)
        { url: `${base}/quien-soy-yo-segun-mi-carta-natal`, changeFrequency: "weekly", priority: 0.90 },
        { url: `${base}/compatibilidad-de-pareja-astrologica`, changeFrequency: "weekly", priority: 0.90 },
        { url: `${base}/mision-de-vida-nodo-norte`, changeFrequency: "monthly", priority: 0.85 },
        { url: `${base}/por-que-repites-patrones-en-amor`, changeFrequency: "monthly", priority: 0.85 },
        { url: `${base}/retorno-de-saturno-calculadora`, changeFrequency: "monthly", priority: 0.85 },
        { url: `${base}/herida-del-alma-quiron-astral`, changeFrequency: "monthly", priority: 0.80 },
        { url: `${base}/el-clima-cosmico-de-hoy`, changeFrequency: "daily", priority: 0.90 }, // daily = retención
        { url: `${base}/ventanas-de-fortuna-astrologica`, changeFrequency: "weekly", priority: 0.82 },
    ];

    return routes.map(r => ({ ...r, lastModified: new Date() }));
}
