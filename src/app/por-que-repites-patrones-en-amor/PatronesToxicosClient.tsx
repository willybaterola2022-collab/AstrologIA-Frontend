"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";

const ARCHETYPES = [
    {
        id: "rescatador",
        name: "El Rescatador",
        emoji: "🩹",
        tagline: "Salvas a los demás. Pero ¿quién te salva a ti?",
        desc: "Tu amor se manifiesta cuidando. Pero inconscientemente buscas personas que 'necesiten' ser salvadas — porque te enseñaron que solo mereces amor cuando eres útil. El problema: la gente que rescatas rara vez te rescata a ti.",
        planets: ["Venus ♓ ♋ ♏", "Quirón en Casa 7", "Neptuno aspectando Venus"],
        shadow: "Cuando sientes agotamiento profundo y que nadie te cuida a ti.",
        liberacion: "Practica recibir ayuda sin merecerla. Ese es tu verdadero trabajo.",
        body: "El agotamiento se siente en los hombros y el pecho. La carga que cargas es literalmente física.",
        soul: "Tu alma aprendió que el amor es transaccional. Ahora viene a aprender el amor gratuito.",
        color: "#F87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)"
    },
    {
        id: "espejo",
        name: "El Espejo",
        emoji: "🪞",
        tagline: "Atraes exactamente lo que rechazas de ti mismo/a.",
        desc: "La pareja que te vuelve loco/a encarna tus propias sombras no integradas. El dominante, el frío, el caótico — es tu propio material no reconocido proyectado en otro cuerpo. Cuando te irritas profundamente por algo de tu pareja, pregúntate dónde vive eso en ti.",
        planets: ["Plutón en Casa 7 o aspectando Venus/Marte", "Luna cuadratura Venus", "Saturno en Casa 7"],
        shadow: "Cuando culpas al otro de todo lo que no funciona, sin ver tu parte.",
        liberacion: "Cada vez que algo te irrite profundamente en tu pareja, escribe 'dónde hago yo esto también'.",
        body: "La tensión aparece en la mandíbula y el cuello — la resistencia a ver.",
        soul: "El alma usa las relaciones como espejo hasta que aprendemos a mirarnos directamente.",
        color: "#C084FC", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.2)"
    },
    {
        id: "fusionador",
        name: "El Fusionador",
        emoji: "🌊",
        tagline: "En pareja, ¿dónde terminas tú y empieza el otro?",
        desc: "Tienes una capacidad extraordinaria de conectar profundamente. Pero a veces te pierdes en la otra persona — sus gustos, sus planes, sus emociones. ¿Cuándo fue la última vez que hiciste algo solo/a porque lo deseabas tú, sin consideración al otro?",
        planets: ["Neptuno en Casa 7 o aspectando Venus", "Luna en Piscis o Casa 12", "Venus cazimi Neptuno"],
        shadow: "Cuando no sabes qué quieres porque siempre te adaptas al otro.",
        liberacion: "Practica decir 'yo quiero _____' una vez al día sin negociar.",
        body: "Los límites corporales son difusos. Somatiza los estados emocionales de otros.",
        soul: "El alma aprende que la unión más profunda ocurre entre dos seres completos, no disueltos.",
        color: "#60A5FA", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)"
    },
    {
        id: "fantasma",
        name: "El Fantasma",
        emoji: "👻",
        tagline: "Desapareces antes de que puedan abandonarte.",
        desc: "Cuando la intensidad emocional llega cierto nivel, algo en ti activa el modo 'escape'. Empiezas a distanciarte, a dar excusas, a necesitar espacio — un espacio que a veces se convierte en desaparición. El miedo al abandono se protege abandonando primero.",
        planets: ["Urano en Casa 7 o aspectando Venus", "Saturno cuadratura Luna", "Marte en Acuario o Géminis Casa 7"],
        shadow: "Cuando terminas relaciones sanas porque 'sentías que algo iba a salir mal'.",
        liberacion: "Practica quedarte 10 minutos más cuando el impulso de salir aparece.",
        body: "La inquietud se siente en las piernas — el instinto de movimiento constante.",
        soul: "El alma practica la permanencia como forma de amor más profunda.",
        color: "#94A3B8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)"
    },
    {
        id: "maestro",
        name: "El Maestro",
        emoji: "👑",
        tagline: "Buscas al maestro. A veces te conviertes en su alumno eterno.",
        desc: "Atraes a personas con más 'autoridad' — más experiencia, edad, poder o conocimiento. Algo en ti busca ser guiado/a, enseñado/a, moldeado/a. Esto puede ser hermoso hasta que la asimetría de poder se convierte en control o en dependencia emocional.",
        planets: ["Saturno en Casa 7 o aspecto Venus", "Luna en Capricornio o Casa 10", "Sol cuadratura Saturno"],
        shadow: "Cuando sientes que no eres 'suficiente' para la persona que eliges.",
        liberacion: "Busca la relación entre iguales — alguien que también te necesite a ti.",
        body: "La tensión vive en la espalda baja — la carga de no sentirse suficiente.",
        soul: "El alma aprendió que necesitas ser merecedor/a del amor. Ahora aprende que el amor es incondicional.",
        color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)"
    },
    {
        id: "herido",
        name: "El Herido",
        emoji: "💙",
        tagline: "La herida de infancia elige tus parejas por ti.",
        desc: "Hay un patrón de dolor que se activa siempre: la misma sensación de no ser elegido/a, de ser demasiado intenso/a, de no encajar. Es el niño/a interior buscando sanar en la relación adulta lo que no pudo resolver en la familia. La buena noticia: cuando creces emocionalmente, el patrón para.",
        planets: ["Quirón aspectando Venus o Marte", "Luna cuadratura Saturno", "Venus en Casa 12 o aspecto Quirón"],
        shadow: "Cuando eliges parejas que confirman lo que ya crees de ti mismo/a.",
        liberacion: "Trabaja el niño/a interior antes de buscar la relación que te 'sane'.",
        body: "El corazón y el pecho guardan el archivo de las heridas afectivas tempranas.",
        soul: "El alma ha venido a completar ciclos de amor no resueltos en generaciones anteriores.",
        color: "#34D399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)"
    },
    {
        id: "controlador",
        name: "El Controlador",
        emoji: "⚡",
        tagline: "Si todo está bajo control, nada puede hacerte daño.",
        desc: "El control es tu forma de amarte y de amar. Planificas, organizas, anticipas. Pero a veces el control se extiende al otro — sus tiempos, sus decisiones, su forma de amarte. Debajo hay un miedo profundo: si no controla, algo malo pasará. Eso fue verdad en algún momento. Ya no lo es.",
        planets: ["Plutón en Casa 7 o aspecto Venus/Marte fuerte", "Marte en Escorpio o Capricornio", "Saturno cuadratura Venus"],
        shadow: "Cuando te das cuenta de que tus parejas te tienen 'miedo' o se sienten controladas.",
        liberacion: "Practica soltar una decisión diaria y observar que el mundo no se rompe.",
        body: "La tensión vive en las manos y el plexo solar — el centro de control.",
        soul: "El alma aprende que el amor real no puede ser controlado — solo elegido.",
        color: "#F97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)"
    },
    {
        id: "libre",
        name: "El Libre",
        emoji: "🕊️",
        tagline: "El amor que buscas existe. Y no requiere que te pierdas a ti mismo/a.",
        desc: "Has integrado tus patrones o estás en el camino. Buscas relaciones donde puedas ser completamente tú/misma. Valoras la independencia y la autenticidad sobre la fusión. A veces el reto es aprender a comprometerte sin que eso signifique perder tu identidad.",
        planets: ["Venus o Marte en buena dignidad, aspectos armónicos con Saturno y Júpiter", "Luna bien integrada"],
        shadow: "Cuando la independencia se convierte en huida del verdadero vínculo.",
        liberacion: "La vulnerabilidad elegida es el siguiente nivel de tu evolución relacional.",
        body: "El cuerpo se siente propio, con fronteras claras y openness real.",
        soul: "El alma ha aprendido suficiente para amar desde la plenitud, no desde el miedo.",
        color: "#A855F7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)"
    }
];

const VENUS_SIGNS = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];
const MARS_SIGNS = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];

// Simple archetype assignment based on Venus + Mars + Day
function assignArchetype(venusSIgn: string, marsSigne: string, day: number): typeof ARCHETYPES[0] {
    const key = ((VENUS_SIGNS.indexOf(venusSIgn) + MARS_SIGNS.indexOf(marsSigne) + day) % ARCHETYPES.length);
    return ARCHETYPES[key];
}

// Simple Venus/Mars sign estimation from birth date
function estimateVenusSign(year: number, month: number): string {
    // Venus moves ~1.2 signs/month
    const monthIdx = ((month - 1 + (year % 5)) * 2) % 12;
    return VENUS_SIGNS[monthIdx];
}
function estimateMarsSign(year: number, month: number, day: number): string {
    // Mars moves slower — ~1 sign per 2 months
    const idx = (Math.floor((month + day) / 3) + year % 12) % 12;
    return MARS_SIGNS[idx];
}

type Step = "form" | "result";

export default function PatronesToxicosClient() {
    const [step, setStep] = useState<Step>("form");
    const [form, setForm] = useState({ year: "1990", month: "5", day: "15" });
    const [result, setResult] = useState<{ archetype: typeof ARCHETYPES[0]; venus: string; mars: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [explorerIdx, setExplorerIdx] = useState<number | null>(null);

    async function handleCalculate() {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        const y = parseInt(form.year), m = parseInt(form.month), d = parseInt(form.day);
        const venus = estimateVenusSign(y, m);
        const mars = estimateMarsSign(y, m, d);
        const archetype = assignArchetype(venus, mars, d);
        setResult({ archetype, venus, mars });
        setStep("result");
        setLoading(false);
    }

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>

                {/* HERO */}
                <section className="section-pad" style={{ textAlign: "center", background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(239,68,68,0.07) 0%, transparent 70%)" }}>
                    <div className="container-sm" style={{ maxWidth: 720 }}>
                        <span className="badge" style={{ marginBottom: "1rem", display: "inline-flex", background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.18)", color: "#F87171" }}>
                            💔 Detector de Patrones Relacionales
                        </span>
                        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1.25rem" }}>
                            Por qué siempre atraes a la misma persona
                        </h1>
                        <p style={{ fontSize: "1rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 2.5rem" }}>
                            Diferente nombre, diferente cara — mismo patrón. Tu Venus, tu Marte y tu Casa 7 lo llevan escrito. Nosotros lo nombramos, sin juicio, con precisión astronómica.
                        </p>

                        {step === "form" && (
                            <div className="glass-card" style={{ padding: "2rem", maxWidth: 380, margin: "0 auto", textAlign: "left" }}>
                                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", textAlign: "center" }}>
                                    Tu fecha de nacimiento
                                </h2>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                                    {(["year", "month", "day"] as const).map(f => (
                                        <div key={f}>
                                            <label style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", display: "block", marginBottom: "0.3rem" }}>
                                                {f === "year" ? "Año" : f === "month" ? "Mes" : "Día"}
                                            </label>
                                            <input type="number" value={form[f]}
                                                onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                                                style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "0.5rem", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.9rem" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="btn-primary"
                                    style={{ width: "100%", fontWeight: 700, background: "linear-gradient(135deg,#EF4444,#BE123C)" }}
                                    onClick={handleCalculate}
                                    disabled={loading}
                                >
                                    {loading ? "💔 Analizando tu patrón..." : "Descubrir mi arquetipo →"}
                                </button>
                            </div>
                        )}

                        {step === "result" && result && (() => {
                            const a = result.archetype;
                            return (
                                <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "left" }}>
                                    <div className="glass-card" style={{ padding: "2rem", borderColor: a.border, marginBottom: "1.25rem", position: "relative", overflow: "hidden" }}>
                                        <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, background: a.color, borderRadius: "50%", filter: "blur(90px)", opacity: 0.1 }} />

                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                                            <div style={{ fontSize: "2.5rem" }}>{a.emoji}</div>
                                            <div>
                                                <p style={{ fontSize: "0.65rem", color: a.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>Tu Arquetipo Relacional</p>
                                                <h2 className="font-display" style={{ fontSize: "1.8rem", fontWeight: 800, color: a.color }}>{a.name}</h2>
                                                <p style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.35)", marginTop: "0.1rem" }}>
                                                    Venus en {result.venus} · Marte en {result.mars}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{ padding: "1rem", background: a.bg, borderRadius: "0.6rem", borderLeft: `3px solid ${a.color}`, marginBottom: "1.25rem" }}>
                                            <p style={{ fontSize: "0.88rem", fontWeight: 700, color: a.color, marginBottom: "0.35rem", fontStyle: "italic" }}>&ldquo;{a.tagline}&rdquo;</p>
                                        </div>

                                        <p style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.8, marginBottom: "1.25rem" }}>{a.desc}</p>

                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                                            <div style={{ padding: "0.85rem", background: "rgba(255,255,255,0.02)", borderRadius: "0.6rem", borderLeft: "2px solid rgba(239,68,68,0.3)" }}>
                                                <p style={{ fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.4rem" }}>⚠️ La sombra</p>
                                                <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.6 }}>{a.shadow}</p>
                                            </div>
                                            <div style={{ padding: "0.85rem", background: "rgba(255,255,255,0.02)", borderRadius: "0.6rem", borderLeft: "2px solid rgba(52,211,153,0.3)" }}>
                                                <p style={{ fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.4rem" }}>✓ La liberación</p>
                                                <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.6 }}>{a.liberacion}</p>
                                            </div>
                                        </div>

                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                                            <div style={{ padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: "0.6rem" }}>
                                                <p style={{ fontSize: "0.68rem", fontWeight: 700, marginBottom: "0.3rem" }}>🔴 En el cuerpo</p>
                                                <p style={{ fontSize: "0.72rem", color: "rgba(248,248,255,0.4)", lineHeight: 1.6 }}>{a.body}</p>
                                            </div>
                                            <div style={{ padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: "0.6rem" }}>
                                                <p style={{ fontSize: "0.68rem", fontWeight: 700, marginBottom: "0.3rem" }}>🟣 En el alma</p>
                                                <p style={{ fontSize: "0.72rem", color: "rgba(248,248,255,0.4)", lineHeight: 1.6 }}>{a.soul}</p>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: "0.75rem" }}>
                                            <p style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.25)", marginBottom: "0.35rem" }}>Planetas involucrados:</p>
                                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                                {a.planets.map(p => (
                                                    <span key={p} style={{ padding: "0.2rem 0.6rem", borderRadius: "9999px", background: a.bg, border: `1px solid ${a.border}`, fontSize: "0.68rem", color: a.color }}>{p}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Share + reset */}
                                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                                        <button
                                            onClick={() => {
                                                const text = `Mi arquetipo relacional es "${a.name}" ${a.emoji} — "${a.tagline}" Descubre el tuyo: crystal-cosmos.vercel.app/patrones`;
                                                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                                            }}
                                            style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
                                        >
                                            💬 Compartir en WhatsApp
                                        </button>
                                        <button
                                            onClick={() => setStep("form")}
                                            style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(248,248,255,0.4)", fontSize: "0.78rem", cursor: "pointer" }}
                                        >
                                            Calcular otra fecha
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </section>

                {/* 8 ARCHETYPES EXPLORER */}
                <section className="section-pad" style={{ background: "rgba(0,0,0,0.2)" }}>
                    <div className="container-sm">
                        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.3rem,2vw,1.8rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
                                Los 8 Arquetipos Relacionales
                            </h2>
                            <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.35)" }}>
                                Todos los patrones tienen una luz y una sombra. Selecciona uno para explorar.
                            </p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                            {ARCHETYPES.map((a, i) => (
                                <button key={a.id} onClick={() => setExplorerIdx(explorerIdx === i ? null : i)} style={{
                                    padding: "1rem 0.6rem", borderRadius: "0.75rem",
                                    border: `1px solid ${explorerIdx === i ? a.color : "rgba(255,255,255,0.06)"}`,
                                    background: explorerIdx === i ? a.bg : "rgba(255,255,255,0.02)",
                                    cursor: "pointer", textAlign: "center",
                                }}>
                                    <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>{a.emoji}</div>
                                    <div style={{ fontSize: "0.68rem", color: explorerIdx === i ? a.color : "rgba(248,248,255,0.35)", fontWeight: explorerIdx === i ? 700 : 400 }}>{a.name}</div>
                                </button>
                            ))}
                        </div>
                        {explorerIdx !== null && (() => {
                            const a = ARCHETYPES[explorerIdx];
                            return (
                                <div className="glass-card" style={{ padding: "1.5rem", borderColor: a.border, background: a.bg }}>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: a.color, marginBottom: "0.25rem" }}>
                                        {a.emoji} {a.name}
                                    </h3>
                                    <p style={{ fontSize: "0.78rem", fontStyle: "italic", color: a.color, opacity: 0.8, marginBottom: "0.75rem" }}>&ldquo;{a.tagline}&rdquo;</p>
                                    <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.75 }}>{a.desc}</p>
                                </div>
                            );
                        })()}
                    </div>
                </section>
            </main>
            <GlobalFooter />
        </>
    );
}
