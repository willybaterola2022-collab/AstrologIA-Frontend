import type { Metadata } from "next";
import AstroKidsClient from "./components/AstroKidsClient";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const metadata: Metadata = {
    title: "AstroKids — Astrología para Niños, Familias y Docentes",
    description: "Descubre el perfil astrológico de tu hijo o alumno. Carta natal infantil, guías de crianza consciente por signo, compatibilidad familiar y herramientas para docentes. Gratis.",
    keywords: [
        "astrología para niños", "carta natal niños", "signo zodiacal hijo",
        "crianza consciente astrología", "astrología infantil", "signo niño",
        "compatibilidad padres hijos astrología", "astrología docentes",
        "elemento niño aries tauro géminis", "astrología familia"
    ].join(", "),
    openGraph: {
        title: "¿Qué signo es tu hijo y cómo potenciarlo?",
        description: "Perfiles infantiles por signo, guías de crianza, compatibilidad familiar y herramientas para docentes y terapeutas. AstroKids — gratis.",
        type: "website",
    },
};

export default function AstroKidsPage() {
    return <AstroKidsClient />;
}
