"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";
import { track } from "@/lib/analytics";

// ══════════════════════════════════════════════════════════
// MATCH ASTRAL — Compatibilidad astrológica profunda
// URL: /match-astral-por-carta-natal
// Backend: POST https://astrologaia-backend.onrender.com/api/sinastria
// Calcula: score general, 5 dimensiones, arquetipos de pareja, dinámica
// ══════════════════════════════════════════════════════════

const BACKEND = "https://astrologaia-backend.onrender.com";

const SIGNS = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];
const SIGN_EMOJIS: Record<string, string> = {
    Aries: "♈", Tauro: "♉", "Géminis": "♊", "Cáncer": "♋", Leo: "♌", Virgo: "♍",
    Libra: "♎", Escorpio: "♏", Sagitario: "♐", Capricornio: "♑", Acuario: "♒", Piscis: "♓"
};

interface PersonForm { name: string; day: string; month: string; year: string; hour: string; minute: string; city: string; sun: string; moon: string; asc: string; }
interface MatchResult { score: number; dimensions: Record<string, number>; archetypes: { person1: string; person2: string; dynamic: string; }; strengths: string[]; challenges: string[]; summary: string; longterm: string; }

const emptyForm = (): PersonForm => ({ name: "", day: "", month: "", year: "", hour: "12", minute: "00", city: "", sun: "", moon: "", asc: "" });

// Offline local compatibility engine (fallback when backend is cold)
function localMatch(p1: PersonForm, p2: PersonForm): MatchResult {
    const elementMap: Record<string, "FIRE" | "EARTH" | "AIR" | "WATER"> = {
        Aries: "FIRE", Leo: "FIRE", Sagitario: "FIRE",
        Tauro: "EARTH", Virgo: "EARTH", Capricornio: "EARTH",
        "Géminis": "AIR", Libra: "AIR", Acuario: "AIR",
        "Cáncer": "WATER", Escorpio: "WATER", Piscis: "WATER",
    };
    const modalityMap: Record<string, string> = {
        Aries: "C", Cáncer: "C", Libra: "C", Capricornio: "C",
        Tauro: "F", Leo: "F", Escorpio: "F", Acuario: "F",
        "Géminis": "M", Virgo: "M", Sagitario: "M", Piscis: "M",
    };
    const e1 = elementMap[p1.sun] || "FIRE";
    const e2 = elementMap[p2.sun] || "FIRE";
    const m1 = modalityMap[p1.sun];
    const m2 = modalityMap[p2.sun];
    const elemScore = e1 === e2 ? 90 : ({ "FIRE-AIR": 85, "AIR-FIRE": 85, "EARTH-WATER": 85, "WATER-EARTH": 85, "FIRE-EARTH": 60, "EARTH-FIRE": 60, "AIR-WATER": 55, "WATER-AIR": 55 } as Record<string, number>)[`${e1}-${e2}`] || 65;
    const modScore = m1 === m2 ? 70 : m1 && m2 ? 80 : 75;
    const score = Math.round((elemScore * 0.6 + modScore * 0.4));
    const elementLabels: Record<string, string> = { FIRE: "Fuego", EARTH: "Tierra", AIR: "Aire", WATER: "Agua" };

    const DYNAMICS: Record<string, { dynamic: string; p1: string; p2: string }> = {
        "FIRE-FIRE": { dynamic: "Dos llamas — apasionados, intensos, necesitan espacio para no consumirse", p1: "El Iniciador", p2: "El Activador" },
        "FIRE-AIR": { dynamic: "La llama y el viento — la pareja perfecta de la inspiración y la acción", p1: "El Visionario", p2: "El Mensajero" },
        "EARTH-WATER": { dynamic: "La tierra y el agua — construyen juntos lo que dura generaciones", p1: "El Constructor", p2: "El Sanador" },
        "AIR-WATER": { dynamic: "El pensamiento y la emoción — se complementan si aprenden a comunicar", p1: "El Pensador", p2: "El Sentidor" },
        "FIRE-EARTH": { dynamic: "El fuego y la tierra — tensión creativa que puede ser muy productiva", p1: "El Soñador", p2: "El Realizador" },
        "FIRE-WATER": { dynamic: "El fuego y el agua — opuestos que se atraen y se transforman mutuamente", p1: "El Ardiente", p2: "El Profundo" },
        "AIR-EARTH": { dynamic: "El pensamiento y la materialización — ideas que se vuelven realidad", p1: "El Estratega", p2: "El Ejecutor" },
        "AIR-AIR": { dynamic: "Dos mentes en expansión — estimulantes y a veces dispersos juntos", p1: "El Conceptualizador", p2: "El Dialogante" },
        "EARTH-EARTH": { dynamic: "Sólidos y estables — se construyen juntos pero deben cultivar el fuego", p1: "El Guardián", p2: "El Arquitecto" },
        "WATER-WATER": { dynamic: "Profundidad emocional total — una relación de transformación mutua", p1: "El Intuitivo", p2: "El Empático" },
    };
    const dynKey = `${e1}-${e2}`;
    const dynData = DYNAMICS[dynKey] || DYNAMICS[`${e2}-${e1}`] || { dynamic: "Una pareja con polaridades únicas y fascinantes", p1: "El Explorador", p2: "El Descubridor" };

    return {
        score,
        dimensions: { Comunicación: Math.min(95, elemScore + 5), Pasión: Math.min(95, modScore + 10), Confianza: Math.min(95, elemScore - 5), Crecimiento: 78, "Largo plazo": Math.min(95, score + 3) },
        archetypes: { person1: dynData.p1, person2: dynData.p2, dynamic: dynData.dynamic },
        strengths: [
            `Ambos poseen energía ${elementLabels[e1]}${e1 === e2 ? " — perfecta sintonía elemental" : ` y ${elementLabels[e2]} — complemento natural`}`,
            "Pueden aprender enormemente el uno del otro si hay apertura",
            score > 75 ? "Alta afinidad de base — la relación fluye con naturalidad" : "La tensión entre vosotros es oportunidad de crecimiento profundo",
        ],
        challenges: [
            score < 70 ? "Estilos de vida y ritmos distintos que requieren negociación consciente" : "Pueden necesitar cultivar rutinas compartidas",
            "Como toda pareja: la comunicación profunda es el trabajo permanente",
        ],
        summary: `${p1.name || "Persona 1"} (${p1.sun} ☀️) y ${p2.name || "Persona 2"} (${p2.sun} ☀️) tienen una compatibilidad del ${score}%. ${dynData.dynamic}.`,
        longterm: score > 80 ? "Alta compatibilidad a largo plazo. La base es sólida para construir algo real." : score > 65 ? "Compatibilidad media-alta. Con comunicación consciente, esta pareja puede ser muy poderosa." : "La compatibilidad requiere trabajo consciente de ambos lados — pero las relaciones de mayor aprendizaje son exactamente estas.",
    };
}

export default function MatchAstralClient() {
    const [p1, setP1] = useState<PersonForm>(emptyForm());
    const [p2, setP2] = useState<PersonForm>(emptyForm());
    const [result, setResult] = useState<MatchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [showGate, setShowGate] = useState(false);
    const [activeSection, setActiveSection] = useState<"personas" | "result">("personas");
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => { track.moduleEnter("match_astral"); }, []);

    async function calculate() {
        if (!p1.sun || !p2.sun) return;
        setLoading(true);
        track.calculateClick("match_astral");

        try {
            // Try backend first
            const payload = {
                person1: { name: p1.name || "Persona 1", date: `${p1.year}-${String(p1.month).padStart(2, "0")}-${String(p1.day).padStart(2, "0")}`, time: `${p1.hour}:${p1.minute}`, city: p1.city || "Madrid", country: "ES" },
                person2: { name: p2.name || "Persona 2", date: `${p2.year}-${String(p2.month).padStart(2, "0")}-${String(p2.day).padStart(2, "0")}`, time: `${p2.hour}:${p2.minute}`, city: p2.city || "Madrid", country: "ES" },
            };
            const hasFullData = p1.day && p1.month && p1.year && p2.day && p2.month && p2.year;

            if (hasFullData) {
                const r = await fetch(`${BACKEND}/api/sinastria`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ""}` }, body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
                if (r.ok) {
                    const data = await r.json();
                    setResult({ score: data.overall_score || 75, dimensions: data.dimensions || {}, archetypes: data.archetypes || { person1: "El Visionario", person2: "El Sentidor", dynamic: "Una pareja de transformación" }, strengths: data.strengths || [], challenges: data.challenges || [], summary: data.summary || "", longterm: data.longterm || "" });
                    setActiveSection("result");
                    setLoading(false);
                    track.resultReceived("match_astral", String(data.overall_score), 1);
                    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
                    return;
                }
            }
        } catch { /* fallback */ }

        // Local fallback
        const r = localMatch(p1, p2);
        setResult(r);
        setActiveSection("result");
        setLoading(false);
        track.resultReceived("match_astral", String(r.score), 0);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    }

    function SignSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
        return (
            <select value={value} onChange={e => onChange(e.target.value)}
                style={{ padding: "0.55rem 0.75rem", borderRadius: "0.5rem", border: "1px solid rgba(124,58,237,0.25)", background: "rgba(255,255,255,0.04)", color: value ? "#F8F8FF" : "rgba(248,248,255,0.3)", fontSize: "0.84rem", width: "100%" }}>
                <option value="" style={{ background: "#0a0a1a" }}>— Selecciona —</option>
                {SIGNS.map(s => <option key={s} value={s} style={{ background: "#0a0a1a" }}>{SIGN_EMOJIS[s]} {s}</option>)}
            </select>
        );
    }

    function PersonCard({ person, setPerson, label, color }: { person: PersonForm; setPerson: (p: PersonForm) => void; label: string; color: string }) {
        return (
            <div className="glass-card" style={{ padding: "1.25rem", borderColor: color + "25" }}>
                <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color, fontWeight: 700, marginBottom: "0.75rem" }}>{label}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <div style={{ gridColumn: "1/-1" }}>
                        <label style={{ fontSize: "0.65rem", color: "rgba(248,248,255,0.3)", display: "block", marginBottom: "0.2rem" }}>Nombre (opcional)</label>
                        <input type="text" placeholder="Nombre" value={person.name} onChange={e => setPerson({ ...person, name: e.target.value })}
                            style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#F8F8FF", fontSize: "0.84rem" }} />
                    </div>
                    <div>
                        <label style={{ fontSize: "0.63rem", color: "rgba(248,248,255,0.3)", display: "block", marginBottom: "0.2rem" }}>☀️ Signo Solar</label>
                        <SignSelect value={person.sun} onChange={v => setPerson({ ...person, sun: v })} />
                    </div>
                    <div>
                        <label style={{ fontSize: "0.63rem", color: "rgba(248,248,255,0.3)", display: "block", marginBottom: "0.2rem" }}>🌙 Signo Lunar</label>
                        <SignSelect value={person.moon} onChange={v => setPerson({ ...person, moon: v })} />
                    </div>
                    <div style={{ gridColumn: "1/-1" }}>
                        <label style={{ fontSize: "0.63rem", color: "rgba(248,248,255,0.3)", display: "block", marginBottom: "0.2rem" }}>↑ Ascendente</label>
                        <SignSelect value={person.asc} onChange={v => setPerson({ ...person, asc: v })} />
                    </div>
                </div>
            </div>
        );
    }

    const scoreColor = result ? (result.score >= 80 ? "#22C55E" : result.score >= 65 ? "#F59E0B" : "#EF4444") : "#7C3AED";

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>

                {/* HERO */}
                <section className="section-pad" style={{ textAlign: "center", background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(236,72,153,0.10) 0%, transparent 70%)" }}>
                    <div className="container-sm" style={{ maxWidth: 680 }}>
                        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>💫</div>
                        <span className="badge" style={{ marginBottom: "1rem", display: "inline-flex", background: "rgba(236,72,153,0.1)", borderColor: "rgba(236,72,153,0.25)", color: "#EC4899" }}>Match Astral</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.75rem" }}>
                            ¿Qué dice el universo<br />de vuestra pareja?
                        </h1>
                        <p style={{ fontSize: "0.9rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto 2rem" }}>
                            Más allá del signo solar. El análisis de compatibilidad real usa tu Big Three completo — Sol, Luna y Ascendente — para revelar la dinámica real de la pareja.
                        </p>
                    </div>
                </section>

                {/* FORM */}
                <section style={{ padding: "0 1rem 2rem" }}>
                    <div className="container-sm" style={{ maxWidth: 680 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                            <PersonCard person={p1} setPerson={setP1} label="✦ Primera persona" color="#7C3AED" />
                            <PersonCard person={p2} setPerson={setP2} label="✦ Segunda persona" color="#EC4899" />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <button className="btn-gold" style={{ padding: "0.85rem 2.5rem", fontSize: "1rem", fontWeight: 800, opacity: (!p1.sun || !p2.sun) ? 0.4 : 1 }}
                                onClick={calculate} disabled={loading || !p1.sun || !p2.sun}>
                                {loading ? "Calculando compatibilidad..." : "Calcular compatibilidad →"}
                            </button>
                            {!p1.sun && <p style={{ fontSize: "0.72rem", color: "rgba(248,248,255,0.25)", marginTop: "0.4rem" }}>Selecciona al menos el signo solar de cada persona</p>}
                        </div>
                    </div>
                </section>

                {/* RESULT */}
                {result && (
                    <section ref={resultRef} className="section-pad" style={{ background: "rgba(0,0,0,0.15)" }}>
                        <div className="container-sm" style={{ maxWidth: 680 }}>

                            {/* Score */}
                            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                                <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 120, height: 120, borderRadius: "50%", border: `3px solid ${scoreColor}`, boxShadow: `0 0 30px ${scoreColor}30`, marginBottom: "0.75rem" }}>
                                    <span style={{ fontSize: "2.2rem", fontWeight: 900, color: scoreColor }}>{result.score}%</span>
                                    <span style={{ fontSize: "0.6rem", color: "rgba(248,248,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Match</span>
                                </div>
                                <h2 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.3rem" }}>
                                    {result.score >= 85 ? "Match extraordinario" : result.score >= 70 ? "Alta compatibilidad" : result.score >= 55 ? "Compatibilidad media" : "Relación de aprendizaje profundo"}
                                </h2>
                                <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>{result.summary}</p>
                            </div>

                            {/* Dimensions */}
                            {Object.keys(result.dimensions).length > 0 && (
                                <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
                                    <p style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(248,248,255,0.25)", marginBottom: "0.85rem" }}>5 dimensiones de compatibilidad</p>
                                    {Object.entries(result.dimensions).map(([key, val]) => (
                                        <div key={key} style={{ marginBottom: "0.6rem" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                                                <span style={{ fontSize: "0.76rem", color: "rgba(248,248,255,0.55)" }}>{key}</span>
                                                <span style={{ fontSize: "0.76rem", fontWeight: 700, color: Number(val) >= 80 ? "#22C55E" : Number(val) >= 65 ? "#F59E0B" : "#EF4444" }}>{Math.round(Number(val))}%</span>
                                            </div>
                                            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                                                <div style={{ width: `${Math.min(100, Number(val))}%`, height: "100%", background: `linear-gradient(90deg, #7C3AED, ${Number(val) >= 80 ? "#22C55E" : "#EC4899"})`, borderRadius: 2, transition: "width 1s ease" }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Archetypes + dynamic */}
                            <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1rem", borderColor: "rgba(236,72,153,0.2)" }}>
                                <p style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#EC4899", marginBottom: "0.75rem" }}>Dinámica de pareja</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.75rem" }}>
                                    <div style={{ textAlign: "center", padding: "0.75rem", background: "rgba(124,58,237,0.06)", borderRadius: "0.6rem" }}>
                                        <p style={{ fontSize: "0.65rem", color: "rgba(248,248,255,0.2)", marginBottom: "0.2rem" }}>{p1.name || "Persona 1"}</p>
                                        <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#A78BFA" }}>{result.archetypes.person1}</p>
                                    </div>
                                    <div style={{ textAlign: "center", padding: "0.75rem", background: "rgba(236,72,153,0.06)", borderRadius: "0.6rem" }}>
                                        <p style={{ fontSize: "0.65rem", color: "rgba(248,248,255,0.2)", marginBottom: "0.2rem" }}>{p2.name || "Persona 2"}</p>
                                        <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#EC4899" }}>{result.archetypes.person2}</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.7, fontStyle: "italic" }}>"{result.archetypes.dynamic}"</p>
                            </div>

                            {/* Strengths / Challenges */}
                            {(result.strengths.length > 0 || result.challenges.length > 0) && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1rem" }}>
                                    <div className="glass-card" style={{ padding: "1rem", borderColor: "rgba(34,197,94,0.15)" }}>
                                        <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "#22C55E", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>✦ Fortalezas</p>
                                        {result.strengths.map((s, i) => <p key={i} style={{ fontSize: "0.74rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.6, marginBottom: "0.25rem" }}>· {s}</p>)}
                                    </div>
                                    <div className="glass-card" style={{ padding: "1rem" }}>
                                        <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "rgba(248,248,255,0.2)", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>⚠️ Desafíos</p>
                                        {result.challenges.map((c, i) => <p key={i} style={{ fontSize: "0.74rem", color: "rgba(248,248,255,0.35)", lineHeight: 1.6, marginBottom: "0.25rem" }}>· {c}</p>)}
                                    </div>
                                </div>
                            )}

                            {/* Long term */}
                            <div style={{ padding: "0.85rem 1rem", background: "rgba(124,58,237,0.06)", borderRadius: "0.6rem", border: "1px solid rgba(124,58,237,0.15)", marginBottom: "1rem" }}>
                                <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "#7C3AED", marginBottom: "0.25rem", letterSpacing: "0.1em" }}>Perspectiva a largo plazo</p>
                                <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.55)", lineHeight: 1.7 }}>{result.longterm}</p>
                            </div>

                            {/* GATE */}
                            {!showGate ? (
                                <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", borderColor: "rgba(236,72,153,0.2)" }}>
                                    <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>🔒 Informe de compatibilidad profundo</p>
                                    <p style={{ fontSize: "0.73rem", color: "rgba(248,248,255,0.35)", marginBottom: "0.85rem", lineHeight: 1.6 }}>
                                        Análisis de aspectos planetarios entre vuestras cartas, karmas compartidos, casa de pareja activada, y ciclos de expansión/crisis de la relación.
                                    </p>
                                    <button className="btn-gold" style={{ fontSize: "0.8rem", fontWeight: 700 }} onClick={() => { setShowGate(true); track.gateHit("match_astral"); }}>
                                        Ver informe completo →
                                    </button>
                                </div>
                            ) : (
                                <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", borderColor: "rgba(236,72,153,0.35)" }}>
                                    <a href="/precios" className="btn-gold" style={{ fontWeight: 700, textDecoration: "none", display: "inline-block", padding: "0.65rem 1.75rem" }}
                                        onClick={() => track.upgradeClick("match_astral", "esencial")}>
                                        Activar Plan Esencial → Informe Completo
                                    </a>
                                </div>
                            )}

                            {/* Share */}
                            <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center", marginTop: "1rem", flexWrap: "wrap" }}>
                                <button onClick={() => { track.shareWhatsApp("match_astral"); window.open(`https://wa.me/?text=${encodeURIComponent(`Mi match astral es ${result.score}% 💫\n${result.summary}\n\n¿Cuál es el tuyo? → crystal-cosmos.vercel.app/match-astral-por-carta-natal`)}`, "_blank"); }}
                                    style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                                    💬 Compartir resultado
                                </button>
                                <button onClick={() => { setResult(null); setP1(emptyForm()); setP2(emptyForm()); }}
                                    style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(248,248,255,0.3)", fontSize: "0.78rem", cursor: "pointer" }}>
                                    Nueva pareja
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* INFO */}
                <section className="section-pad">
                    <div className="container-sm" style={{ maxWidth: 680, textAlign: "center" }}>
                        <h2 className="font-display" style={{ fontSize: "clamp(1.2rem,2vw,1.5rem)", fontWeight: 700, marginBottom: "1.25rem" }}>Más allá del "somos compatibles"</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "0.65rem" }}>
                            {[
                                { e: "☀️", t: "Signo Solar", d: "Tu esencia, tu identidad central, lo que proyectas" },
                                { e: "🌙", t: "Signo Lunar", d: "Tu mundo emocional, tus necesidades íntimas" },
                                { e: "↑", t: "Ascendente", d: "Cómo te perciben y cómo percibes al mundo" },
                            ].map(c => (
                                <div key={c.t} className="glass-card" style={{ padding: "1rem", textAlign: "left" }}>
                                    <p style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>{c.e}</p>
                                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#A78BFA", marginBottom: "0.2rem" }}>{c.t}</p>
                                    <p style={{ fontSize: "0.73rem", color: "rgba(248,248,255,0.3)", lineHeight: 1.6 }}>{c.d}</p>
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
