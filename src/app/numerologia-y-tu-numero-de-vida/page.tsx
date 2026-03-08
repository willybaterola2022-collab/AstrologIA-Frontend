import type { Metadata } from "next";
import NumerologiaClient from "./NumerologiaClient";

export const metadata: Metadata = {
    title: "Numerología: Calcula tu Número de Vida — Misión y Ciclos Personales",
    description: "Introduce tu fecha de nacimiento y descubre tu número de vida pitagórico, tu año personal 2026, y tu número de expresión. 12 arquetipos numerológicos. Gratis.",
    keywords: "numerología, número de vida, numerología pitagórica, calcular número de vida, número de la suerte, año personal numerología, números maestros",
    openGraph: {
        title: "¿Cuál es tu número de vida?",
        description: "La numerología pitagórica convierte tu fecha de nacimiento en un código de frecuencia único. Descúbrelo gratis.",
    },
};

export default function NumerologiaPage() {
    return <NumerologiaClient />;
}
