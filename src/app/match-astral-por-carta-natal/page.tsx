import type { Metadata } from "next";
import MatchAstralClient from "./MatchAstralClient";

export const metadata: Metadata = {
    title: "Match Astral — Compatibilidad de Pareja por Carta Natal",
    description: "Calcula la compatibilidad real de pareja con tu Big Three completo: Sol, Luna y Ascendente. Análisis de 5 dimensiones, arquetipos de pareja y perspectiva a largo plazo. Gratis.",
    keywords: "compatibilidad astrológica, match astral, compatibilidad de pareja, signos compatibles, sinastría, compatibilidad signos zodiacales pareja, astrología pareja",
    openGraph: {
        title: "¿Qué dice el universo de vuestra pareja?",
        description: "Más allá del signo solar: análisis de compatibilidad real con Big Three completo. Score, arquetipos y perspectiva a largo plazo.",
    },
};

export default function MatchAstralPage() {
    return <MatchAstralClient />;
}
