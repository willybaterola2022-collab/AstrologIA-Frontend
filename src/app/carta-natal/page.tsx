import type { Metadata } from "next";
import CartaNatalClient from "./CartaNatalClient";

export const metadata: Metadata = {
    title: "Carta Natal con IA | AstrologIA — Tu mapa astrológico completo",
    description: "Calcula tu carta natal con precisión astronómica real. No tu signo solar — tu psicología completa: Sol, Luna, Ascendente, Quirón, Nodo Norte y 12 planetas interpretados con IA clínica.",
    keywords: "carta natal, carta astral, carta natal gratis, calcular carta natal, carta natal español, swiss ephemeris, astrología",
    openGraph: {
        title: "Carta Natal con IA — AstrologIA",
        description: "Tu carta natal calculada con Swiss Ephemeris + interpretada con psicología junguiana. 18 módulos de análisis.",
        type: "website",
    },
};

export default function CartaNatalPage() {
    return <CartaNatalClient />;
}
