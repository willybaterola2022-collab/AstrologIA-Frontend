import type { Metadata } from "next";
import ClimaCosmicoClient from "./ClimaCosmicoClient";

export const metadata: Metadata = {
    title: "El Clima Cósmico de Hoy — Horóscopo Diario Personalizado | AstrologIA",
    description: "Descubre la energía planetaria de hoy personalizada para tu signo. Fase lunar, planeta del día, lecturas de amor, dinero y cuerpo — renovadas cada día con la posición real de los planetas.",
    openGraph: {
        title: "El Clima Cósmico de Hoy | AstrologIA",
        description: "Cada día tiene una vibración planetaria distinta. Descubre la tuya.",
    },
};

export default function ClimaCosmicoPage() {
    return <ClimaCosmicoClient />;
}
