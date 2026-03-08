import type { Metadata } from "next";
import OraculoClient from "./OraculoClient";

export const metadata: Metadata = {
    title: "¿Quién eres realmente? — Descubre tu arquetipo psicológico profundo",
    description: "15 preguntas. Ninguna trampa. Al terminar, El Oráculo revela el patrón psicológico que define cómo piensas, lideras, amas y enfrentas la vida. Completamente gratis.",
    keywords: "test de personalidad profundo, quién soy yo, arquetipo psicológico, test psicológico, autoconocimiento, test de carácter, personalidad jungiana",
    openGraph: {
        title: "¿Quién eres realmente? El Oráculo lo sabe.",
        description: "15 preguntas sin trampa. Al final: tu arquetipo psicológico, tu don, tu sombra, y el mapa de tu vida.",
        type: "website",
    },
};

export default function OraculoPage() {
    return <OraculoClient />;
}
