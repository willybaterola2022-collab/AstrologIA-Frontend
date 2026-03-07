import type { Metadata } from "next";
import NodoNorteClient from "./NodoNorteClient";

export const metadata: Metadata = {
    title: "Nodo Norte — Tu Misión de Vida | AstrologIA",
    description: "Descubre para qué viniste a este mundo. El Nodo Norte es el vector evolutivo de tu alma — calculado con Swiss Ephemeris para las 144 combinaciones de signo y casa.",
    openGraph: {
        title: "Nodo Norte — Tu Misión de Vida | AstrologIA",
        description: "El punto de tu carta natal que sabe exactamente cuál es tu propósito en esta vida.",
    },
};

export default function NodoNortePage() {
    return <NodoNorteClient />;
}
