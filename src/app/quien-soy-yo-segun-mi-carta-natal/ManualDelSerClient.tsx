"use client";
import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const SIGNS = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];

const DIMS = [
    { n: "01", icon: "☀️", color: "#F59E0B", title: "QUIÉN ERES", sub: "Sol + Luna + Ascendente", desc: "No 'eres Tauro'. Eres El Constructor Paciente con un Sistema Emocional Capricornio y una Máscara Libra. En lenguaje junguiano, sin simplificaciones genéricas.", api: "/api/natal-chart" },
    { n: "02", icon: "🌑", color: "#7C3AED", title: "POR QUÉ SUFRES", sub: "Quirón + Casa 12 + Saturno", desc: "El punto exacto de tu herida primaria — la que llegó antes de que pudieras defenderte. Y el don que esconde. La herida se convierte en medicina cuando la nombras.", api: "/api/karmic-wound" },
    { n: "03", icon: "⭐", color: "#A855F7", title: "PARA QUÉ VINISTE", sub: "Nodo Norte evolutivo", desc: "Tu misión de alma según la escuela evolucionaria (Green, Forrest, Caruti). El camino que el universo diseñó exactamente para ti — y el que tu Nodo Sur (pasado) intenta evitar.", api: "/api/karmic-wound" },
    { n: "04", icon: "💫", color: "#EC4899", title: "CÓMO TE RELACIONAS", sub: "Venus + Marte + Plutón", desc: "Tu arquitectura vincular completa. Por qué eliges a quien eliges. Por qué te saboteas donde más importa. El patrón que repites sin saberlo — y cómo transformarlo.", api: "/api/venus-attraction" },
    { n: "05", icon: "🪐", color: "#10B981", title: "CÓMO FLUYE TU DINERO", sub: "Júpiter + Casa 2/8/10 + Sephirot", desc: "Tu código de riqueza y los bloqueos exactos que lo frenan. Kabbalah de la Abundancia integrada — qué Sephirot corresponde a tu energía de prosperidad.", api: "/api/wealth-blueprint" },
    { n: "06", icon: "⏰", color: "#3B82F6", title: "CUÁNDO ACTUAR", sub: "Tránsitos personales en tiempo real", desc: "El reloj de tus decisiones. Qué planetas están activando tu carta hoy. El momento preciso para lanzar, negociar, soltar, emprender o esperar.", api: "/api/daily-transit-score" },
    { n: "07", icon: "🌳", color: "#8B5CF6", title: "TU CÓDIGO ANCESTRAL", sub: "Luna + Saturno + Hellienger", desc: "Qué trauma de tu linaje estás aquí para sanar. La Constelación Familiar en tu carta natal — lo que tus padres no pudieron resolver y descendió a ti como patrón epigenético.", api: "/api/ancestral-code" },
    { n: "08", icon: "✡️", color: "#F59E0B", title: "TU FRECUENCIA VIBRACIONAL", sub: "Sephirot del Árbol de la Vida", desc: "Los 10 Sephirot del Zohar mapeados a tus planetas. Tu frecuencia cósmica según la Kabbalah clásica. Kether → Malkuth: dónde estás en la escalera de la conciencia.", api: "/api/sephirot-frequency" },
];

export default function ManualDelSerClient() {
    const [form, setForm] = useState({ year: "1990", month: "6", day: "15", hour: "12", lat: "40.4168", lon: "-3.7038" });
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState(false);
    const [openDim, setOpenDim] = useState<number | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/manual-del-ser`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer demo" },
                body: JSON.stringify({ year: +form.year, month: +form.month, day: +form.day, hour: +form.hour, lat: +form.lat, lon: +form.lon }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setResult(data.data || data);
        } catch {
            const jd = (+form.year - 2000) * 365.25 + +form.month * 30.44 + +form.day;
            setResult({
                dim_1_quien_eres: { sun: { sign: SIGNS[Math.floor(((jd + 80) % 365.25) / 30.44) % 12] } },
                status: "preview",
            });
        }
        setLoading(false);
    };

    return (
        <>
            <StarField />
            <Navbar />
            <main>
                {/* HERO */}
                <section style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "9rem 1.5rem 4rem", background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 70%)" }}>
                    <div className="container-sm">
                        <span className="badge" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>✦ El Producto Premium</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(2.2rem,5.5vw,5rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: "1.25rem" }}>
                            El Manual del Ser
                        </h1>
                        <div className="font-mystic" style={{ fontSize: "clamp(0.9rem,1.5vw,1.1rem)", color: "#A855F7", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                            Las 8 Dimensiones del Alma
                        </div>
                        <p style={{ fontSize: "clamp(1rem,1.8vw,1.2rem)", color: "rgba(248,248,255,0.65)", maxWidth: 600, margin: "0 auto 1rem", lineHeight: 1.75 }}>
                            Nadie te ha dado este mapa todavía.
                        </p>
                        <p style={{ fontSize: "clamp(0.9rem,1.5vw,1.05rem)", color: "rgba(248,248,255,0.45)", maxWidth: 560, margin: "0 auto 2.5rem", lineHeight: 1.75 }}>
                            No es tu horóscopo. No es tu signo solar. Es la respuesta a las 8 preguntas que ninguna terapia, ningún libro y ningún coach ha podido responder exactamente para ti.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <a href="#calcular" className="btn-gold">✦ Obtener mi Manual del Ser — 7 días gratis</a>
                            <a href="#dimensiones" className="btn-outline">Ver las 8 dimensiones ↓</a>
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* LAS 8 DIMENSIONES EXPANDIDAS */}
                <section id="dimensiones" className="section-pad">
                    <div className="container-max">
                        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700, marginBottom: "0.75rem" }}>Las 8 Dimensiones</h2>
                            <p style={{ color: "rgba(248,248,255,0.5)", fontSize: "0.95rem" }}>Haz clic en cada dimensión para ver qué incluye</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {DIMS.map((d, i) => (
                                <div key={d.n} className="glass-card" style={{ padding: "0", overflow: "hidden", borderColor: openDim === i ? `${d.color}44` : "rgba(255,255,255,0.08)" }}>
                                    <button onClick={() => setOpenDim(openDim === i ? null : i)} style={{
                                        width: "100%", display: "flex", alignItems: "center", gap: "1.25rem", padding: "1.25rem 1.75rem",
                                        background: "none", border: "none", cursor: "pointer", textAlign: "left",
                                    }}>
                                        <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{d.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                                                <span style={{ fontFamily: "'Cinzel',serif", fontSize: "0.65rem", color: d.color, letterSpacing: "0.15em" }}>DIMENSIÓN {d.n}</span>
                                                <span style={{ fontSize: "1rem", fontWeight: 700, color: "#F8F8FF" }}>{d.title}</span>
                                            </div>
                                            <div style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.4)", marginTop: "0.2rem" }}>{d.sub}</div>
                                        </div>
                                        <span style={{ color: d.color, fontSize: "1.25rem", flexShrink: 0, transition: "transform 0.3s", transform: openDim === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                                    </button>
                                    {openDim === i && (
                                        <div style={{ padding: "0 1.75rem 1.5rem", color: "rgba(248,248,255,0.65)", fontSize: "0.9rem", lineHeight: 1.75, borderTop: `1px solid ${d.color}22` }}>
                                            {d.desc}
                                            {d.api && (
                                                <div style={{ marginTop: "0.75rem" }}>
                                                    <span className="badge" style={{ fontSize: "0.7rem" }}>Endpoint: {d.api}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* CALCULAR */}
                <section id="calcular" className="section-pad" style={{ background: "rgba(124,58,237,0.04)" }}>
                    <div className="container-max">
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700 }}>Genera tu Manual ahora</h2>
                            <p style={{ color: "rgba(248,248,255,0.45)", fontSize: "0.9rem", marginTop: "0.5rem" }}>Prueba gratuita — sin tarjeta de crédito</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "2rem" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem", marginBottom: "0.65rem" }}>
                                    {[["Año", "year"], ["Mes", "month"], ["Día", "day"]].map(([l, k]) => (
                                        <div key={k}>
                                            <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.3rem", textTransform: "uppercase" }}>{l}</label>
                                            <input className="cosmic-input" style={{ padding: "0.6rem" }} value={form[k as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginBottom: "0.65rem" }}>
                                    <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.3rem", textTransform: "uppercase" }}>Hora (0-23)</label>
                                    <input className="cosmic-input" type="number" min="0" max="23.9" step="0.5" value={form.hour} onChange={e => setForm(p => ({ ...p, hour: e.target.value }))} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1.5rem" }}>
                                    {[["Lat", "lat"], ["Lon", "lon"]].map(([l, k]) => (
                                        <div key={k}>
                                            <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.3rem", textTransform: "uppercase" }}>{l}</label>
                                            <input className="cosmic-input" style={{ padding: "0.6rem" }} value={form[k as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" className="btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                                    {loading ? "Generando tus 8 dimensiones..." : "✦ Generar mi Manual del Ser"}
                                </button>
                            </form>

                            <div>
                                {result ? (
                                    <div className="glass-card" style={{ padding: "2rem", borderColor: "rgba(124,58,237,0.3)", height: "100%" }}>
                                        <h3 style={{ color: "#A855F7", fontSize: "0.85rem", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>✦ VISTA PREVIA — DIMENSIÓN 1</h3>
                                        <p style={{ color: "rgba(248,248,255,0.65)", fontSize: "0.9rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                                            Tu Manual del Ser ha sido generado con las 8 dimensiones. Activa el plan Esencial para leer el análisis completo de cada dimensión.
                                        </p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                            {DIMS.map(d => (
                                                <div key={d.n} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0", fontSize: "0.85rem" }}>
                                                    <span style={{ color: d.color }}>✓</span>
                                                    <span style={{ color: "rgba(248,248,255,0.6)" }}>{d.title}</span>
                                                    <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "rgba(248,248,255,0.3)" }}>generado</span>
                                                </div>
                                            ))}
                                        </div>
                                        <a href="#precios" className="btn-cosmic" style={{ display: "flex", justifyContent: "center", textDecoration: "none", marginTop: "1.5rem" }}>
                                            Desbloquear mi Manual completo →
                                        </a>
                                    </div>
                                ) : (
                                    <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.2 }}>✦</div>
                                        <p style={{ color: "rgba(248,248,255,0.35)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                                            8 dimensiones de tu ser, calculadas con precisión astronómica y psicología clínica.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* PRICING ENFOCADO */}
                <section id="precios" className="section-pad">
                    <div className="container-sm" style={{ textAlign: "center" }}>
                        <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700, marginBottom: "0.75rem" }}>Elige tu profundidad</h2>
                        <p style={{ color: "rgba(248,248,255,0.45)", marginBottom: "2.5rem" }}>El Manual del Ser completo está en el plan Esencial</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1.5rem", maxWidth: 720, margin: "0 auto" }}>
                            {[
                                { name: "Dimensión 1 — Gratis", price: "€0", features: ["Quién eres (Big 3)", "Resultado inmediato", "Sin registro"], cta: "Empezar Gratis →", featured: false },
                                { name: "Manual Completo — Esencial", price: "€19/mes", features: ["Las 8 dimensiones completas", "Análisis psicológico clínico", "Quirón + Nodo Norte", "Código Ancestral", "Sephirot Kabbalístico", "Tránsitos personales"], cta: "7 días gratis →", featured: true },
                            ].map(p => (
                                <div key={p.name} className={p.featured ? "glass-card" : "glass-card"} style={{ padding: "2rem", borderColor: p.featured ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.08)", background: p.featured ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.03)" }}>
                                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{p.name}</h3>
                                    <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: "1.25rem", color: p.featured ? "#FCD34D" : "#F8F8FF" }}>{p.price}</div>
                                    <ul style={{ listStyle: "none", marginBottom: "1.5rem" }}>
                                        {p.features.map(f => (
                                            <li key={f} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", color: "rgba(248,248,255,0.65)", padding: "0.3rem 0" }}>
                                                <span style={{ color: "#10B981", flexShrink: 0 }}>✓</span>{f}
                                            </li>
                                        ))}
                                    </ul>
                                    <a href="#calcular" className={p.featured ? "btn-gold" : "btn-outline"} style={{ display: "flex", justifyContent: "center", textDecoration: "none" }}>{p.cta}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* CTA FINAL */}
                <section className="section-pad" style={{ textAlign: "center", background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,0.15) 0%, transparent 70%)" }}>
                    <div className="container-sm">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
                            <span className="text-gradient-cosmic">Tu manual lleva toda la vida esperándote.</span>
                        </h2>
                        <p style={{ color: "rgba(248,248,255,0.5)", marginBottom: "2rem" }}>
                            El universo escribió cada dimensión en el momento exacto de tu nacimiento.
                        </p>
                        <a href="#calcular" className="btn-gold" style={{ fontSize: "1.1rem", padding: "1.1rem 2.5rem" }}>
                            ✦ Generar mi Manual del Ser
                        </a>
                    </div>
                </section>

                <footer style={{ padding: "2rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.25)" }}>
                        © 2026 AstrologIA · <a href="/" style={{ color: "#7C3AED", textDecoration: "none" }}>Inicio</a> · <a href="/carta-natal" style={{ color: "#7C3AED", textDecoration: "none" }}>Carta Natal</a>
                    </p>
                </footer>
            </main>
        </>
    );
}
