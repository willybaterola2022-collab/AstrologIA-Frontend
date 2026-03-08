import type { Metadata } from "next";
import KabbalahClient from "./KabbalahClient";

export const metadata: Metadata = {
    title: "Kabbalah y tu Árbol de la Vida — Sefirot, Astros y Sendero del Alma",
    description: "Descubre tu Sefirah rectora según tu signo solar, tu sendero kármico en el Árbol de la Vida, las 10 Sefirot y tu meditación personalizada. Kabbalah astrológica profunda. Gratis.",
    keywords: "kabbalah astrología, árbol de la vida kabbalah, sefirot signos zodiacales, kabbalah mística, sendero del alma, tikún kármico, zohar astrología",
    openGraph: {
        title: "¿Cuál es tu Sefirah en el Árbol de la Vida?",
        description: "La Kabbalah astrológica conecta las 10 Sefirot con los signos zodiacales. Descubre tu sendero del alma, tu Tikún y tu meditación personalizada.",
    },
};

export default function KabbalahPage() {
    return <KabbalahClient />;
}
