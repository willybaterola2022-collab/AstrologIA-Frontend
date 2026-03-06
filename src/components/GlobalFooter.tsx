"use client";
import Link from "next/link";
import { useState } from "react";

const COLS = [
    {
        title: "PRODUCTO", links: [
            { href: "/carta-natal", label: "Carta Natal" },
            { href: "/manual-del-ser", label: "Manual del Ser" },
            { href: "/sinastria", label: "Sinastría" },
            { href: "/quiron", label: "Quirón" },
            { href: "/retorno-saturno", label: "Retorno de Saturno" },
        ]
    },
    {
        title: "HERRAMIENTAS", links: [
            { href: "/#sonido", label: "🎵 Sintonía Planetaria" },
            { href: "/#sonido", label: "🌬️ Pacing Somático" },
            { href: "/precios", label: "💰 Wealth Timer™" },
            { href: "/nodo-norte", label: "⬆️ Nodo Norte" },
            { href: "/patrones", label: "💔 Patrones Relacionales" },
        ]
    },
    {
        title: "COMPAÑÍA", links: [
            { href: "/precios", label: "Planes y Precios" },
            { href: "/#faq", label: "Preguntas Frecuentes" },
            { href: "mailto:hola@astrologia.ai", label: "hola@astrologia.ai" },
            { href: "#", label: "Para Terapeutas" },
            { href: "#", label: "Prensa y Medios" },
        ]
    },
];

export default function GlobalFooter() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    return (
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(3,0,20,0.8)", backdropFilter: "blur(20px)", padding: "4rem 1.5rem 2rem" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                {/* Top grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>

                    {/* Brand column */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>✦</div>
                            <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 600, fontSize: "1.1rem", background: "linear-gradient(135deg,#A855F7,#F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AstrologIA</span>
                        </div>
                        <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.4)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 240 }}>
                            El primer sistema de autoconocimiento profundo basado en Swiss Ephemeris, Psicología Junguiana y Kabbalah.
                        </p>
                        {/* Newsletter */}
                        <div>
                            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", marginBottom: "0.6rem" }}>
                                Clima Cósmico Semanal Gratis
                            </p>
                            {subscribed ? (
                                <p style={{ fontSize: "0.8rem", color: "#34D399" }}>✓ ¡Suscrito! Nos veremos bajo las estrellas.</p>
                            ) : (
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <input
                                        type="email" placeholder="tu@email.com" value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        style={{
                                            flex: 1, padding: "0.55rem 0.75rem", borderRadius: "0.5rem",
                                            border: "1px solid rgba(124,58,237,0.3)", background: "rgba(255,255,255,0.04)",
                                            color: "#F8F8FF", fontSize: "0.78rem", outline: "none",
                                        }}
                                    />
                                    <button onClick={() => email && setSubscribed(true)} style={{
                                        padding: "0.55rem 1rem", borderRadius: "0.5rem", border: "none",
                                        background: "linear-gradient(135deg,#7C3AED,#5B21B6)", color: "white",
                                        fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                                    }}>→</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Link columns */}
                    {COLS.map(col => (
                        <div key={col.title}>
                            <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(248,248,255,0.25)", marginBottom: "1rem", fontWeight: 700 }}>
                                {col.title}
                            </p>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                                {col.links.map(link => (
                                    <li key={link.label}>
                                        <Link href={link.href} style={{
                                            fontSize: "0.82rem", color: "rgba(248,248,255,0.45)", textDecoration: "none",
                                            transition: "color 0.2s",
                                        }}
                                            onMouseOver={e => (e.currentTarget.style.color = "#A855F7")}
                                            onMouseOut={e => (e.currentTarget.style.color = "rgba(248,248,255,0.45)")}
                                        >{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Trust bar */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                        {["✦ Swiss Ephemeris", "✦ GDPR Compliant", "✦ Sin tarjeta requerida", "✦ Cancelación inmediata"].map(t => (
                            <span key={t} style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.2)" }}>{t}</span>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <Link href="#" style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.2)", textDecoration: "none" }}>Privacidad</Link>
                        <Link href="#" style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.2)", textDecoration: "none" }}>Términos</Link>
                        <span style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.15)" }}>© 2026 AstrologIA</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
