import type { Metadata } from "next";
import SinastriaClient from "./SinastriaClient";

export const metadata: Metadata = {
    title: "Sinastría — Compatibilidad Real con IA | AstrologIA",
    description: "No tu signo vs el suyo. Los 100 puntos de contacto entre dos cartas natales completas. Química real, conflictos inevitables, potencial de la unión. El análisis de compatibilidad más profundo del mercado.",
    keywords: "sinastría, compatibilidad astrológica, compatibilidad carta natal, compatibilidad pareja astrología, sinastría gratis",
    openGraph: {
        title: "Sinastría Profunda — AstrologIA",
        description: "La compatibilidad real — más allá de los signos solares. 100 puntos de análisis entre dos cartas.",
        type: "website",
    },
};

export default function SinastriaPage() {
    return <SinastriaClient />;
}
