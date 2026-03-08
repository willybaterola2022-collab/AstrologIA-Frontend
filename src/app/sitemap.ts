import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://crystal-cosmos.vercel.app";

    const routes: MetadataRoute.Sitemap = [
        // Core
        { url: base, changeFrequency: "daily", priority: 1.00 },
        { url: `${base}/carta-natal`, changeFrequency: "weekly", priority: 0.95 },
        { url: `${base}/precios`, changeFrequency: "monthly", priority: 0.85 },

        // Sprint A+B
        { url: `${base}/quien-soy-yo-segun-mi-carta-natal`, changeFrequency: "weekly", priority: 0.90 },
        { url: `${base}/compatibilidad-de-pareja-astrologica`, changeFrequency: "weekly", priority: 0.90 },
        { url: `${base}/mision-de-vida-nodo-norte`, changeFrequency: "monthly", priority: 0.85 },
        { url: `${base}/por-que-repites-patrones-en-amor`, changeFrequency: "monthly", priority: 0.85 },
        { url: `${base}/retorno-de-saturno-calculadora`, changeFrequency: "monthly", priority: 0.85 },
        { url: `${base}/herida-del-alma-quiron-astral`, changeFrequency: "monthly", priority: 0.80 },
        { url: `${base}/el-clima-cosmico-de-hoy`, changeFrequency: "daily", priority: 0.90 },
        { url: `${base}/ventanas-de-fortuna-astrologica`, changeFrequency: "weekly", priority: 0.82 },

        // Sprint C+D — new high-traffic modules
        { url: `${base}/bienestar-emocional-y-autoconocimiento`, changeFrequency: "weekly", priority: 0.92 },
        { url: `${base}/quien-eres-realmente`, changeFrequency: "monthly", priority: 0.88 },
        { url: `${base}/numerologia-y-tu-numero-de-vida`, changeFrequency: "monthly", priority: 0.88 },
        { url: `${base}/match-astral-por-carta-natal`, changeFrequency: "weekly", priority: 0.90 },
        { url: `${base}/malka`, changeFrequency: "weekly", priority: 0.85 },

        // SEO vertical hubs — Sprint E
        { url: `${base}/kabbalah-astrologica`, changeFrequency: "monthly", priority: 0.80 },
        { url: `${base}/arquetipos-personalidad`, changeFrequency: "monthly", priority: 0.80 },
        { url: `${base}/mejor-carrera-segun-tu-carta-natal`, changeFrequency: "monthly", priority: 0.78 },
        { url: `${base}/cartas-astrologicas-de-famosos`, changeFrequency: "weekly", priority: 0.82 },
    ];

    return routes.map(r => ({ ...r, lastModified: new Date() }));
}
