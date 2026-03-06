import type { Metadata } from "next";
import PreciosClient from "./PreciosClient";
export const metadata: Metadata = {
    title: "Planes y Precios — AstrologIA | Empieza Gratis",
    description: "Empieza gratis con tu Carta Natal. Desbloquea el Manual del Ser completo (€19/mes) o el plan Maestro con Sinastría ilimitada (€49/mes). Sin permanencias.",
    keywords: "astrología precios, carta natal gratis, plan esencial astrología, manual del ser precio",
};
export default function PreciosPage() { return <PreciosClient />; }
