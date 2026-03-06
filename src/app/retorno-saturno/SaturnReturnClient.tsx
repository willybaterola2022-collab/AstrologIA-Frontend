"use client";
import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const PHASES = [
    { range: "27–30", title: "La Deconstrucción", desc: "Todo lo que construiste antes de los 30 empieza a fallar o a cuestionarse. Carrera, relaciones, identidad. No es una crisis — es Saturno revisando si lo que construiste era tuyo o de otros.", color: "#EF4444" },
    { range: "30–33", title: "La Recontrucción", desc: "Con lo que sobrevivió al tamiz de Saturno, ahora construyes algo real. Tu primera obra de vida adulta — con tus valores, tu voz y tu dirección.", color: "#F59E0B" },
    { range: "57–60", title: "2do Retorno", desc: "El segundo Retorno de Saturno. La madurez total. Qué legado dejas. Qué estructura de vida realmente vale para ti en la segunda mitad.", color: "#A855F7" },
];

export default function SaturnReturnClient() {
    const [form, setForm] = useState({ year: "1995", month: "6", day: "15", hour: "12", lat: "40.4168", lon: "-3.7038" });
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/saturn-return`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer demo" },
                body: JSON.stringify({ year: +form.year, month: +form.month, day: +form.day, hour: +form.hour, lat: +form.lat, lon: +form.lon }),
            });
            if (!res.ok) throw new Error();
            const d = await res.json();
            setResult(d.data || d);
        } catch {
            const age = 2026 - +form.year;
            const phase = age < 30 ? "Acercándose" : age < 33 ? "En el núcleo" : age < 60 ? "Superado (1er)" : "2do Retorno";
            setResult({ saturn_sign: "Capricornio", current_phase: phase, age });
        }
        setLoading(false);
    };

    return (
        <>
            <StarField />
            <Navbar />
            <main>
                {/* HERO */}
                <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "9rem 1.5rem 4rem", background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.15) 0%, rgba(124,58,237,0.1) 50%, transparent 70%)" }}>
                    <div className="container-sm">
                        <span className="badge" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>🪐 El Coach de los 30</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(2rem,5vw,4.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem" }}>
                            El Retorno de <span className="text-gradient-violet">Saturno</span><br />
                            <span style={{ fontSize: "0.7em", color: "rgba(248,248,255,0.6)", fontWeight: 400 }}>no es una crisis. Es un trampolín.</span>
                        </h1>
                        <p style={{ fontSize: "clamp(1rem,1.8vw,1.15rem)", color: "rgba(248,248,255,0.65)", maxWidth: 600, margin: "0 auto 2rem", lineHeight: 1.75 }}>
                            Entre los 27 y 32 años, Saturno regresa al punto exacto donde estaba cuando naciste. Y lo cuestiona todo — la carrera, la pareja, la identidad, la ciudad. Los que lo entienden lo usan como el mayor trampolín de su vida adulta.
                        </p>
                        <a href="#calcular" className="btn-gold">🪐 ¿Cuándo es mi Retorno de Saturno?</a>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* LAS 3 FASES */}
                <section className="section-pad">
                    <div className="container-max">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, textAlign: "center", marginBottom: "2.5rem" }}>
                            Las 3 fases del Retorno de Saturno
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.5rem" }}>
                            {PHASES.map(p => (
                                <div key={p.range} className="glass-card" style={{ padding: "1.75rem", borderColor: `${p.color}30` }}>
                                    <div style={{ fontSize: "0.75rem", color: p.color, fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>AÑOS {p.range}</div>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>{p.title}</h3>
                                    <p style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.7 }}>{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* CALCULADORA */}
                <section id="calcular" className="section-pad" style={{ background: "rgba(59,130,246,0.04)" }}>
                    <div className="container-max">
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700 }}>¿Estás en tu Retorno?</h2>
                            <p style={{ color: "rgba(248,248,255,0.45)", marginTop: "0.5rem" }}>Calcula exactamente en qué fase estás ahora mismo</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "2rem" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem", marginBottom: "1.5rem" }}>
                                    {[["Año", "year"], ["Mes", "month"], ["Día", "day"]].map(([l, k]) => (
                                        <div key={k}>
                                            <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.3rem", textTransform: "uppercase" }}>{l}</label>
                                            <input className="cosmic-input" style={{ padding: "0.6rem" }} value={form[k as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" className="btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                                    {loading ? "Calculando tu Saturno..." : "🪐 Ver mi fase de Saturno"}
                                </button>
                            </form>

                            {result ? (
                                <div className="glass-card" style={{ padding: "2rem", borderColor: "rgba(59,130,246,0.3)" }}>
                                    <div style={{ fontSize: "0.75rem", color: "#3B82F6", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>TU SATURNO ESTÁ EN</div>
                                    <h3 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem", color: "#FCD34D" }}>
                                        {result.saturn_sign as string || "Capricornio"}
                                    </h3>
                                    <p style={{ color: "rgba(248,248,255,0.5)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                                        Fase actual: <strong style={{ color: "#F8F8FF" }}>{result.current_phase as string || "Calculando"}</strong>
                                    </p>
                                    <p style={{ color: "rgba(248,248,255,0.6)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                                        El análisis completo del Retorno de Saturno incluye: qué está siendo revisado en tu vida, cuáles son los tres ámbitos principales de la crisis, y cuál es el trampolín específico que Saturno está construyendo para ti.
                                    </p>
                                    <a href="/manual-del-ser" className="btn-cosmic" style={{ display: "flex", justifyContent: "center", textDecoration: "none" }}>
                                        Ver análisis completo →
                                    </a>
                                </div>
                            ) : (
                                <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center" }}>
                                    <div style={{ fontSize: "3rem", opacity: 0.2, marginBottom: "1rem" }}>🪐</div>
                                    <p style={{ color: "rgba(248,248,255,0.35)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                                        Saturno tarda 29.5 años en dar la vuelta completa a tu carta. El momento en que regresa al punto de tu nacimiento es el momento de mayor presión — y mayor oportunidad.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* CTA */}
                <section className="section-pad" style={{ textAlign: "center" }}>
                    <div className="container-sm">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
                            Los que entienden el Retorno<br />
                            <span className="text-gradient-cosmic">lo convierten en su mayor lanzamiento.</span>
                        </h2>
                        <p style={{ color: "rgba(248,248,255,0.45)", marginBottom: "2rem" }}>El análisis profundo de Saturno está en el Manual del Ser completo.</p>
                        <a href="/manual-del-ser" className="btn-gold">✦ Ver mi Manual del Ser</a>
                    </div>
                </section>

                <footer style={{ padding: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.25)" }}>© 2026 AstrologIA · <a href="/" style={{ color: "#7C3AED", textDecoration: "none" }}>Inicio</a></p>
                </footer>
            </main>
        </>
    );
}
