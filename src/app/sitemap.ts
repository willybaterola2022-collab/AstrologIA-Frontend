import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://crystal-cosmos.vercel.app";
    const routes = [
        { url: base, changeFrequency: "weekly" as const, priority: 1 },
        { url: `${base}/carta-natal`, changeFrequency: "weekly" as const, priority: 0.9 },
        { url: `${base}/manual-del-ser`, changeFrequency: "weekly" as const, priority: 0.9 },
        { url: `${base}/sinastria`, changeFrequency: "weekly" as const, priority: 0.8 },
        { url: `${base}/quiron`, changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${base}/retorno-saturno`, changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${base}/precios`, changeFrequency: "monthly" as const, priority: 0.7 },
    ];
    return routes.map(r => ({ ...r, lastModified: new Date() }));
}
