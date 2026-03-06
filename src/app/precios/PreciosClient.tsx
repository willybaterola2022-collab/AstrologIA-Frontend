"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";

const PLANS = [
    {
        id: "libre", name: "Libre", icon: "🌙", price: 0, annualPrice: 0, period: "para siempre",
        color: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.1)",
        cta: "Empezar Gratis", ctaStyle: "outline",
        features: [
            "✓ Carta Natal — Big 3 (Sol, Luna, Ascendente)",
            "✓ 1 cálculo por día",
            "✓ Motor Swiss Ephemeris",
            "✗ Manual del Ser (8 dimensiones)",
            "✗ Análisis psicológico completo",
            "✗ Tránsitos personales",
        ],
    },
    {
        id: "esencial", name: "Esencial", icon: "✦", price: 19, annualPrice: 15, period: "/mes",
        badge: "Más popular",
        color: "rgba(124,58,237,0.12)", borderColor: "rgba(124,58,237,0.35)",
        cta: "7 días gratis →", ctaStyle: "gold",
        features: [
            "✓ Manual del Ser completo (8 dimensiones)",
            "✓ 12 planetas + análisis clínico",
            "✓ Quirón — Herida y Don",
            "✓ Nodo Norte — Misión evolutiva",
            "✓ Código Ancestral (Hellinger)",
            "✓ Sephirot Kabbalístico",
            "✓ Reloj de Tránsitos diario",
            "✓ Retorno de Saturno coach",
            "✓ Acceso ilimitado",
        ],
        stripe_price_id: "price_esencial_monthly",
    },
    {
        id: "maestro", name: "Maestro", icon: "🌟", price: 49, annualPrice: 39, period: "/mes",
        color: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.25)",
        cta: "Quiero el Mapa Completo", ctaStyle: "cosmic",
        features: [
            "✓ Todo lo del plan Esencial",
            "✓ Sinastría Profunda ilimitada",
            "✓ Detector de Patrones Tóxicos",
            "✓ Arquitectura de Riqueza completa",
            "✓ Planner de Lanzamientos (tránsitos)",
            "✓ Eclipses Personales 12 meses",
            "✓ Dream Life Manifestation Score",
            "✓ B2B — equipos hasta 5 personas",
            "✓ Soporte prioritario",
        ],
        stripe_price_id: "price_maestro_monthly",
    },
];

const FAQS_PRICING = [
    { q: "¿Puedo cancelar en cualquier momento?", a: "Sí. Sin permanencias, sin penalizaciones. Cancelas desde tu perfil en un clic y no se te cobra nada más." },
    { q: "¿Los 7 días gratis requieren tarjeta?", a: "Sí, para iniciar el período de prueba pedimos los datos de tarjeta — pero no se realiza ningún cobro hasta el día 8. Puedes cancelar en cualquier momento durante los 7 días." },
    { q: "¿Qué pasa con mis datos cuando cancelo?", a: "Tu carta natal y análisis se conservan 90 días después de la cancelación. Cumplimos con GDPR al 100%." },
    { q: "¿Ofrecéis factura para empresa?", a: "Sí. En el plan Maestro puedes descargar facturas con el nombre y CIF de tu empresa directamente desde el área de cliente." },
];

export default function PreciosClient() {
    const [annual, setAnnual] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleCheckout = async (plan: typeof PLANS[0]) => {
        if (plan.id === "libre") { window.location.href = "/carta-natal"; return; }
        setLoading(plan.id);
        // Stripe checkout via backend
        const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        try {
            const res = await fetch(`${API}/api/create-checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer demo" },
                body: JSON.stringify({ plan_id: plan.id, annual }),
            });
            if (!res.ok) throw new Error();
            const d = await res.json();
            window.location.href = d.checkout_url;
        } catch {
            // Fallback: redirect to coming soon
            alert("Checkout próximamente disponible. Por ahora empieza con la versión gratuita.");
        }
        setLoading(null);
    };

    return (
        <>
            <StarField />
            <Navbar />
            <main>
                {/* HERO */}
                <section style={{ padding: "9rem 1.5rem 4rem", textAlign: "center", background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 70%)" }}>
                    <div className="container-sm">
                        <span className="badge" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>✦ Planes</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem" }}>
                            Empieza <span className="text-gradient-gold">gratis</span>.<br />
                            Profundiza cuando quieras.
                        </h1>
                        <p style={{ color: "rgba(248,248,255,0.55)", fontSize: "1.05rem", maxWidth: 520, margin: "0 auto 2rem", lineHeight: 1.7 }}>
                            Sin tarjeta de crédito para el plan libre. 7 días sin cargo para los planes de pago.
                        </p>
                        {/* Annual toggle */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                            <span style={{ fontSize: "0.9rem", color: "rgba(248,248,255,0.5)" }}>Mensual</span>
                            <button onClick={() => setAnnual(a => !a)} style={{
                                width: 52, height: 28, borderRadius: 14, border: "none", cursor: "pointer",
                                background: annual ? "linear-gradient(135deg,#7C3AED,#5B21B6)" : "rgba(255,255,255,0.1)",
                                position: "relative", transition: "all 0.3s",
                            }}>
                                <span style={{ position: "absolute", top: 4, left: annual ? 26 : 4, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.3s" }} />
                            </button>
                            <span style={{ fontSize: "0.9rem", color: "rgba(248,248,255,0.5)" }}>
                                Anual <span style={{ color: "#10B981", fontWeight: 600, fontSize: "0.8rem" }}>AHORRA 20%</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* PLANS */}
                <section style={{ padding: "0 1.5rem 4rem" }}>
                    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                        <div className="pricing-grid">
                            {PLANS.map(plan => (
                                <div key={plan.id} style={{ borderRadius: "1.5rem", padding: "2rem", background: plan.color, border: `1px solid ${plan.borderColor}`, position: "relative" }}>
                                    {"badge" in plan && plan.badge && (
                                        <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)" }}>
                                            <span className="badge" style={{ background: "rgba(245,158,11,0.15)", borderColor: "rgba(245,158,11,0.3)", color: "#FCD34D", fontSize: "0.7rem" }}>
                                                ⭐ {plan.badge}
                                            </span>
                                        </div>
                                    )}
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                                        <span style={{ fontSize: "1.25rem" }}>{plan.icon}</span>
                                        <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 600, fontSize: "1rem", letterSpacing: "0.05em" }}>{plan.name}</span>
                                    </div>
                                    <div style={{ marginBottom: "1.5rem" }}>
                                        <span style={{ fontSize: "2.8rem", fontWeight: 900, fontFamily: "'Playfair Display',serif" }}>
                                            {plan.price === 0 ? "€0" : annual ? `€${plan.annualPrice}` : `€${plan.price}`}
                                        </span>
                                        <span style={{ color: "rgba(248,248,255,0.4)", fontSize: "0.85rem", marginLeft: "0.25rem" }}>{plan.period}</span>
                                        {annual && plan.price > 0 && (
                                            <div style={{ fontSize: "0.75rem", color: "#10B981", marginTop: "0.25rem" }}>
                                                Antes €{plan.price}/mes — ahorras €{(plan.price - plan.annualPrice) * 12}/año
                                            </div>
                                        )}
                                    </div>
                                    <ul style={{ listStyle: "none", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        {plan.features.map(f => (
                                            <li key={f} style={{ fontSize: "0.82rem", color: f.startsWith("✗") ? "rgba(248,248,255,0.25)" : "rgba(248,248,255,0.75)", display: "flex", gap: "0.4rem" }}>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={() => handleCheckout(plan)} disabled={loading === plan.id}
                                        className={plan.ctaStyle === "gold" ? "btn-gold" : plan.ctaStyle === "cosmic" ? "btn-cosmic" : "btn-outline"}
                                        style={{ width: "100%", justifyContent: "center" }}>
                                        {loading === plan.id ? "Preparando..." : plan.cta}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.75rem", color: "rgba(248,248,255,0.25)" }}>
                            Pago seguro vía Stripe · GDPR Compliant · Cancela en cualquier momento
                        </p>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* FAQ PRECIOS */}
                <section className="section-pad">
                    <div className="container-sm">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, textAlign: "center", marginBottom: "2rem" }}>
                            Preguntas sobre los planes
                        </h2>
                        <div className="glass-card" style={{ padding: "0.5rem 2rem" }}>
                            {FAQS_PRICING.map((faq, i) => (
                                <div key={i} className="faq-item">
                                    <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                        <span>{faq.q}</span>
                                        <span style={{ color: "#7C3AED", fontSize: "1.2rem", transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                                    </button>
                                    {openFaq === i && <div className="faq-answer">{faq.a}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* CTA FINAL */}
                <section className="section-pad" style={{ textAlign: "center" }}>
                    <div className="container-sm">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, marginBottom: "1rem" }}>
                            ¿Dudas? <span className="text-gradient-gold">Empieza gratis.</span>
                        </h2>
                        <p style={{ color: "rgba(248,248,255,0.45)", marginBottom: "2rem" }}>La Carta Natal básica es para siempre sin cargo. Actualizas cuando lo decidas.</p>
                        <a href="/carta-natal" className="btn-gold">✦ Empezar con la Carta Natal Gratis</a>
                    </div>
                </section>

                <footer style={{ padding: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.25)" }}>© 2026 AstrologIA · <a href="/" style={{ color: "#7C3AED", textDecoration: "none" }}>Inicio</a></p>
                </footer>
            </main>
        </>
    );
}
