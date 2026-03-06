import type { Metadata } from "next";
import ManualDelSerClient from "./ManualDelSerClient";

export const metadata: Metadata = {
    title: "Manual del Ser — Las 8 Dimensiones del Alma | AstrologIA",
    description: "Tu mapa psicológico-cósmico completo: quién eres, por qué sufres, para qué viniste, cómo te relacionas, cómo fluye tu dinero, cuándo actuar, tu código ancestral y tu frecuencia vibracional. Psicología junguiana + Kabbalah + Swiss Ephemeris.",
    keywords: "manual del ser, autoconocimiento profundo, astrología psicológica, carta natal completa, 8 dimensiones, quirón, nodo norte, kabbalah, hellinger",
    openGraph: {
        title: "Manual del Ser — Las 8 Dimensiones | AstrologIA",
        description: "El único mapa completo de tu ser. 8 dimensiones. Sin comparación en el mercado.",
        type: "website",
    },
};

export default function ManualDelSerPage() {
    return <ManualDelSerClient />;
}
