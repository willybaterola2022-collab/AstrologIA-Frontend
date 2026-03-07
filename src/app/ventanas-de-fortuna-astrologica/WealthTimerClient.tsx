"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";

// Wealth Timer™ — Ventanas de Fortuna Planetaria
// Júpiter (expansión) + Venus (flujo) + Parte de Fortuna (punto natal)
// El cálculo se basa en ciclos planetarios aproximados para free users
// Precisión total disponible con carta natal completa (plan Esencial)

// Júpiter completa una vuelta al zodíaco en ~12 años (30°/año, ~2.5°/mes)
// Venus ciclo sinódico: 584 días (retrograde ~ cada 18 meses)
// Favorable: Júpiter trine/sextile a Sol natal + Venus directo

function getJupiterSign(year: number): string {
    // Conocidas posiciones de Júpiter por año (tránsitos reales históricos)
    const jupiterSigns: Record<number, string> = {
        2014: "Cáncer", 2015: "Leo", 2016: "Virgo", 2017: "Libra", 2018: "Escorpio",
        2019: "Sagitario", 2020: "Capricornio", 2021: "Acuario", 2022: "Piscis",
        2023: "Aries", 2024: "Tauro", 2025: "Géminis", 2026: "Cáncer", 2027: "Leo"
    };
    return jupiterSigns[year] || "Géminis";
}

function getSunSign(year: number, month: number, day: number): string {
    const m = month, d = day;
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "Aries";
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "Tauro";
    if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "Géminis";
    if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "Cáncer";
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "Leo";
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "Virgo";
    if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "Libra";
    if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "Escorpio";
    if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "Sagitario";
    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return "Capricornio";
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "Acuario";
    return "Piscis";
}

const SIGN_ORDER = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];

function getCompatibilityScore(sunSign: string, jupiterSign: string): { score: number; type: string; description: string } {
    const sunIdx = SIGN_ORDER.indexOf(sunSign);
    const jupIdx = SIGN_ORDER.indexOf(jupiterSign);
    const diff = Math.abs(sunIdx - jupIdx);
    const minDiff = Math.min(diff, 12 - diff);

    if (minDiff === 0) return { score: 95, type: "Conjunción", description: "Júpiter sobre tu Sol natal — el año más expansivo de tu vida. La fortuna llama directamente a tu puerta." };
    if (minDiff === 4) return { score: 85, type: "Trígono ✨", description: "Armonía perfecta entre Júpiter y tu Sol. El flujo de oportunidades es natural y sostenido." };
    if (minDiff === 2) return { score: 70, type: "Sextil ✦", description: "Júpiter en sextil a tu Sol — oportunidades que requieren un paso activo de tu parte para activarlas." };
    if (minDiff === 6) return { score: 45, type: "Oposición", description: "La expansión viene a través de otros — socios, clientes, relaciones. Úsala a tu favor." };
    if (minDiff === 3) return { score: 55, type: "Cuadratura", description: "Crecimiento a través del esfuerzo y la fricción. No fácil, pero profundamente transformador." };
    return { score: 62, type: "Neutro", description: "Energía de fondo. Requiere más intención, pero los recursos están disponibles." };
}

const WEALTH_AREAS: Record<string, { icon: string; title: string; advice: string; window: string }> = {
    Aries: { icon: "🔥", title: "Iniciativas propias", advice: "Tu fortuna está en lanzar proyectos nuevos. La velocidad de ejecución es tu ventaja.", window: "🟢 Activo — el impulso está disponible ahora" },
    Tauro: { icon: "🌿", title: "Recursos y patrimonio", advice: "Consolida lo que tienes. El crecimiento sólido viene de inversiones en activos reales.", window: "🟡 Apertura gradual — construye en los próximos 30 días" },
    Géminis: { icon: "💡", title: "Conocimiento y redes", advice: "Tu fortuna fluye a través de la comunicación. Habla, enseña, conecta personas.", window: "🟢 Activo — las conexiones generan ingreso ahora" },
    Cáncer: { icon: "🏠", title: "Hogar y raíces", advice: "Real estate, familia, negocios emocionales. Tu intuición sobre el mercado es alta.", window: "🟡 Ventana de 45 días — actúa antes de agosto" },
    Leo: { icon: "⭐", title: "Creatividad y visibilidad", advice: "Tu presencia pública genera dinero. Inversión en tu marca personal tiene retorno alto.", window: "🟢 Activo — es tu temporada de brillo" },
    Virgo: { icon: "⚙️", title: "Servicio y oficio", advice: "La precisión y el servicio de calidad son tu moneda. Cobra lo que vales.", window: "🟡 Consolidación — perfecciona antes de escalar" },
    Libra: { icon: "⚖️", title: "Asociaciones y arte", advice: "El dinero llega de a dos. Las alianzas estratégicas son tu mayor activo este período.", window: "🟢 Activo — busca el socio ahora" },
    Escorpio: { icon: "🔮", title: "Transformación e inversión", advice: "Herencias, inversiones, servicios de profundidad. Tu dinero crece en lo invisible.", window: "🟡 Preparación — la apertura es en 60-75 días" },
    Sagitario: { icon: "🌍", title: "Expansión e internacional", advice: "Negocios internacionales, enseñanza, editorial. Tu fortuna cruza fronteras.", window: "🟢 Activo — piensa en grande ahora" },
    Capricornio: { icon: "🏔️", title: "Carrera y autoridad", advice: "El ascenso profesional activa el flujo económico. Invierte en tu autoridad y posición.", window: "🟡 Maduración — el fruto llega en 30-45 días" },
    Acuario: { icon: "⚡", title: "Innovación y comunidad", advice: "La tecnología y las comunidades son tu vehículo. Plataformas, colectivos, innovación.", window: "🟢 Activo — el futuro está llegando a tus manos" },
    Piscis: { icon: "🌊", title: "Arte y espiritualidad", advice: "La creatividad y la fe son tus mayores activos. Servicios de acompañamiento y arte.", window: "🟡 Gestación — la abundancia está bajo la superficie" },
};

type Step = "form" | "result";

export default function WealthTimerClient() {
    const today = new Date();
    const currentJupiterSign = getJupiterSign(today.getFullYear());
    const [step, setStep] = useState<Step>("form");
    const [form, setForm] = useState({ year: "1988", month: "6", day: "10" });
    const [result, setResult] = useState<{ sunSign: string; score: number; type: string; description: string; area: typeof WEALTH_AREAS["Aries"] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPremium, setShowPremium] = useState(false);

    async function handleCalculate() {
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));
        const sunSign = getSunSign(parseInt(form.year), parseInt(form.month), parseInt(form.day));
        const compat = getCompatibilityScore(sunSign, currentJupiterSign);
        const area = WEALTH_AREAS[sunSign];
        setResult({ sunSign, ...compat, area });
        setStep("result");
        setLoading(false);
    }

    const scoreColor = result ? (result.score >= 80 ? "#10B981" : result.score >= 60 ? "#F59E0B" : "#EF4444") : "#A855F7";

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>

                {/* HERO */}
                <section className="section-pad" style={{ textAlign: "center", background: "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(245,158,11,0.1) 0%, transparent 70%)" }}>
                    <div className="container-sm" style={{ maxWidth: 700 }}>
                        <span className="badge" style={{ marginBottom: "1rem", display: "inline-flex", borderColor: "rgba(245,158,11,0.3)", color: "#F59E0B" }}>💰 Wealth Timer™ — Ventanas de Fortuna</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1rem" }}>
                            ¿Cuándo está alineado el cielo con tu dinero?
                        </h1>
                        <p style={{ fontSize: "1rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 2rem" }}>
                            Júpiter — el planeta de la abundancia — genera ventanas de oportunidad económica con cada signo. Descubre si la fortuna está activa para ti ahora mismo.
                        </p>

                        {/* Jupiter Status */}
                        <div className="glass-card" style={{ padding: "1rem 1.5rem", display: "inline-flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
                            <span style={{ fontSize: "1.5rem" }}>♃</span>
                            <div style={{ textAlign: "left" }}>
                                <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)" }}>Júpiter transita ahora en</p>
                                <p style={{ fontSize: "1rem", fontWeight: 700, color: "#F59E0B" }}>{currentJupiterSign} · {today.getFullYear()}</p>
                            </div>
                        </div>

                        {step === "form" && (
                            <div className="glass-card" style={{ padding: "2rem", maxWidth: 400, margin: "0 auto", textAlign: "left", borderColor: "rgba(245,158,11,0.2)" }}>
                                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem", textAlign: "center" }}>Calcula tu Ventana de Fortuna</h2>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                                    {(["year", "month", "day"] as const).map(f => (
                                        <div key={f}>
                                            <label style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", display: "block", marginBottom: "0.3rem" }}>
                                                {f === "year" ? "Año" : f === "month" ? "Mes" : "Día"}
                                            </label>
                                            <input type="number"
                                                value={form[f]}
                                                onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                                                placeholder={f === "year" ? "1988" : f === "month" ? "6" : "10"}
                                                style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "0.5rem", border: "1px solid rgba(245,158,11,0.25)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.9rem" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-gold" style={{ width: "100%", fontWeight: 700 }} onClick={handleCalculate} disabled={loading}>
                                    {loading ? "⏳ Calculando tu ventana..." : "Ver mi Ventana de Fortuna →"}
                                </button>
                            </div>
                        )}

                        {step === "result" && result && (
                            <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "left" }}>

                                {/* Score card */}
                                <div className="glass-card" style={{ padding: "2rem", borderColor: scoreColor + "40", marginBottom: "1.25rem", position: "relative", overflow: "hidden" }}>
                                    <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, background: scoreColor, borderRadius: "50%", filter: "blur(90px)", opacity: 0.1 }} />

                                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                                        <div style={{ width: 80, height: 80, borderRadius: "50%", border: `3px solid ${scoreColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <div style={{ textAlign: "center" }}>
                                                <p style={{ fontSize: "1.4rem", fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{result.score}</p>
                                                <p style={{ fontSize: "0.5rem", color: "rgba(248,248,255,0.3)" }}>/ 100</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: scoreColor, fontWeight: 700, marginBottom: "0.3rem" }}>
                                                Índice de Fortuna · {result.sunSign}
                                            </p>
                                            <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 800, color: scoreColor }}>
                                                {result.type}
                                            </h2>
                                            <p style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.4)" }}>
                                                Júpiter en {currentJupiterSign} × tu Sol en {result.sunSign}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ padding: "1rem 1.25rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.75rem", borderLeft: `3px solid ${scoreColor}`, marginBottom: "1.25rem" }}>
                                        <p style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.65)", lineHeight: 1.75 }}>{result.description}</p>
                                    </div>

                                    {/* Wealth area */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                                        <div style={{ padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.75rem" }}>
                                            <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", marginBottom: "0.35rem" }}>Tu área de fortuna</p>
                                            <p style={{ fontSize: "1rem" }}>{result.area.icon}</p>
                                            <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>{result.area.title}</p>
                                            <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.6 }}>{result.area.advice}</p>
                                        </div>
                                        <div style={{ padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.75rem" }}>
                                            <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", marginBottom: "0.35rem" }}>Ventana activa</p>
                                            <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.7 }}>{result.area.window}</p>
                                        </div>
                                    </div>

                                    {/* PREMIUM GATE */}
                                    {!showPremium ? (
                                        <div style={{ padding: "1.25rem", background: "rgba(245,158,11,0.05)", borderRadius: "0.75rem", border: "1px solid rgba(245,158,11,0.15)", textAlign: "center" }}>
                                            <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>🔒 Wealth Timer™ 90 días personalizado</p>
                                            <p style={{ fontSize: "0.73rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.75rem", lineHeight: 1.6 }}>
                                                Con tu carta natal completa: calendario de 90 días con ventanas exactas de Júpiter, Venus, Parte de Fortuna y tus casas 2-8-10.
                                            </p>
                                            <button className="btn-gold" onClick={() => setShowPremium(true)} style={{ fontSize: "0.8rem", fontWeight: 700 }}>Ver mi mapa de 90 días →</button>
                                        </div>
                                    ) : (
                                        <div style={{ padding: "1.25rem", background: "rgba(245,158,11,0.07)", borderRadius: "0.75rem", border: "1px solid rgba(245,158,11,0.25)", textAlign: "center" }}>
                                            <p style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.4rem" }}>✨ Plan Maestro — Wealth Timer™ Completo</p>
                                            <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.45)", marginBottom: "1rem", lineHeight: 1.6 }}>
                                                90 días de ventanas de Júpiter, Venus, Marte y la Parte de Fortuna exacta para tu carta natal.
                                            </p>
                                            <a href="/precios" className="btn-gold" style={{ fontWeight: 700, textDecoration: "none", display: "inline-block", padding: "0.6rem 1.5rem", fontSize: "0.82rem" }}>
                                                Activar Plan Maestro →
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Share */}
                                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                                    <button
                                        onClick={() => {
                                            const text = `Mi Índice de Fortuna Jupiterino es ${result.score}/100 — ${result.type}. ${result.area.window}. Calcula el tuyo: crystal-cosmos.vercel.app/ventanas-de-fortuna-astrologica 💰✨`;
                                            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                                        }}
                                        style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
                                    >
                                        💬 Compartir en WhatsApp
                                    </button>
                                    <button onClick={() => setStep("form")} style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(248,248,255,0.4)", fontSize: "0.78rem", cursor: "pointer" }}>
                                        Calcular otra fecha
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="section-pad" style={{ background: "rgba(0,0,0,0.15)" }}>
                    <div className="container-sm">
                        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.3rem,2vw,1.8rem)", fontWeight: 700, marginBottom: "0.5rem" }}>Cómo funciona el Wealth Timer™</h2>
                            <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.35)", maxWidth: 500, margin: "0 auto" }}>La astrología financiera no predice — calibra. Te enseña cuándo la energía cósmica está alineada con tu intención económica.</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem" }}>
                            {[
                                { icon: "♃", label: "Júpiter", desc: "El gran benefactor. Donde transita, hay expansión y oportunidad durante 12-14 meses." },
                                { icon: "♀️", label: "Venus", desc: "El flujo del dinero. Sus ciclos (584 días) marcan períodos de abundancia o contención." },
                                { icon: "🌟", label: "Parte de Fortuna", desc: "El punto natal más sensible al dinero. Cuando un tránsito lo toca, las oportunidades materializan." },
                                { icon: "🏠", label: "Casas 2, 8, 10", desc: "Las tres casas del dinero en tu carta: ingresos propios, recursos compartidos y carrera." },
                            ].map(d => (
                                <div key={d.label} style={{ padding: "1.25rem", background: "rgba(255,255,255,0.02)", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{d.icon}</p>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>{d.label}</p>
                                    <p style={{ fontSize: "0.73rem", color: "rgba(248,248,255,0.4)", lineHeight: 1.6 }}>{d.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
            <GlobalFooter />
        </>
    );
}
