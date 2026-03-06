import type { Metadata } from "next";
import PatronesToxicosClient from "./PatronesToxicosClient";

export const metadata: Metadata = {
    title: "Patrones Relacionales — ¿Por qué atraes siempre lo mismo? | AstrologIA",
    description: "Tu Venus, Marte y Casa 7 guardan el patrón que repites en cada relación. Descubre tu arquetipo relacional con precisión astronómica — y cómo trascenderlo.",
    openGraph: {
        title: "Detector de Patrones Relacionales | AstrologIA",
        description: "Descubre por qué siempre atraes al mismo tipo de persona. 8 arquetipos basados en tu carta natal.",
    },
};

export default function PatronesPage() {
    return <PatronesToxicosClient />;
}
