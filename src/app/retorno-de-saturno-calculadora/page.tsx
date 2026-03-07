import type { Metadata } from "next";
import SaturnReturnClient from "./SaturnReturnClient";
export const metadata: Metadata = {
    title: "Retorno de Saturno — La Crisis de los 30 | AstrologIA",
    description: "¿Tienes entre 27 y 32 años y sientes que tu vida entera está siendo cuestionada? Es el Retorno de Saturno. Entiéndelo, transpórtalo y conviértelo en el trampolín de tu vida adulta.",
    keywords: "retorno saturno, saturno return, crisis años 30, saturno vuelve, saturno regresa, 28 años astrología",
};
export default function SaturnReturnPage() { return <SaturnReturnClient />; }
