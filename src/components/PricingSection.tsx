"use client";
import { useState } from "react";

const PLANS = [
    {
        name: "Libre", price: "€0", period: "para siempre",
        cta: "Empezar Gratis", featured: false,
        features: ["Carta Natal — Big 3", "Score diario de energía", "1 consulta por día", "Sin tarjeta de crédito"],
        note: "",
    },
    {
        name: "Esencial", price: "€19", period: "/mes • 7 días gratis",
        cta: "Empezar 7 días gratis", featured: true,
        features: ["Manual del Ser completo (8 dimensiones)", "Reloj de Tránsitos personal", "Retorno de Saturno coach", "Código Ancestral (Hellinger)", "Sephirot Kabbalístico", "Mapa Vocacional", "Acceso ilimitado"],
        note: "Most popular",
    },
    {
        name: "Maestro", price: "€49", period: "/mes",
        cta: "Quiero el Mapa Completo", featured: false,
        features: ["Todo lo del plan Esencial", "Sinastría Profunda ilimitada", "Detector de Patrones Tóxicos", "Planner de Lanzamientos", "Eclipses Personales", "Soporte prioritario", "B2B — equipos hasta 5"],
        note: "",
    },
];

export default function PricingSection() {
    const [annual, setAnnual] = useState(false);

    return (
        <section id="precios" className="section-pad" style={{ background: "linear-gradient(180deg, transparent, rgba(124,58,237,0.04), transparent)" }}>
            <div className="container-max">
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span className="badge" style={{ marginBottom: "1rem" }}>✦ Planes</span>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700, marginBottom: "1rem" }}>
                        Empieza <span className="text-gradient-gold">gratis</span>. Profundiza cuando quieras.
                    </h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center", marginTop: "1rem" }}>
                        <span style={{ fontSize: "0.9rem", color: "rgba(248,248,255,0.5)" }}>Mensual</span>
                        <button onClick={() => setAnnual(a => !a)} style={{
                            width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
                            background: annual ? "linear-gradient(135deg,#7C3AED,#5B21B6)" : "rgba(255,255,255,0.1)",
                            position: "relative", transition: "all 0.3s",
                        }}>
                            <span style={{ position: "absolute", top: 3, left: annual ? 24 : 3, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.3s" }} />
                        </button>
                        <span style={{ fontSize: "0.9rem", color: "rgba(248,248,255,0.5)" }}>Anual <span style={{ color: "#10B981", fontWeight: 600 }}>−20%</span></span>
                    </div>
                </div>

                <div className="pricing-grid">
                    {PLANS.map(plan => (
                        <div key={plan.name} className={`pricing-card ${plan.featured ? "featured" : "glass-card"}`}
                            style={{ padding: "2rem" }}>
                            {plan.note && (
                                <div style={{ marginBottom: "1rem" }}>
                                    <span className="badge" style={{ background: "rgba(245,158,11,0.15)", borderColor: "rgba(245,158,11,0.3)", color: "#FCD34D", fontSize: "0.7rem" }}>
                                        ⭐ {plan.note}
                                    </span>
                                </div>
                            )}
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.25rem", fontFamily: "'Cinzel',serif", letterSpacing: "0.05em" }}>{plan.name}</h3>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <span style={{ fontSize: "2.5rem", fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>
                                    {annual && plan.price !== "€0"
                                        ? `€${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
                                        : plan.price}
                                </span>
                                <span style={{ color: "rgba(248,248,255,0.4)", fontSize: "0.85rem", marginLeft: "0.25rem" }}>{plan.period}</span>
                            </div>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.75rem" }}>
                                {plan.features.map(f => (
                                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.85rem", color: "rgba(248,248,255,0.7)" }}>
                                        <span style={{ color: "#10B981", marginTop: 2, flexShrink: 0 }}>✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <a href="#carta-natal" className={plan.featured ? "btn-gold" : "btn-outline"}
                                style={{ width: "100%", justifyContent: "center", textAlign: "center", display: "flex" }}>
                                {plan.cta} →
                            </a>
                        </div>
                    ))}
                </div>

                <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.8rem", color: "rgba(248,248,255,0.3)" }}>
                    Sin permanencias · Cancela cuando quieras · GDPR Compliant · Pago seguro vía Stripe
                </p>
            </div>
        </section>
    );
}
