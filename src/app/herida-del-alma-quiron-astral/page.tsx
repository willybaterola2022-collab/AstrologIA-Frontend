import type { Metadata } from "next";
import QuironClient from "./QuironClient";
export const metadata: Metadata = {
    title: "Quirón — La Herida y el Don | AstrologIA",
    description: "Por qué sufres exactamente donde más vales. Quirón en los 12 signos: tu herida primaria, tu don oculto y el camino de sanación. El análisis de Quirón más profundo del mercado.",
    keywords: "quirón astrología, quirón carta natal, herida chirón, quirón signos, quirón ascendente",
};
export default function QuironPage() { return <QuironClient />; }
