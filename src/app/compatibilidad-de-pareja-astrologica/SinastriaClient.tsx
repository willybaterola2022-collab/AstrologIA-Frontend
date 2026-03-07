"use client";
import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const SIGNS = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];

const COMPAT_AREAS = [
    { icon: "💕", area: "Amor y Atracción", desc: "La química magnética entre Venus y Marte de ambas cartas" },
    { icon: "🗣️", area: "Comunicación", desc: "Cómo procesan el mundo y si sus Mercurios se entienden" },
    { icon: "🔥", area: "Tensión y Crecimiento", desc: "Los aspectos de fricción que generan evolución mutua" },
    { icon: "🌀", area: "Heridas y Sanación", desc: "Cómo los Quirón de cada uno activan o sana al otro" },
    { icon: "🏠", area: "Proyecto de Vida", desc: "Si sus Nodos del Norte apuntan en la misma dirección" },
    { icon: "⚡", area: "Karma y Deuda", desc: "Los aspectos dracónicos — conexión de vidas anteriores" },
];

interface PersonForm {
    year: string; month: string; day: string; hour: string; lat: string; lon: string;
}

export default function SinastriaClient() {
    const [person1, setPerson1] = useState<PersonForm>({ year: "1990", month: "6", day: "15", hour: "12", lat: "40.4168", lon: "-3.7038" });
    const [person2, setPerson2] = useState<PersonForm>({ year: "1992", month: "3", day: "22", hour: "8", lat: "40.4168", lon: "-3.7038" });
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/synastry`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer demo" },
                body: JSON.stringify({
                    person1: { year: +person1.year, month: +person1.month, day: +person1.day, hour: +person1.hour, lat: +person1.lat, lon: +person1.lon },
                    person2: { year: +person2.year, month: +person2.month, day: +person2.day, hour: +person2.hour, lat: +person2.lat, lon: +person2.lon },
                }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setResult(data.data || data);
        } catch {
            const jd1 = (+person1.year - 2000) * 365.25 + +person1.month * 30.44 + +person1.day;
            const jd2 = (+person2.year - 2000) * 365.25 + +person2.month * 30.44 + +person2.day;
            const score = Math.floor(55 + Math.abs(Math.sin((jd1 - jd2) / 100)) * 40);
            setResult({ compatibility_score: score, demo: true });
        }
        setLoading(false);
    };

    const PersonForm = ({ label, form, onChange }: { label: string; form: PersonForm; onChange: (f: PersonForm) => void }) => (
        <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h4 style={{ fontSize: "0.85rem", color: "#A855F7", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", marginBottom: "1rem" }}>{label}</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {([["Año", "year"], ["Mes", "month"], ["Día", "day"]] as const).map(([l, k]) => (
                    <div key={k}>
                        <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(248,248,255,0.35)", marginBottom: "0.25rem", textTransform: "uppercase" }}>{l}</label>
                        <input className="cosmic-input" style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }} value={form[k]} onChange={e => onChange({ ...form, [k]: e.target.value })} />
                    </div>
                ))}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
                <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(248,248,255,0.35)", marginBottom: "0.25rem", textTransform: "uppercase" }}>Hora</label>
                <input className="cosmic-input" style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }} type="number" min="0" max="23.9" step="0.5" value={form.hour} onChange={e => onChange({ ...form, hour: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {([["Lat", "lat"], ["Lon", "lon"]] as const).map(([l, k]) => (
                    <div key={k}>
                        <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(248,248,255,0.35)", marginBottom: "0.25rem", textTransform: "uppercase" }}>{l}</label>
                        <input className="cosmic-input" style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }} value={form[k]} onChange={e => onChange({ ...form, [k]: e.target.value })} />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <StarField />
            <Navbar />
            <main>
                {/* HERO */}
                <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "9rem 1.5rem 4rem", background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236,72,153,0.15) 0%, rgba(124,58,237,0.1) 50%, transparent 70%)" }}>
                    <div className="container-sm">
                        <span className="badge" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>💫 Compatibilidad Real</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(2rem,5vw,4.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem" }}>
                            ¿Sois <span className="text-gradient-cosmic">compatibles</span> de verdad?
                        </h1>
                        <p style={{ fontSize: "clamp(1rem,1.8vw,1.2rem)", color: "rgba(248,248,255,0.65)", maxWidth: 560, margin: "0 auto 2rem", lineHeight: 1.75 }}>
                            No tu signo vs el suyo. Los 100 puntos de contacto entre dos cartas natales completas — la química real, los conflictos inevitables, lo que pueden construir juntos.
                        </p>
                        <a href="#calcular" className="btn-gold">💫 Analizar nuestra compatibilidad</a>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* QUÉ ANALIZAMOS */}
                <section className="section-pad">
                    <div className="container-max">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700, textAlign: "center", marginBottom: "2.5rem" }}>
                            Qué revela la Sinastría
                        </h2>
                        <div className="modules-grid">
                            {COMPAT_AREAS.map(a => (
                                <div key={a.area} className="glass-card" style={{ padding: "1.5rem" }}>
                                    <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{a.icon}</div>
                                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.4rem" }}>{a.area}</h3>
                                    <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.6 }}>{a.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* CALCULADORA */}
                <section id="calcular" className="section-pad" style={{ background: "rgba(124,58,237,0.04)" }}>
                    <div className="container-max">
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700 }}>Calcula vuestra sinastría</h2>
                            <p style={{ color: "rgba(248,248,255,0.45)", marginTop: "0.5rem", fontSize: "0.9rem" }}>Ambas cartas natales completas — motor Swiss Ephemeris</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                                <PersonForm label="PERSONA 1 — TÚ" form={person1} onChange={setPerson1} />
                                <PersonForm label="PERSONA 2 — TU PAREJA" form={person2} onChange={setPerson2} />
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <button type="submit" className="btn-gold" style={{ padding: "1.1rem 3rem", fontSize: "1.05rem" }} disabled={loading}>
                                    {loading ? "Calculando 100 puntos de contacto..." : "💫 Calcular nuestra Sinastría"}
                                </button>
                            </div>
                        </form>

                        {result && (
                            <div className="glass-card" style={{ padding: "2rem", marginTop: "2rem", borderColor: "rgba(236,72,153,0.3)", textAlign: "center" }}>
                                <div style={{ fontSize: "3rem", fontWeight: 900, fontFamily: "'Playfair Display',serif", marginBottom: "0.5rem" }}>
                                    <span className="text-gradient-cosmic">{result.compatibility_score as number ?? 72}</span>
                                    <span style={{ fontSize: "1.5rem", color: "rgba(248,248,255,0.4)" }}>/100</span>
                                </div>
                                <h3 style={{ fontSize: "1rem", color: "#A855F7", marginBottom: "0.75rem" }}>Score de Compatibilidad</h3>
                                <p style={{ color: "rgba(248,248,255,0.55)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 1.5rem" }}>
                                    Tu análisis completo de sinastría incluye los 100 puntos de contacto entre ambas cartas, el análisis de heridas mutuas, el potencial de crecimiento y el patrón kármico de la unión.
                                </p>
                                <a href="/manual-del-ser" className="btn-cosmic" style={{ textDecoration: "none", display: "inline-flex" }}>
                                    Ver análisis completo (plan Maestro) →
                                </a>
                            </div>
                        )}
                    </div>
                </section>

                <div className="glow-divider" />

                {/* CTA VIRAL */}
                <section className="section-pad" style={{ textAlign: "center" }}>
                    <div className="container-sm">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
                            Compártelo con tu pareja.<br />
                            <span className="text-gradient-cosmic">La respuesta os sorprenderá a los dos.</span>
                        </h2>
                        <p style={{ color: "rgba(248,248,255,0.45)", marginBottom: "2rem" }}>
                            La sinastría no dice si "debéis estar juntos". Dice qué esperar, qué cuidar y qué podéis construir.
                        </p>
                        <a href="#calcular" className="btn-gold">💫 Calcular ahora — Gratis</a>
                    </div>
                </section>

                <footer style={{ padding: "2rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.25)" }}>© 2026 AstrologIA · <a href="/" style={{ color: "#7C3AED", textDecoration: "none" }}>Inicio</a></p>
                </footer>
            </main>
        </>
    );
}
