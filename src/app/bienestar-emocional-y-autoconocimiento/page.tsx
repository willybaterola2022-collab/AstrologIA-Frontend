import type { Metadata } from "next";
import BienestarClient from "./BienestarClient";

export const metadata: Metadata = {
    title: "Entiende por qué sientes lo que sientes — Ansiedad, Soledad y Propósito | AstrologIA",
    description: "No toda ansiedad es igual. No toda soledad significa lo mismo. Descubre el patrón psicológico específico detrás de lo que sientes y cómo transformarlo desde tu estructura interior única.",
    keywords: "ansiedad, soledad, propósito de vida, autoconocimiento, psicología profunda, superar la ansiedad, sentido de vida, test de personalidad profundo",
    openGraph: {
        title: "Entiende por qué sientes lo que sientes",
        description: "Tu estructura psicológica única determina cómo vives cada emoción — y cómo la transformas.",
    },
};

export default function BienestarPage() {
    return <BienestarClient />;
}
