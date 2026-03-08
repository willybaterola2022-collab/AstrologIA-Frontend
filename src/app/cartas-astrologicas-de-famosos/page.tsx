import type { Metadata } from "next";
import FamososClient from "./FamososClient";

export const metadata: Metadata = {
    title: "Cartas Astrológicas de Famosos — Análisis Big Three de Celebrities",
    description: "Descubre el análisis astrológico profundo de Taylor Swift, Elon Musk, Messi, Beyoncé, Obama y más. Big Three completo: Sol, Luna y Ascendente de los más influyentes del mundo.",
    keywords: "carta natal taylor swift, carta natal elon musk, carta natal messi, carta natal beyonce, carta natal obama, astrología famosos, big three celebrities, signo lunar famosos",
    openGraph: {
        title: "El análisis astrológico de quienes mueven el mundo",
        description: "Detrás de cada figura global hay una arquitectura energética. Taylor Swift, Messi, Obama, Beyoncé — Big Three completo y análisis psicológico profundo.",
    },
};

export default function FamososPage() {
    return <FamososClient />;
}
