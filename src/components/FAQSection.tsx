"use client";
import { useState } from "react";

const FAQS = [
    { q: "¿Necesito saber de astrología para usar AstrologIA?", a: "No. Hablamos en lenguaje humano, no astrológico. Jamás verás una frase genérica sobre 'tu signo solar'. Verás tu psicología, tus patrones, tu misión — explicados de forma que tiene sentido para ti ahora mismo." },
    { q: "¿Es realmente diferente al horóscopo del periódico?", a: "Radicalmente. No usamos tu signo solar. Usamos tu carta natal completa — calculada astronómicamente para el momento exacto de tu nacimiento con el motor Swiss Ephemeris, el mismo que usan los observatorios." },
    { q: "¿Qué información necesito?", a: "Fecha, hora y lugar exactos de nacimiento. La hora es crítica para el Ascendente — si no la tienes, ponte en contacto con el registro civil de tu ciudad." },
    { q: "¿Los análisis son genéricos o personalizados?", a: "100% personalizados. Cada resultado se calcula en tiempo real para tu fecha y hora exactas. No hay dos cartas natales iguales en el universo." },
    { q: "¿Puedo cancelar en cualquier momento?", a: "Sí. Sin permanencias, sin penalizaciones, sin llamadas de retención. Cancelas desde tu perfil en un clic." },
    { q: "¿Puedo usar AstrologIA para mi equipo o empresa?", a: "Sí. El plan Maestro incluye B2B de hasta 5 personas. Para equipos mayores, escríbenos — tenemos un plan corporativo personalizado." },
];

export default function FAQSection() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section id="faq" className="section-pad">
            <div className="container-sm">
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span className="badge" style={{ marginBottom: "1rem" }}>✦ Preguntas Frecuentes</span>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 700 }}>
                        Lo que normalmente preguntan
                    </h2>
                </div>
                <div className="glass-card" style={{ padding: "0.5rem 2rem" }}>
                    {FAQS.map((faq, i) => (
                        <div key={i} className="faq-item">
                            <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                                <span>{faq.q}</span>
                                <span style={{ color: "#7C3AED", fontSize: "1.2rem", flexShrink: 0, transition: "transform 0.3s", transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                            </button>
                            {open === i && (
                                <div className="faq-answer">{faq.a}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
