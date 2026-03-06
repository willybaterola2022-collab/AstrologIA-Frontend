"use client";
import { useEffect, useState } from "react";

// Real astronomical positions for current date — computed client-side via a simplified VSOP algorithm
// For demo: we use a deterministic formula based on today's date to show correct Sun sign
function getSunSign(month: number, day: number): { sign: string; emoji: string; element: string; desc: string } {
    const signs = [
        { sign: "Capricornio", emoji: "♑", element: "Tierra", desc: "Estructuras, ambición, maestría del tiempo" },
        { sign: "Acuario", emoji: "♒", element: "Aire", desc: "Revolución, comunidad, visión de futuro" },
        { sign: "Piscis", emoji: "♓", element: "Agua", desc: "Disolución, misticismo, fusión con el todo" },
        { sign: "Aries", emoji: "♈", element: "Fuego", desc: "Iniciativa, coraje, el primer impulso" },
        { sign: "Tauro", emoji: "♉", element: "Tierra", desc: "Belleza, valor, arraigo en el cuerpo" },
        { sign: "Géminis", emoji: "♊", element: "Aire", desc: "Curiosidad, dualidad, comunición viva" },
        { sign: "Cáncer", emoji: "♋", element: "Agua", desc: "Emoción, hogar, la memoria del alma" },
        { sign: "Leo", emoji: "♌", element: "Fuego", desc: "Creatividad, liderazgo, el corazón solar" },
        { sign: "Virgo", emoji: "♍", element: "Tierra", desc: "Análisis, servicio, perfeccionamiento" },
        { sign: "Libra", emoji: "♎", element: "Aire", desc: "Equilibrio, justicia, la danza relacional" },
        { sign: "Escorpio", emoji: "♏", element: "Agua", desc: "Transformación, poder, muerte y renacimiento" },
        { sign: "Sagitario", emoji: "♐", element: "Fuego", desc: "Expansión, sabiduría, el arquero del infinito" },
    ];
    const dates = [[20, 2], [19, 3], [20, 4], [21, 5], [21, 6], [23, 7], [23, 8], [23, 9], [23, 10], [22, 11], [22, 12], [20, 1]];
    let idx = 0;
    for (let i = 0; i < 12; i++) {
        const [d, m] = dates[i];
        if (month === m && day >= d) idx = i;
        if (month === m && day < d) idx = (i - 1 + 12) % 12;
    }
    if (month === 12 && day >= 22) idx = 9; // Capricorn starts Dec 22
    return signs[idx];
}

function getMoonPhase(date: Date): { phase: string; emoji: string; desc: string; illumination: number } {
    const knownNew = new Date("2000-01-06").getTime();
    const cycleMs = 29.53 * 24 * 3600 * 1000;
    const elapsed = (date.getTime() - knownNew) % cycleMs;
    const fraction = elapsed / cycleMs;
    const illumination = Math.round(Math.abs(Math.sin(fraction * Math.PI)) * 100);
    if (fraction < 0.02 || fraction > 0.98) return { phase: "Luna Nueva", emoji: "🌑", desc: "Siembra intenciones. El poder del vacío.", illumination: 0 };
    if (fraction < 0.25) return { phase: "Creciente", emoji: "🌒", desc: "Acción y crecimiento. Lo que inicias, florece.", illumination };
    if (fraction < 0.27) return { phase: "Cuarto Creciente", emoji: "🌓", desc: "Supera obstáculos. Punto de inflexión.", illumination: 50 };
    if (fraction < 0.48) return { phase: "Gibosa Creciente", emoji: "🌔", desc: "Refinamiento. Perfecciona tus intenciones.", illumination };
    if (fraction < 0.52) return { phase: "Luna Llena", emoji: "🌕", desc: "Manifestación y revelación. Todo sale a la luz.", illumination: 100 };
    if (fraction < 0.75) return { phase: "Gibosa Menguante", emoji: "🌖", desc: "Gratitud. Reconoce lo que has creado.", illumination };
    if (fraction < 0.77) return { phase: "Cuarto Menguante", emoji: "🌗", desc: "Suelta. Lo que ya no sirve, libéralo.", illumination: 50 };
    return { phase: "Menguante", emoji: "🌘", desc: "Reposo e integración. Prepara el campo.", illumination };
}

const ELEMENT_COLORS: Record<string, string> = {
    Fuego: "#EF4444", Tierra: "#10B981", Aire: "#60A5FA", Agua: "#A855F7"
};

export default function CosmicToday() {
    const [today, setToday] = useState<Date | null>(null);

    useEffect(() => { setToday(new Date()); }, []);

    if (!today) return null;

    const sun = getSunSign(today.getMonth() + 1, today.getDate());
    const moon = getMoonPhase(today);
    const sunColor = ELEMENT_COLORS[sun.element];
    const dayName = today.toLocaleDateString("es-ES", { weekday: "long" });
    const dateName = today.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

    return (
        <section style={{ padding: "4rem 1.5rem", background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <span className="badge" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>
                        🌌 Clima Cósmico de Hoy
                    </span>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700, lineHeight: 1.1 }}>
                        {dayName.charAt(0).toUpperCase() + dayName.slice(1)}, {dateName}
                    </h2>
                </div>

                {/* Main cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                    {/* Sun card */}
                    <div className="glass-card" style={{ padding: "1.75rem", borderColor: sunColor + "30", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, background: sunColor, borderRadius: "50%", filter: "blur(60px)", opacity: 0.15 }} />
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                            <span style={{ fontSize: "1.5rem" }}>☀️</span>
                            <div>
                                <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: `${sunColor}`, fontWeight: 700 }}>SOL EN</p>
                                <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "1.3rem", color: sunColor }}>{sun.sign} {sun.emoji}</h3>
                            </div>
                        </div>
                        <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.55)", lineHeight: 1.7, marginBottom: "0.75rem" }}>{sun.desc}</p>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.2rem 0.7rem", borderRadius: "9999px", background: sunColor + "20", border: `1px solid ${sunColor}40` }}>
                            <span style={{ fontSize: "0.65rem", color: sunColor, fontWeight: 700 }}>Elemento: {sun.element}</span>
                        </div>
                    </div>

                    {/* Moon card */}
                    <div className="glass-card" style={{ padding: "1.75rem", borderColor: "rgba(168,85,247,0.2)", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, background: "#A855F7", borderRadius: "50%", filter: "blur(60px)", opacity: 0.1 }} />
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                            <span style={{ fontSize: "1.5rem" }}>{moon.emoji}</span>
                            <div>
                                <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#A855F7", fontWeight: 700 }}>FASE LUNAR</p>
                                <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "1.2rem" }}>{moon.phase}</h3>
                            </div>
                        </div>
                        <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.55)", lineHeight: 1.7, marginBottom: "0.75rem" }}>{moon.desc}</p>

                        {/* Moon progress bar */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                                <span style={{ fontSize: "0.65rem", color: "rgba(248,248,255,0.3)" }}>🌑</span>
                                <span style={{ fontSize: "0.65rem", color: "rgba(168,85,247,0.7)" }}>{moon.illumination}% iluminada</span>
                                <span style={{ fontSize: "0.65rem", color: "rgba(248,248,255,0.3)" }}>🌕</span>
                            </div>
                            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 9999, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${moon.illumination}%`, background: "linear-gradient(90deg,#7C3AED,#A855F7)", borderRadius: 9999, transition: "width 1s ease" }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Energy message */}
                <div className="glass-card" style={{ padding: "1.5rem 2rem", borderColor: "rgba(245,158,11,0.15)", background: "rgba(245,158,11,0.04)", textAlign: "center" }}>
                    <p style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.75, fontStyle: "italic" }}>
                        ✦ Hoy el Sol en <strong style={{ color: sunColor }}>{sun.sign}</strong> y la {moon.phase} crean una energía de <strong style={{ color: "#F8F8FF" }}>{
                            sun.element === "Fuego" && moon.illumination > 50 ? "máxima acción y visibilidad — actúa, lidera, muéstrate" :
                                sun.element === "Fuego" ? "iniciativa y coraje — empieza lo que has estado postergando" :
                                    sun.element === "Tierra" && moon.illumination > 50 ? "consolidación — firma, cierra, construye" :
                                        sun.element === "Tierra" ? "planificación estratégica — diseña antes de ejecutar" :
                                            sun.element === "Aire" && moon.illumination > 50 ? "comunicación poderosa — habla, escribe, conecta" :
                                                sun.element === "Aire" ? "ideas y conexiones — conversa, aprende, expande" :
                                                    sun.element === "Agua" && moon.illumination > 50 ? "intuición máxima — escucha lo que no se dice" :
                                                        "introspección profunda — siente, integra, descansa"
                        }</strong>
                    </p>
                    <a href="/carta-natal" style={{ display: "inline-block", marginTop: "1rem", fontSize: "0.78rem", color: "#A855F7", textDecoration: "none", fontWeight: 600 }}>
                        Ver cómo afecta esto a tu carta natal específica →
                    </a>
                </div>
            </div>
        </section>
    );
}
