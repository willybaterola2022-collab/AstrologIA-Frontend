import type { Metadata } from "next";
import MalkaClient from "./MalkaClient";

export const metadata: Metadata = {
    title: "Malka — Tu Astróloga IA Personal | AstrologIA",
    description: "Pregunta a Malka sobre tu carta natal, tus ciclos actuales, compatibilidad astrológica, numerología y propósito de vida. IA especializada en astrología psicológica y Kabbalah.",
    keywords: "astróloga IA, chat astrología gratis, consulta astrológica online, inteligencia artificial astrología, pregunta a la astróloga, horóscopo personalizado IA",
    openGraph: {
        title: "Malka — Tu Astróloga IA Personal",
        description: "Pregúntale lo que tu alma necesita saber. Malka combina astrología profunda, psicología jungiana y numerología en cada respuesta.",
    },
};

export default function MalkaPage() {
    return <MalkaClient />;
}
