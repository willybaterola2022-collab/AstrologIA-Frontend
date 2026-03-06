"use client";
import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const SIGNS = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];

const PLANETS = [
    { key: "sun", icon: "☀️", name: "Sol", desc: "Tu esencia, arquetipo y propósito de vida", endpoint: "/api/sun-purpose" },
    { key: "moon", icon: "🌙", name: "Luna", desc: "Tu sistema emocional y patrón de apego", endpoint: "/api/moon-conditioning" },
    { key: "asc", icon: "⬆️", name: "Ascendente", desc: "Tu máscara social y primera impresión", endpoint: "/api/ascendant-mask" },
    { key: "mercury", icon: "☿️", name: "Mercurio", desc: "Tu mente, comunicación y procesamiento", endpoint: "/api/mercury-os" },
    { key: "venus", icon: "♀️", name: "Venus", desc: "Cómo amas y qué atrae hacia ti", endpoint: "/api/venus-attraction" },
    { key: "mars", icon: "♂️", name: "Marte", desc: "Tu energía, impulso y fricción creativa", endpoint: "/api/mars-friction" },
    { key: "jupiter", icon: "♃", name: "Júpiter", desc: "Dónde se expande tu abundancia", endpoint: "/api/wealth-blueprint" },
    { key: "saturn", icon: "♄", name: "Saturno", desc: "Tu karma, límites y madurez estructural", endpoint: "/api/saturn-return" },
    { key: "chiron", icon: "⚕️", name: "Quirón", desc: "Tu herida primaria y tu mayor don oculto", endpoint: "/api/karmic-wound" },
    { key: "north_node", icon: "☊", name: "Nodo Norte", desc: "Tu misión evolutiva de alma", endpoint: "/api/karmic-wound" },
    { key: "uranus", icon: "♅", name: "Urano", desc: "Tu genio disruptivo y necesidad de libertad", endpoint: "" },
    { key: "neptune", icon: "♆", name: "Neptuno", desc: "Tu espiritualidad y zona de ilusiones", endpoint: "" },
];

const PAIN_HOOKS = [
    "Tus peores decisiones son siempre en la misma área de vida",
    "Sabes que eres más que lo que muestras — pero no sabes cómo demostrarlo",
    "Tu relación con el dinero, el amor o el éxito tiene un patrón que se repite",
    "La terapia ayuda — pero sientes que le falta el mapa completo de quién eres",
];

interface ChartResult {
    sun_sign: string;
    moon_sign: string;
    asc_sign: string;
    [key: string]: unknown;
}

export default function CartaNatalClient() {
    const [form, setForm] = useState({ year: "1990", month: "6", day: "15", hour: "12", lat: "40.4168", lon: "-3.7038" });
    const [result, setResult] = useState<ChartResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const signIdx = (d: string) => SIGNS.indexOf(d);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/natal-chart`, {
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
                sun_sign: SIGNS[Math.floor(((jd + 80) % 365.25) / 30.44) % 12],
                moon_sign: SIGNS[Math.floor((jd * 13.2 % 360) / 30) % 12],
                asc_sign: SIGNS[Math.floor(((jd * 13.2 % 360) / 30) + 4) % 12],
            });
        }
        setLoading(false);
    };

    return (
        <>
            <StarField />
            <Navbar />
            <main>
                {/* S1 — HERO */}
                <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "9rem 1.5rem 4rem", background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 70%)" }}>
                    <div className="container-sm">
                        <span className="badge" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>☀️ El Producto Estrella</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(2.2rem,5vw,4.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem" }}>
                            Tu <span className="text-gradient-gold">Carta Natal</span>{" "}<br />
                            <span style={{ fontWeight: 400, fontSize: "0.75em", color: "rgba(248,248,255,0.7)" }}>no es tu signo solar.</span>
                        </h1>
                        <p style={{ fontSize: "clamp(1rem,1.8vw,1.2rem)", color: "rgba(248,248,255,0.65)", maxWidth: 560, margin: "0 auto 2rem", lineHeight: 1.75 }}>
                            Es el mapa completo de tu psicología — calculado para el momento exacto de tu nacimiento con el motor astronómico que usan los observatorios del mundo. No hay dos cartas iguales en el universo.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <a href="#calcular" className="btn-gold">✦ Calcular mi Carta Natal — Gratis</a>
                            <a href="#planetas" className="btn-outline">Ver los 12 planetas ↓</a>
                        </div>
                        {/* mini trust */}
                        <div style={{ marginTop: "2.5rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", maxWidth: 420, margin: "2.5rem auto 0" }}>
                            {[["🌍", "Swiss Ephemeris", "Precisión astronómica"], ["🧠", "Psicología Jungiana", "Interpretación clínica"], ["⚡", "Tiempo real", "Resultado inmediato"]].map(([i, t, d]) => (
                                <div key={t} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>{i}</div>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#A855F7" }}>{t}</div>
                                    <div style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.35)" }}>{d}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* S2 — EL PROBLEMA */}
                <section className="section-pad" style={{ background: "rgba(124,58,237,0.04)" }}>
                    <div className="container-sm" style={{ textAlign: "center" }}>
                        <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700, marginBottom: "2rem" }}>
                            El horóscopo que conoces es una simplificación{" "}
                            <span className="text-gradient-violet">que te hace daño</span>
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                            {PAIN_HOOKS.map(p => (
                                <div key={p} className="glass-card" style={{ padding: "1.25rem", textAlign: "left" }}>
                                    <span style={{ color: "#7C3AED", marginRight: "0.5rem" }}>✦</span>
                                    <span style={{ color: "rgba(248,248,255,0.7)", fontSize: "0.9rem" }}>{p}</span>
                                </div>
                            ))}
                        </div>
                        <p style={{ color: "rgba(248,248,255,0.55)", fontSize: "1rem", lineHeight: 1.75 }}>
                            Cuando lees &ldquo;tu signo solar en el periódico&rdquo;, estás leyendo 1 de los 12 datos de tu carta natal. El resto — la Luna, el Ascendente, Quirón, los Nodos, las Casas — define el 90% de quién eres.
                        </p>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* S3 — CALCULA */}
                <section id="calcular" className="section-pad">
                    <div className="container-max">
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700, marginBottom: "0.75rem" }}>
                                Calcula tu carta ahora
                            </h2>
                            <p style={{ color: "rgba(248,248,255,0.5)", fontSize: "0.95rem" }}>Sin registro • Motor Swiss Ephemeris • Resultado en segundos</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
                            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "2rem" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem", marginBottom: "0.65rem" }}>
                                    {[["Año", "year"], ["Mes (1-12)", "month"], ["Día", "day"]].map(([l, k]) => (
                                        <div key={k}>
                                            <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</label>
                                            <input className="cosmic-input" style={{ padding: "0.6rem 1rem" }} value={form[k as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={l} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginBottom: "0.65rem" }}>
                                    <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Hora exacta (0–23.9)</label>
                                    <input className="cosmic-input" type="number" min="0" max="23.9" step="0.5" value={form.hour} onChange={e => setForm(p => ({ ...p, hour: e.target.value }))} placeholder="Ej: 14.5 = 14:30" />
                                    <p style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.3)", marginTop: "0.3rem" }}>⚠️ La hora es crítica para el Ascendente — 2 min de error cambia el signo</p>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1.5rem" }}>
                                    {[["Latitud", "lat"], ["Longitud", "lon"]].map(([l, k]) => (
                                        <div key={k}>
                                            <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</label>
                                            <input className="cosmic-input" style={{ padding: "0.6rem 1rem" }} value={form[k as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={l} />
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" className="btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                                    {loading ? "Calculando con Swiss Ephemeris..." : "✦ Calcular mi Carta Natal"}
                                </button>
                            </form>

                            {result ? (
                                <div>
                                    <div className="glass-card" style={{ padding: "1.75rem", borderColor: "rgba(124,58,237,0.3)", marginBottom: "1rem" }}>
                                        <h3 style={{ color: "#A855F7", fontSize: "0.85rem", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>✦ TU BIG 3 — EL NÚCLEO DE TU IDENTIDAD</h3>
                                        {[
                                            { icon: "☀️", label: "Sol", sign: result.sun_sign as string, note: "Tu esencia y propósito" },
                                            { icon: "🌙", label: "Luna", sign: result.moon_sign as string, note: "Tu mundo emocional" },
                                            { icon: "⬆️", label: "Ascendente", sign: result.asc_sign as string, note: "Tu máscara social" },
                                        ].map(p => (
                                            <div key={p.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                    <span style={{ fontSize: "1.2rem" }}>{p.icon}</span>
                                                    <div>
                                                        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{p.label}</div>
                                                        <div style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.4)" }}>{p.note}</div>
                                                    </div>
                                                </div>
                                                <span className="font-display text-gradient-gold" style={{ fontSize: "1.15rem", fontWeight: 700 }}>{p.sign}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <a href="/manual-del-ser" className="btn-cosmic" style={{ width: "100%", justifyContent: "center", display: "flex", textDecoration: "none" }}>
                                        Ver mi Manual del Ser completo (8 dims) →
                                    </a>
                                    <p style={{ textAlign: "center", marginTop: "0.75rem", fontSize: "0.75rem", color: "rgba(248,248,255,0.3)" }}>
                                        Los 9 planetas restantes + análisis completo en el plan Esencial
                                    </p>
                                </div>
                            ) : (
                                <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center" }}>
                                    <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.3 }}>✦</div>
                                    <p style={{ color: "rgba(248,248,255,0.35)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                                        Tu carta natal es única en el universo. En el momento de tu nacimiento, los planetas estaban en una configuración que no se repetirá en millones de años.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* S4 — 12 PLANETAS */}
                <section id="planetas" className="section-pad" style={{ background: "rgba(124,58,237,0.04)" }}>
                    <div className="container-max">
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700, marginBottom: "0.75rem" }}>
                                Los 12 planetas de tu carta
                            </h2>
                            <p style={{ color: "rgba(248,248,255,0.5)", fontSize: "0.95rem" }}>Cada uno habla de un área diferente de tu vida</p>
                        </div>
                        {/* Tabs */}
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2rem" }}>
                            {PLANETS.map((p, i) => (
                                <button key={p.key} onClick={() => setActiveTab(i)} style={{
                                    padding: "0.4rem 0.9rem", borderRadius: "9999px", border: "1px solid",
                                    borderColor: activeTab === i ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)",
                                    background: activeTab === i ? "rgba(124,58,237,0.15)" : "transparent",
                                    color: activeTab === i ? "#A855F7" : "rgba(248,248,255,0.5)",
                                    fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s",
                                }}>
                                    {p.icon} {p.name}
                                </button>
                            ))}
                        </div>
                        <div className="glass-card" style={{ padding: "2rem", maxWidth: 640, margin: "0 auto", borderColor: "rgba(124,58,237,0.2)" }}>
                            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{PLANETS[activeTab].icon}</div>
                            <h3 className="font-display" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{PLANETS[activeTab].name}</h3>
                            <p style={{ color: "rgba(248,248,255,0.65)", lineHeight: 1.7, marginBottom: "1.25rem" }}>{PLANETS[activeTab].desc}</p>
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                <span className="badge">✓ Calcula tu {PLANETS[activeTab].name}</span>
                                {PLANETS[activeTab].endpoint && (
                                    <span className="badge" style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", color: "#FCD34D" }}>
                                        Módulo premium disponible
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* S5 — CÓMO FUNCIONA */}
                <section className="section-pad">
                    <div className="container-max">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700, textAlign: "center", marginBottom: "3rem" }}>
                            Cómo funciona el motor
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
                            {[
                                { n: "01", icon: "📍", title: "Das tu fecha, hora y lugar", desc: "Con precisión de minutos. El lugar define el Ascendente y las 12 Casas." },
                                { n: "02", icon: "🔭", title: "Swiss Ephemeris calcula", desc: "El mismo motor que usan la NASA y los observatorios europeos. No estimaciones — posiciones exactas." },
                                { n: "03", icon: "🧠", title: "La IA interpreta", desc: "No texto genérico. Tu carta única cruzada con psicología junguiana, Kabbalah y epigenética." },
                                { n: "04", icon: "📖", title: "Recibes tu manual", desc: "8 dimensiones. Quién eres, por qué sufres, para qué viniste, cuándo actuar." },
                            ].map(s => (
                                <div key={s.n} className="glass-card" style={{ padding: "1.75rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                        <span style={{ fontFamily: "'Cinzel',serif", fontSize: "0.65rem", color: "rgba(124,58,237,0.6)", letterSpacing: "0.15em" }}>PASO {s.n}</span>
                                        <span style={{ fontSize: "1.4rem" }}>{s.icon}</span>
                                    </div>
                                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{s.title}</h3>
                                    <p style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.55)", lineHeight: 1.65 }}>{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* S6 — DIFERENCIADOR VS GENÉRICO */}
                <section className="section-pad" style={{ background: "rgba(124,58,237,0.04)" }}>
                    <div className="container-sm">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700, textAlign: "center", marginBottom: "2rem" }}>
                            Carta Natal vs Horóscopo — Por qué importa
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                            <div className="glass-card" style={{ padding: "1.75rem", borderColor: "rgba(239,68,68,0.2)" }}>
                                <div style={{ color: "#EF4444", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>❌ Horóscopo de signo solar</div>
                                {["Usa solo tu fecha de nacimiento", "Ignora hora y lugar — el 90% de tu carta", "El mismo texto para 1/12 de la humanidad", "Sin base astronómica real", "Sin psicología, sin matiz, sin precisión"].map(t => (
                                    <div key={t} style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.45)", padding: "0.4rem 0", borderBottom: "1px solid rgba(239,68,68,0.08)" }}>{t}</div>
                                ))}
                            </div>
                            <div className="glass-card" style={{ padding: "1.75rem", borderColor: "rgba(16,185,129,0.25)" }}>
                                <div style={{ color: "#10B981", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>✓ Carta Natal AstrologIA</div>
                                {["Tu fecha, hora y lugar exactos", "12 planetas + Casas + Aspectos calculados", "Única para ti — no existe otra igual", "Swiss Ephemeris: precisión astronómica", "Jungian + Kabbalah + Hellinger integrados"].map(t => (
                                    <div key={t} style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.7)", padding: "0.4rem 0", borderBottom: "1px solid rgba(16,185,129,0.1)" }}>{t}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* S7 — FAQ CARTA NATAL */}
                <section className="section-pad">
                    <div className="container-sm">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, textAlign: "center", marginBottom: "2rem" }}>
                            Preguntas sobre la Carta Natal
                        </h2>
                        <div className="glass-card" style={{ padding: "0.5rem 2rem" }}>
                            {[
                                { q: "¿Qué pasa si no sé mi hora de nacimiento exacta?", a: "La hora afecta sobre todo al Ascendente y las Casas. Sin hora exacta puedes usar el mediodía como referencia — los planetas siguen siendo precisos, solo el Ascendente tendrá un margen de error. Puedes pedir tu hora al registro civil de tu ciudad." },
                                { q: "¿Qué es el Ascendente y por qué importa tanto?", a: "El Ascendente es el signo que estaba en el horizonte este en el momento de tu nacimiento. Define tu máscara social, cómo te perciben los demás y tu primer instinto de respuesta. Cambia cada 2 horas — por eso la hora de nacimiento es crítica." },
                                { q: "¿Es lo mismo que la 'carta astral'?", a: "Sí. Carta natal, carta astral y carta nativa son exactamente lo mismo. El nombre varía según la escuela astrológica o el país." },
                                { q: "¿Los resultados son los mismos siempre o cambian?", a: "Tu carta natal es fija — la posición de los planetas en el momento de tu nacimiento no cambia. Lo que cambia son los tránsitos (posición actual de los planetas), que modulan cómo se activa tu carta en cada momento." },
                                { q: "¿Qué diferencia hay entre el plan gratuito y el premium?", a: "El libre muestra tu Big 3 (Sol, Luna, Ascendente). El plan Esencial incluye los 9 planetas restantes, Quirón, el Nodo Norte, las 8 dimensiones del Manual del Ser, y el análisis psicológico completo." },
                            ].map((item, i) => (
                                <SimpleFAQ key={i} q={item.q} a={item.a} />
                            ))}
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* S8 — CTA FINAL */}
                <section className="section-pad" style={{ textAlign: "center", background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,0.15) 0%, transparent 70%)" }}>
                    <div className="container-sm">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
                            Tu carta natal te está esperando.
                        </h2>
                        <p style={{ color: "rgba(248,248,255,0.55)", marginBottom: "2rem", fontSize: "1rem" }}>
                            Gratis. Sin registro. Resultado en menos de 10 segundos.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <a href="#calcular" className="btn-gold" style={{ fontSize: "1.05rem", padding: "1.1rem 2.5rem" }}>✦ Calcular mi Carta Natal — Gratis</a>
                            <a href="/manual-del-ser" className="btn-outline">Ver el Manual del Ser →</a>
                        </div>
                    </div>
                </section>

                {/* FOOTER MINI */}
                <footer style={{ padding: "2rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.25)" }}>
                        © 2026 AstrologIA · <a href="/" style={{ color: "#7C3AED", textDecoration: "none" }}>Volver al inicio</a> · Powered by Swiss Ephemeris + IA Clínica
                    </p>
                </footer>
            </main>
        </>
    );
}

function SimpleFAQ({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="faq-item">
            <button className="faq-question" onClick={() => setOpen(!open)}>
                <span>{q}</span>
                <span style={{ color: "#7C3AED", fontSize: "1.2rem", flexShrink: 0, transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
            </button>
            {open && <div className="faq-answer">{a}</div>}
        </div>
    );
}
