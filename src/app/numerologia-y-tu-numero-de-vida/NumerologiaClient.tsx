"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";
import { track, initScrollTracker } from "@/lib/analytics";

// ══════════════════════════════════════════════════════════
// NUMEROLOGÍA PITAGÓRICA — Módulo completo
// URL: /numerologia-y-tu-numero-de-vida
// Calcula: Número de Vida, Año Personal, Número de Expresión (nombre)
// SEO: numerología, número de la suerte, fecha de nacimiento significado
// ══════════════════════════════════════════════════════════

const LIFE_NUMBERS: Record<number, {
    name: string; emoji: string; color: string;
    tagline: string; body: string;
    strengths: string[]; challenges: string[];
    purpose: string; famous: string[];
    affirmation: string;
}> = {
    1: {
        name: "El Iniciador", emoji: "🔥", color: "#EF4444",
        tagline: "Naciste para liderar lo que todavía no existe",
        body: "El número 1 es la chispa original — la fuerza que rompe la inercia y da inicio a lo que antes era solo posibilidad. Tu misión en esta vida tiene que ver con la independencia, el liderazgo y la originalidad. Cuando navegas en tu frecuencia más alta, te conviertes en el que abre puertas para que otros puedan pasar. Tu energia es directa, pionera y a veces incómoda — porque la verdad del 1 es que viene antes que todo.",
        strengths: ["Liderazgo natural", "Independencia", "Valentía para iniciar", "Originalidad"],
        challenges: ["Impaciencia", "Dificultad para delegar", "Ego cuando está en sombra"],
        purpose: "Ser el primero en cruzar un umbral que libera a los que vienen detrás.",
        famous: ["Martin Luther King (1+5+1+5+1+9+2+8 = 32 → 5... estudio de correlaciones)"],
        affirmation: "Soy el origen de lo que necesita nacer."
    },
    2: {
        name: "El Diplomático", emoji: "🌙", color: "#8B5CF6",
        tagline: "Tu sensibilidad es el instrumento más preciso que existe",
        body: "El número 2 es la inteligencia de la relación. Donde el 1 actúa solo, el 2 actúa en pareja — porque entiende que la realidad se construye entre dos perspectivas. Tu sensibilidad no es fragilidad: es un sensor extraordinariamente calibrado para detectar lo que otros pasan por alto. Tu trabajo es aprender a confiar en ese sensor como fuente de verdad, no como vulnerabilidad.",
        strengths: ["Empatía profunda", "Mediación natural", "Intuición relacional", "Paciencia"],
        challenges: ["Dificultad para establecer límites", "Codependencia", "Postergación de propias necesidades"],
        purpose: "Ser el puente que permite que dos mundos se entiendan sin perder ninguno.",
        famous: ["Diana de Gales", "Barack Obama (algunos cálculos)"],
        affirmation: "Mi sensibilidad es mi poder — no mi debilidad."
    },
    3: {
        name: "El Creativo", emoji: "✨", color: "#F59E0B",
        tagline: "El universo se expresa a través de ti — si dejas que fluya",
        body: "El número 3 es la frecuencia de la creación consciente. Con el impulso del 1 y la relación del 2, el 3 produce algo nuevo — algo que antes no existía. Tu misión tiene que ver con la expresión: con encontrar la forma en que lo que vive dentro de ti pueda ser visto, escuchado o sentido por los demás. El peligro es dispersarte en demasiados canales antes de profundizar en ninguno.",
        strengths: ["Creatividad desbordante", "Comunicación magnética", "Optimismo contagioso", "Talento artístico"],
        challenges: ["Dispersión", "Superficialidad cuando el foco no está", "Tendencia a compararse"],
        purpose: "Dar forma visible a lo que todos sienten pero nadie sabe cómo expresar.",
        famous: ["David Bowie (algunos cálculos)", "Taylor Swift"],
        affirmation: "Soy un canal para la belleza que el mundo necesita ver."
    },
    4: {
        name: "El Constructor", emoji: "🏛️", color: "#22C55E",
        tagline: "Lo que construyes hoy es la base que sostiene el mañana",
        body: "El número 4 es la frecuencia de la estructura, la disciplina y el trabajo. No hay atajo para el 4 — y en eso está su mayor fortaleza. Lo que el 4 construye dura porque está bien cimentado. Donde otros improvisan, el 4 planifica. Tu trabajo en esta vida es aprender que la disciplina no es restricción — es libertad construida ladrillo a ladrillo.",
        strengths: ["Disciplina excepcional", "Capacidad de construcción sostenida", "Confiabilidad", "Pensamiento práctico"],
        challenges: ["Rigidez cuando el plan falla", "Resistencia al cambio", "Exceso de trabajo como forma de control"],
        purpose: "Construir las estructuras que permiten que otros crezcan con seguridad.",
        famous: ["Arnold Schwarzenegger", "Oprah Winfrey (algunos cálculos)"],
        affirmation: "Mi consistencia es mi legado."
    },
    5: {
        name: "El Aventurero", emoji: "🌎", color: "#06B6D4",
        tagline: "Tu libertad es el regalo que ofreces al mundo",
        body: "El número 5 es expansión pura. Libertad, movimiento, experiencia, transformación. El 5 necesita variedad no por capricho sino porque su aprendizaje ocurre a través del cambio. Cada vez que el 5 sale de su zona de confort, regresa con algo que nadie más tiene. Tu misión es saber cuándo profundizar en lugar de solo expandirse.",
        strengths: ["Adaptabilidad", "Curiosidad insaciable", "Capacidad para reinventarse", "Magnetismo natural"],
        challenges: ["Inconstancia", "Adicción a la novedad", "Dificultad para comprometerse"],
        purpose: "Demostrar que la vida es más grande de lo que todos creen.",
        famous: ["Mick Jagger", "Abraham Lincoln (algunos cálculos)"],
        affirmation: "Mi libertad abre puertas que otros no sabían que existían."
    },
    6: {
        name: "El Sanador", emoji: "💚", color: "#10B981",
        tagline: "Tu amor tiene el poder de transformar lo que tocas",
        body: "El número 6 es el arquetipo del cuidado, la responsabilidad y el amor que se materializa en acciones concretas. Tu sensibilidad hacia los demás es extraordinaria — percibes lo que necesitan antes de que puedan pedirlo. Tu misión es aprender que cuidar no significa sacrificarte, y que el mejor servicio que puedes dar comienza por honrar tu propio bienestar.",
        strengths: ["Capacidad de cuidado profundo", "Sentido de la justicia", "Belleza y armonía", "Responsabilidad"],
        challenges: ["Martirio encubierto", "Dificultad para recibir", "Perfeccionismo en el hogar"],
        purpose: "Crear los espacios donde otros pueden sanar y florecer.",
        famous: ["John Lennon", "Michael Jackson (algunos cálculos)"],
        affirmation: "Me cuido primero para poder cuidar desde un lugar de plenitud."
    },
    7: {
        name: "El Místico", emoji: "🔮", color: "#7C3AED",
        tagline: "Viniste a saber lo que otros no pueden ver",
        body: "El número 7 es la frecuencia del conocimiento profundo, la introspección y la conexión con lo invisible. El 7 no se conforma con las respuestas superficiales — necesita ir a la raíz, al origen, a la esencia. Tu misión es integrar el mundo interior con el exterior, sin quedarte atrapado en ninguno de los dos. La soledad del 7 no es castigo — es laboratorio.",
        strengths: ["Inteligencia analítica y espiritual simultánea", "Capacidad de investigación", "Intuición desarrollada", "Profundidad"],
        challenges: ["Aislamiento", "Desconfianza en los demás", "Perfeccionismo intelectual"],
        purpose: "Traer comprensión desde las profundidades a las que nadie más desciende.",
        famous: ["Carl Jung", "Nikola Tesla", "Bruce Lee"],
        affirmation: "Mi profundidad es una contribución, no un defecto."
    },
    8: {
        name: "El Poder", emoji: "💎", color: "#F97316",
        tagline: "Aquí para dominar la materia — y usarla al servicio de algo mayor",
        body: "El número 8 es la frecuencia del poder, el liderazgo material y la capacidad de manifestar abundancia. No es accidente que el 8 acostado sea el símbolo del infinito — porque la misión del 8 es demostrar que el poder espiritual y el material no están separados. Tu trabajo es aprender a ejercer el poder sin ego y a construir riqueza sin perder el alma.",
        strengths: ["Visión de negocios", "Autoridad natural", "Determinación", "Capacidad de manifestar"],
        challenges: ["Control excesivo", "Materialismo cuando el 8 opera desde el miedo", "Todo o nada"],
        purpose: "Demostrar que el poder real sirve a algo más grande que uno mismo.",
        famous: ["Pablo Picasso", "Nelson Mandela (algunos cálculos)"],
        affirmation: "El poder que tengo está al servicio de algo más grande."
    },
    9: {
        name: "El Completador", emoji: "🌊", color: "#3B82F6",
        tagline: "Viniste a completar lo que otros iniciaron — y a soltar lo que ya cumplió su ciclo",
        body: "El número 9 contiene a todos los anteriores y a la vez los trasciende. Es la frecuencia del cierre, la compasión universal y el servicio desinteresado. El mayor reto del 9 es aprender a soltar — personas, proyectos, identidades — no por pérdida sino por completud. Tu servicio más elevado no es personal: es a la humanidad en su conjunto.",
        strengths: ["Compasión universal", "Capacidad de ver el panorama completo", "Magnetismo espiritual", "Creatividad"],
        challenges: ["Dificultad para soltar el pasado", "Tendencia al martirio", "Dispersión por querer ayudar a todos"],
        purpose: "Demostrar que la compasión sin límites puede coexistir con la sabiduría.",
        famous: ["Mahatma Gandhi", "Madre Teresa", "Jimi Hendrix"],
        affirmation: "Suelto lo que ya cumplió su propósito y confío en lo que viene."
    },
    11: {
        name: "El Maestro Iluminador", emoji: "⚡", color: "#EC4899",
        tagline: "Número maestro — viniste a iluminar lo que otros no pueden ver aún",
        body: "El 11 es un número maestro — no se reduce a 2 porque su frecuencia opera en un plano superior. Tienes acceso a percepciones, intuiciones e inspiraciones que la mayoría no puede procesar. Tu misión es aprender a encarnar esa frecuencia alta sin quemarte — sin el voltaje del 11 no se pueden encender luces, pero tampoco se puede sostener sin un circuito adecuado. Tu cuerpo y tus límites son el circuito.",
        strengths: ["Intuición extraordinaria", "Capacidad de inspirar", "Visión espiritual", "Sensibilidad extrema"],
        challenges: ["Ansiedad de alto voltaje", "Dificultad para aterrizar las visiones", "Absorción emocional"],
        purpose: "Ser un canal de luz consciente — no una antena que se quema por exceso de señal.",
        famous: ["Barack Obama", "Bill Clinton", "Grigori Rasputin"],
        affirmation: "Soy un canal, no la fuente — la luz pasa a través de mí con gracia."
    },
    22: {
        name: "El Maestro Constructor", emoji: "🏗️", color: "#84CC16",
        tagline: "Número maestro — viniste a construir algo que trasciende generaciones",
        body: "El 22 es el número maestro de la manifestación — el más poderoso del sistema pitagórico. Tienes la visión del 11 y la capacidad constructiva del 4 multiplicada. Tu misión es aterrizar lo grande, lo épico, lo generacional en estructuras concretas que los demás puedan habitar. El mayor obstáculo del 22 es la grandiosidad que paraliza — o la modestia excesiva que ignora el alcance real.",
        strengths: ["Visión global + capacidad de ejecución", "Liderazgo transformador", "Pensamiento sistémico", "Magnetismo"],
        challenges: ["Presión aplastante de la misión", "Perfeccionismo extremo", "Aislamiento por la magnitud del proyecto"],
        purpose: "Construir la infraestructura que transforma la vida de millones.",
        famous: ["Bill Gates", "Leonardo da Vinci (algunos cálculos)", "Dalai Lama"],
        affirmation: "Lo que construyo hoy ya pertenece al futuro."
    },
    33: {
        name: "El Maestro Sanador", emoji: "💜", color: "#D946EF",
        tagline: "Número maestro — el amor más puro como eje de toda tu vida",
        body: "El 33 es el número maestro del amor sin condiciones — raro, exigente, transformador. Pocos seres encarnan este número en su totalidad. El 33 es el que ama sin retener, sirve sin esperar, cura sin necesitar ser curado. Tu misión trasciende lo personal — tu servicio es a la conciencia colectiva. El mayor riesgo es el agotamiento por servicio sin límites.",
        strengths: ["Amor incondicional genuino", "Capacidad de sanar con la presencia", "Compasión sin límites"],
        challenges: ["Agotamiento del cuidador", "Dificultad para recibir", "Culpa cuando no puede 'salvar' a otros"],
        purpose: "Encarnar el amor como frecuencia universal — no como sentimiento.",
        famous: ["Francis de Asís", "Madre Teresa (algunos cálculos)"],
        affirmation: "El amor que soy no necesita esfuerzo para irradiarse."
    },
};

// ─── Algorithms ──────────────────────────────────────────────────────────────
function reduceToSingle(n: number): number {
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
        n = String(n).split("").reduce((a, d) => a + parseInt(d), 0);
    }
    return n;
}

function calcLifeNumber(dateStr: string): number {
    const [y, m, d] = dateStr.split("-").map(Number);
    const sum = y + m + d;
    return reduceToSingle(sum);
}

function calcPersonalYear(birthDate: string, year: number = new Date().getFullYear()): number {
    const [, m, d] = birthDate.split("-").map(Number);
    return reduceToSingle(year + m + d);
}

function calcNameNumber(name: string): number {
    const MAP: Record<string, number> = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
        j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
        s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
        á: 1, é: 5, í: 9, ó: 6, ú: 3, ü: 3, ñ: 5,
    };
    const total = name.toLowerCase().replace(/[^a-záéíóúüñ]/g, "")
        .split("").reduce((s, c) => s + (MAP[c] || 0), 0);
    return reduceToSingle(total);
}

const PERSONAL_YEAR_TAGS: Record<number, string> = {
    1: "Año de inicios — planta semillas nuevas",
    2: "Año de relaciones — coopera, paciencia",
    3: "Año creativo — exprésate, crea, comunica",
    4: "Año de trabajo — construye la base",
    5: "Año de cambio — soltar, aventurar",
    6: "Año de responsabilidad — hogar, familia",
    7: "Año interior — retiro, estudio, profundidad",
    8: "Año de cosecha — resultados del esfuerzo",
    9: "Año de cierre — soltar lo que ya no sirve",
    11: "Año de iluminación — grandes revelaciones",
    22: "Año de manifestación — construye lo grande",
    33: "Año del servicio — da sin esperar",
};

export default function NumerologiaClient() {
    const [birthDate, setBirthDate] = useState("");
    const [name, setName] = useState("");
    const [result, setResult] = useState<{ life: number; personal: number; expression: number } | null>(null);
    const [activeTab, setActiveTab] = useState<"life" | "personal" | "expression">("life");
    const [showGate, setShowGate] = useState(false);

    useEffect(() => {
        track.moduleEnter("numerologia");
        const cleanup = initScrollTracker("numerologia");
        return cleanup;
    }, []);

    function calculate() {
        if (!birthDate) return;
        const life = calcLifeNumber(birthDate);
        const personal = calcPersonalYear(birthDate);
        const expression = name ? calcNameNumber(name) : 0;
        setResult({ life, personal, expression });
        track.calculateClick("numerologia", name ? "with_name" : "date_only");
    }

    const numData = result ? LIFE_NUMBERS[result.life] : null;
    const persData = result ? LIFE_NUMBERS[result.personal] : null;
    const exprData = result && result.expression ? LIFE_NUMBERS[result.expression] : null;
    const colors = { life: "#7C3AED", personal: "#EC4899", expression: "#F59E0B" };

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>

                {/* HERO */}
                <section className="section-pad" style={{ textAlign: "center", background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(124,58,237,0.10) 0%, transparent 70%)" }}>
                    <div className="container-sm" style={{ maxWidth: 680 }}>
                        <span className="badge" style={{ marginBottom: "1rem", display: "inline-flex" }}>🔢 Numerología Pitagórica</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.75rem" }}>
                            Tu número de vida revela<br />lo que los ojos no ven
                        </h1>
                        <p style={{ fontSize: "0.9rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto 2rem" }}>
                            La numerología pitagórica convierte tu fecha de nacimiento en un código de frecuencia que describe tu misión, tus fortalezas y el ciclo en que te encuentras este año.
                        </p>

                        {/* Calculator */}
                        <div className="glass-card" style={{ padding: "1.5rem", maxWidth: 480, margin: "0 auto", textAlign: "left" }}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.35)", display: "block", marginBottom: "0.4rem" }}>
                                    Fecha de nacimiento
                                </label>
                                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
                                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "0.6rem", border: "1px solid rgba(124,58,237,0.3)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.9rem" }} />
                            </div>
                            <div style={{ marginBottom: "1.25rem" }}>
                                <label style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.35)", display: "block", marginBottom: "0.4rem" }}>
                                    Nombre completo <span style={{ fontWeight: 400, opacity: 0.5 }}>(opcional — para tu número de expresión)</span>
                                </label>
                                <input type="text" placeholder="Tu nombre tal como figura en tu documento" value={name} onChange={e => setName(e.target.value)}
                                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "0.6rem", border: "1px solid rgba(124,58,237,0.2)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.88rem" }} />
                            </div>
                            <button className="btn-gold" style={{ width: "100%", fontWeight: 800 }} onClick={calculate} disabled={!birthDate}>
                                Calcular mis números →
                            </button>
                            {result && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginTop: "1rem", textAlign: "center" }}>
                                    {[["Número de Vida", result.life, colors.life], ["Año Personal " + new Date().getFullYear(), result.personal, colors.personal], ...(result.expression ? [["N° de Expresión", result.expression, colors.expression]] : [])].map(([label, num, color]) => (
                                        <div key={String(label)} className="glass-card" style={{ padding: "0.65rem", borderColor: String(color) + "30" }}>
                                            <p style={{ fontSize: "1.6rem", fontWeight: 900, color: String(color) }}>{String(num)}</p>
                                            <p style={{ fontSize: "0.58rem", color: "rgba(248,248,255,0.3)", lineHeight: 1.4 }}>{String(label)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* RESULT */}
                {result && numData && (
                    <section className="section-pad" style={{ background: "rgba(0,0,0,0.12)" }}>
                        <div className="container-sm" style={{ maxWidth: 680 }}>
                            {/* Tabs */}
                            <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                                {([["life", "Número de Vida", colors.life], ["personal", "Año Personal", colors.personal], ...(result.expression ? [["expression", "N° de Expresión", colors.expression]] : [])]).map(([key, label, color]) => (
                                    <button key={String(key)} onClick={() => setActiveTab(key as "life" | "personal" | "expression")}
                                        style={{ padding: "0.4rem 0.9rem", borderRadius: "2rem", border: `1px solid ${activeTab === key ? String(color) : "rgba(255,255,255,0.07)"}`, background: activeTab === key ? String(color) + "18" : "transparent", color: activeTab === key ? String(color) : "rgba(248,248,255,0.3)", fontSize: "0.78rem", fontWeight: activeTab === key ? 700 : 400, cursor: "pointer" }}>
                                        {String(label)}
                                    </button>
                                ))}
                            </div>

                            {/* Life number card */}
                            {activeTab === "life" && numData && (
                                <div className="glass-card" style={{ padding: "2rem", borderColor: colors.life + "30" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                                        <div style={{ fontSize: "3rem", lineHeight: 1 }}>{numData.emoji}</div>
                                        <div>
                                            <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: colors.life, fontWeight: 700, marginBottom: "0.15rem" }}>Número de Vida {result.life}</p>
                                            <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F8F8FF" }}>{numData.name}</h2>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: "0.9rem", fontStyle: "italic", color: numData.color, marginBottom: "1rem", lineHeight: 1.6 }}>&ldquo;{numData.tagline}&rdquo;</p>
                                    <p style={{ fontSize: "0.84rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.85, marginBottom: "1rem" }}>{numData.body}</p>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                                        <div className="glass-card" style={{ padding: "0.85rem", borderColor: numData.color + "20" }}>
                                            <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: numData.color, marginBottom: "0.4rem", letterSpacing: "0.1em" }}>✦ Fortalezas</p>
                                            {numData.strengths.map(s => <p key={s} style={{ fontSize: "0.76rem", color: "rgba(248,248,255,0.5)", marginBottom: "0.15rem" }}>· {s}</p>)}
                                        </div>
                                        <div className="glass-card" style={{ padding: "0.85rem" }}>
                                            <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "rgba(248,248,255,0.2)", marginBottom: "0.4rem", letterSpacing: "0.1em" }}>⚠️ Desafíos</p>
                                            {numData.challenges.map(c => <p key={c} style={{ fontSize: "0.76rem", color: "rgba(248,248,255,0.35)", marginBottom: "0.15rem" }}>· {c}</p>)}
                                        </div>
                                    </div>
                                    <div style={{ padding: "0.75rem 1rem", background: numData.color + "0D", borderRadius: "0.6rem", border: `1px solid ${numData.color}20`, marginBottom: "0.75rem" }}>
                                        <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: numData.color, marginBottom: "0.25rem", letterSpacing: "0.1em" }}>Tu propósito</p>
                                        <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.55)", lineHeight: 1.7 }}>{numData.purpose}</p>
                                    </div>
                                    <div style={{ textAlign: "center", padding: "0.65rem" }}>
                                        <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "rgba(248,248,255,0.2)", marginBottom: "0.3rem" }}>Afirmación</p>
                                        <p style={{ fontSize: "0.88rem", fontWeight: 600, fontStyle: "italic", color: "#F8F8FF" }}>&ldquo;{numData.affirmation}&rdquo;</p>
                                    </div>
                                </div>
                            )}

                            {/* Personal year card */}
                            {activeTab === "personal" && persData && (
                                <div className="glass-card" style={{ padding: "2rem", borderColor: colors.personal + "30" }}>
                                    <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: colors.personal, fontWeight: 700, marginBottom: "0.3rem" }}>Año Personal {new Date().getFullYear()} — Número {result.personal}</p>
                                    <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>{persData.name}</h2>
                                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: colors.personal, fontStyle: "italic", marginBottom: "1rem" }}>{PERSONAL_YEAR_TAGS[result.personal] || persData.tagline}</p>
                                    <p style={{ fontSize: "0.84rem", color: "rgba(248,248,255,0.58)", lineHeight: 1.85 }}>{persData.body}</p>
                                </div>
                            )}

                            {/* Expression card */}
                            {activeTab === "expression" && exprData && (
                                <div className="glass-card" style={{ padding: "2rem", borderColor: colors.expression + "30" }}>
                                    <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color: colors.expression, fontWeight: 700, marginBottom: "0.3rem" }}>Número de Expresión (tu nombre) — {result.expression}</p>
                                    <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>{exprData.name}</h2>
                                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: colors.expression, fontStyle: "italic", marginBottom: "1rem" }}>{exprData.tagline}</p>
                                    <p style={{ fontSize: "0.84rem", color: "rgba(248,248,255,0.58)", lineHeight: 1.85 }}>{exprData.body}</p>
                                </div>
                            )}

                            {/* GATE */}
                            {!showGate ? (
                                <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", borderColor: "rgba(124,58,237,0.2)", marginTop: "1rem" }}>
                                    <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>🔒 Tu análisis numerológico completo</p>
                                    <p style={{ fontSize: "0.73rem", color: "rgba(248,248,255,0.35)", marginBottom: "0.85rem", lineHeight: 1.6 }}>
                                        Número del alma, número de personalidad, número kármico, ciclos de vida por décadas, y la interacción con tu carta natal.
                                    </p>
                                    <button className="btn-gold" style={{ fontSize: "0.8rem", fontWeight: 700 }} onClick={() => { setShowGate(true); track.gateHit("numerologia"); }}>
                                        Ver análisis completo →
                                    </button>
                                </div>
                            ) : (
                                <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", borderColor: "rgba(124,58,237,0.4)", marginTop: "1rem" }}>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>✨ Plan Esencial — Numerología + Carta Natal integradas</p>
                                    <a href="/precios" className="btn-gold" style={{ fontWeight: 700, textDecoration: "none", display: "inline-block", padding: "0.6rem 1.5rem", fontSize: "0.82rem" }}
                                        onClick={() => track.upgradeClick("numerologia", "esencial")}>
                                        Activar Plan Esencial →
                                    </a>
                                </div>
                            )}

                            {/* Share */}
                            <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center", marginTop: "1rem" }}>
                                <button onClick={() => { track.shareWhatsApp("numerologia"); window.open(`https://wa.me/?text=${encodeURIComponent(`Mi número de vida es el ${result.life} — ${numData.name} ${numData.emoji}\n"${numData.tagline}"\n\n¿Cuál es el tuyo? → crystal-cosmos.vercel.app/numerologia-y-tu-numero-de-vida`)}`, "_blank"); }}
                                    style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                                    💬 Compartir mi número
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* INFO SECTION */}
                <section className="section-pad">
                    <div className="container-sm" style={{ maxWidth: 680, textAlign: "center" }}>
                        <h2 className="font-display" style={{ fontSize: "clamp(1.2rem,2vw,1.6rem)", fontWeight: 700, marginBottom: "0.5rem" }}>Los 3 números que definen tu código</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginTop: "1.25rem" }}>
                            {[
                                { label: "Número de Vida", desc: "Tu misión y patrón de toda la vida. Se calcula con la fecha de nacimiento.", color: colors.life, emoji: "🌟" },
                                { label: "Año Personal", desc: "El ciclo de 9 años en que te encuentras este año. Qué energía actuar.", color: colors.personal, emoji: "📅" },
                                { label: "N° de Expresión", desc: "Cómo te proyectas al mundo según el valor numérico de tu nombre.", color: colors.expression, emoji: "🔤" },
                            ].map(c => (
                                <div key={c.label} className="glass-card" style={{ padding: "1.1rem", textAlign: "left", borderColor: c.color + "20" }}>
                                    <p style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{c.emoji}</p>
                                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: c.color, marginBottom: "0.25rem" }}>{c.label}</p>
                                    <p style={{ fontSize: "0.74rem", color: "rgba(248,248,255,0.35)", lineHeight: 1.6 }}>{c.desc}</p>
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
