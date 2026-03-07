import type { Metadata } from "next";
import WealthTimerClient from "./WealthTimerClient";

export const metadata: Metadata = {
    title: "Ventanas de Fortuna Astrológica — Wealth Timer™ | AstrologIA",
    description: "Descubre cuándo Júpiter y Venus favorecen tu prosperidad. El Wealth Timer™ calcula tu Índice de Fortuna planetaria y las ventanas de dinero de los próximos 90 días.",
    openGraph: {
        title: "Wealth Timer™ — Ventanas de Fortuna | AstrologIA",
        description: "¿Está el cielo alineado con tu dinero ahora mismo? Descúbrelo.",
    },
};

export default function VentanasFortunaPage() {
    return <WealthTimerClient />;
}
