"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";
import { track, initScrollTracker } from "@/lib/analytics";

// ══════════════════════════════════════════════════════════
// NUMEROLOGÍA PITAGÓRICA v2 — Módulo completo monetizable
// Nuevo en v2: Número del Alma, N° Personalidad, N° Kármico,
// Tabla de Ciclos por Décadas, Años Pinnacle, Email capture gate
// ══════════════════════════════════════════════════════════

const PY_MAP: Record<string, number> = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
    á: 1, é: 5, í: 9, ó: 6, ú: 3, ü: 3, ñ: 5,
};
const VOWELS = new Set(["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú"]);

function reduce(n: number): number {
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
        n = String(n).split("").reduce((a, d) => a + parseInt(d), 0);
    }
    return n;
}

function calcLife(date: string): number {
    const [y, m, d] = date.split("-").map(Number);
    return reduce(y + m + d);
}

function calcPersonalYear(date: string, yr = new Date().getFullYear()): number {
    const [, m, d] = date.split("-").map(Number);
    return reduce(yr + m + d);
}

function calcNameNumbers(name: string): { expression: number; soul: number; personality: number } {
    const clean = name.toLowerCase().replace(/[^a-záéíóúüñ]/g, "");
    const all = clean.split("").reduce((s, c) => s + (PY_MAP[c] || 0), 0);
    const soul = clean.split("").filter(c => VOWELS.has(c)).reduce((s, c) => s + (PY_MAP[c] || 0), 0);
    const pers = clean.split("").filter(c => !VOWELS.has(c) && PY_MAP[c]).reduce((s, c) => s + (PY_MAP[c] || 0), 0);
    return { expression: reduce(all), soul: reduce(soul), personality: reduce(pers) };
}

function calcKarmic(date: string): number | null {
    const [y, m, d] = date.split("-").map(Number);
    // Karmics: 13, 14, 16, 19 — detected before final reduction
    const raw = y + m + d;
    const stages = [String(y), String(m), String(d), String(raw)];
    for (const s of stages) {
        const n = parseInt(s);
        if ([13, 14, 16, 19].includes(n)) return n;
    }
    return null;
}

function calcPinnacles(date: string): { ages: [number, number, number, number]; values: [number, number, number, number] } {
    const [, m, d] = date.split("-").map(Number);
    const lifeNum = calcLife(date);
    const age1End = 36 - lifeNum;
    const p1 = reduce(m + d);
    const p2 = reduce(d + parseInt(date.split("-")[0]));
    const p3 = reduce(p1 + p2);
    const p4 = reduce(m + parseInt(date.split("-")[0]));
    return {
        ages: [age1End, age1End + 9, age1End + 18, age1End + 27],
        values: [p1, p2, p3, p4]
    };
}

const NUM_DATA: Record<number, { name: string; emoji: string; color: string; tagline: string; body: string; strengths: string[]; challenges: string[]; purpose: string; affirmation: string; decade: string }> = {
    1: { name: "El Iniciador", emoji: "🔥", color: "#EF4444", tagline: "Naciste para liderar lo que todavía no existe", body: "El número 1 es la chispa original — la fuerza que rompe la inercia y da inicio a lo que antes era solo posibilidad. Tu misión en esta vida tiene que ver con la independencia, el liderazgo y la originalidad. Cuando navegas en tu frecuencia más alta, te conviertes en el que abre puertas para que otros puedan pasar.", strengths: ["Liderazgo natural", "Independencia", "Valentía para iniciar", "Originalidad"], challenges: ["Impaciencia", "Dificultad para delegar", "Ego cuando está en sombra"], purpose: "Ser el primero en cruzar un umbral que libera a los que vienen detrás.", affirmation: "Soy el origen de lo que necesita nacer.", decade: "Cada déc ada que comienza en año 1 personal: nuevos proyectos, nuevas identidades. La energía del 1 favorece las decisiones valientes." },
    2: { name: "El Diplomático", emoji: "🌙", color: "#8B5CF6", tagline: "Tu sensibilidad es el instrumento más preciso que existe", body: "El número 2 es la inteligencia de la relación. Donde el 1 actúa solo, el 2 actúa en pareja — porque entiende que la realidad se construye entre dos perspectivas. Tu sensibilidad no es fragilidad: es un sensor extraordinariamente calibrado para detectar lo que otros pasan por alto.", strengths: ["Empatía profunda", "Mediación natural", "Intuición relacional", "Paciencia"], challenges: ["Dificultad para establecer límites", "Codependencia", "Postergación de propias necesidades"], purpose: "Ser el puente que permite que dos mundos se entiendan sin perder ninguno.", affirmation: "Mi sensibilidad es mi poder — no mi debilidad.", decade: "Los años 2 personales son de cooperación y paciencia. No hay atajos — pero las alianzas que construyes duran décadas." },
    3: { name: "El Creativo", emoji: "✨", color: "#F59E0B", tagline: "El universo se expresa a través de ti — si dejas que fluya", body: "El número 3 es la frecuencia de la creación consciente. Con el impulso del 1 y la relación del 2, el 3 produce algo nuevo — algo que antes no existía. Tu misión tiene que ver con la expresión: con encontrar la forma en que lo que vive dentro de ti pueda ser visto, escuchado o sentido por los demás.", strengths: ["Creatividad desbordante", "Comunicación magnética", "Optimismo contagioso", "Talento artístico"], challenges: ["Dispersión", "Superficialidad cuando el foco no está", "Tendencia a compararse"], purpose: "Dar forma visible a lo que todos sienten pero nadie sabe cómo expresar.", affirmation: "Soy un canal para la belleza que el mundo necesita ver.", decade: "Los años 3 personales: festeja, crea, comunica. El universo amplifica lo que expresas con alegría." },
    4: { name: "El Constructor", emoji: "🏛️", color: "#22C55E", tagline: "Lo que construyes hoy es la base que sostiene el mañana", body: "El número 4 es la frecuencia de la estructura, la disciplina y el trabajo. No hay atajo para el 4 — y en eso está su mayor fortaleza. Lo que el 4 construye dura porque está bien cimentado. Tu trabajo en esta vida es aprender que la disciplina no es restricción — es libertad construida ladrillo a ladrillo.", strengths: ["Disciplina excepcional", "Capacidad de construcción sostenida", "Confiabilidad", "Pensamiento práctico"], challenges: ["Rigidez cuando el plan falla", "Resistencia al cambio", "Exceso de trabajo como forma de control"], purpose: "Construir las estructuras que permiten que otros crezcan con seguridad.", affirmation: "Mi consistencia es mi legado.", decade: "Los años 4: trabaja, construye, organiza. No es glamoroso — pero las bases que pones durarán 20 años." },
    5: { name: "El Aventurero", emoji: "🌎", color: "#06B6D4", tagline: "Tu libertad es el regalo que ofreces al mundo", body: "El número 5 es expansión pura. Libertad, movimiento, experiencia, transformación. El 5 necesita variedad no por capricho sino porque su aprendizaje ocurre a través del cambio. Cada vez que el 5 sale de su zona de confort, regresa con algo que nadie más tiene.", strengths: ["Adaptabilidad", "Curiosidad insaciable", "Capacidad para reinventarse", "Magnetismo natural"], challenges: ["Inconstancia", "Adicción a la novedad", "Dificultad para comprometerse"], purpose: "Demostrar que la vida es más grande de lo que todos creen.", affirmation: "Mi libertad abre puertas que otros no sabían que existían.", decade: "Los años 5: cambia, viaja, experimenta. La zona de confort es el enemigo este año." },
    6: { name: "El Sanador", emoji: "💚", color: "#10B981", tagline: "Tu amor tiene el poder de transformar lo que tocas", body: "El número 6 es el arquetipo del cuidado, la responsabilidad y el amor que se materializa en acciones concretas. Tu sensibilidad hacia los demás es extraordinaria — percibes lo que necesitan antes de que puedan pedirlo. Tu misión es aprender que cuidar no significa sacrificarte.", strengths: ["Capacidad de cuidado profundo", "Sentido de la justicia", "Belleza y armonía", "Responsabilidad"], challenges: ["Martirio encubierto", "Dificultad para recibir", "Perfeccionismo en el hogar"], purpose: "Crear los espacios donde otros pueden sanar y florecer.", affirmation: "Me cuido primero para poder cuidar desde un lugar de plenitud.", decade: "Los años 6: hogar, familia, salud. La vida te pide que priorices las relaciones que más importan." },
    7: { name: "El Místico", emoji: "🔮", color: "#7C3AED", tagline: "Viniste a saber lo que otros no pueden ver", body: "El número 7 es la frecuencia del conocimiento profundo, la introspección y la conexión con lo invisible. El 7 no se conforma con las respuestas superficiales — necesita ir a la raíz, al origen, a la esencia. Tu misión es integrar el mundo interior con el exterior.", strengths: ["Inteligencia analítica y espiritual simultánea", "Capacidad de investigación", "Intuición desarrollada", "Profundidad"], challenges: ["Aislamiento", "Desconfianza en los demás", "Perfeccionismo intelectual"], purpose: "Traer comprensión desde las profundidades a las que nadie más desciende.", affirmation: "Mi profundidad es una contribución, no un defecto.", decade: "Los años 7: estudia, reflexiona, medita. No es el año de la acción — es el año del conocimiento." },
    8: { name: "El Poder", emoji: "💎", color: "#F97316", tagline: "Aquí para dominar la materia — y usarla al servicio de algo mayor", body: "El número 8 es la frecuencia del poder, el liderazgo material y la capacidad de manifestar abundancia. No es accidente que el 8 acostado sea el símbolo del infinito — porque la misión del 8 es demostrar que el poder espiritual y el material no están separados.", strengths: ["Visión de negocios", "Autoridad natural", "Determinación", "Capacidad de manifestar"], challenges: ["Control excesivo", "Materialismo cuando opera desde el miedo", "Todo o nada"], purpose: "Demostrar que el poder real sirve a algo más grande que uno mismo.", affirmation: "El poder que tengo está al servicio de algo más grande.", decade: "Los años 8: cosecha lo que sembraste. Es el año de las recompensas — si pusiste el trabajo." },
    9: { name: "El Completador", emoji: "🌊", color: "#3B82F6", tagline: "Viniste a completar lo que otros iniciaron — y a soltar lo que ya cumplió su ciclo", body: "El número 9 contiene a todos los anteriores y a la vez los trasciende. Es la frecuencia del cierre, la compasión universal y el servicio desinteresado. El mayor reto del 9 es aprender a soltar — personas, proyectos, identidades — no por pérdida sino por completud.", strengths: ["Compasión universal", "Capacidad de ver el panorama completo", "Magnetismo espiritual", "Creatividad"], challenges: ["Dificultad para soltar el pasado", "Tendencia al martirio", "Dispersión por querer ayudar a todos"], purpose: "Demostrar que la compasión sin límites puede coexistir con la sabiduría.", affirmation: "Suelto lo que ya cumplió su propósito y confío en lo que viene.", decade: "Los años 9: cierra ciclos, suelta, perdona. Lo que no sueltes aquí, la vida lo soltará por ti." },
    11: { name: "El Maestro Iluminador", emoji: "⚡", color: "#EC4899", tagline: "Número maestro — viniste a iluminar lo que otros no pueden ver aún", body: "El 11 es un número maestro — no se reduce a 2 porque su frecuencia opera en un plano superior. Tienes acceso a percepciones, intuiciones e inspiraciones que la mayoría no puede procesar. Tu misión es aprender a encarnar esa frecuencia alta sin quemarte.", strengths: ["Intuición extraordinaria", "Capacidad de inspirar", "Visión espiritual", "Sensibilidad extrema"], challenges: ["Ansiedad de alto voltaje", "Dificultad para aterrizar las visiones", "Absorción emocional"], purpose: "Ser un canal de luz consciente — no una antena que se quema por exceso de señal.", affirmation: "Soy un canal, no la fuente — la luz pasa a través de mí con gracia.", decade: "Los años 11: iluminaciones, revelaciones, crisis espirituales. Grábalo todo — son mensajes para toda la vida." },
    22: { name: "El Maestro Constructor", emoji: "🏗️", color: "#84CC16", tagline: "Número maestro — viniste a construir algo que trasciende generaciones", body: "El 22 es el número maestro de la manifestación — el más poderoso del sistema pitagórico. Tienes la visión del 11 y la capacidad constructiva del 4 multiplicada. Tu misión es aterrizar lo grande, lo épico, lo generacional en estructuras concretas que los demás puedan habitar.", strengths: ["Visión global + capacidad de ejecución", "Liderazgo transformador", "Pensamiento sistémico", "Magnetismo"], challenges: ["Presión aplastante de la misión", "Perfeccionismo extremo", "Aislamiento por la magnitud del proyecto"], purpose: "Construir la infraestructura que transforma la vida de millones.", affirmation: "Lo que construyo hoy ya pertenece al futuro.", decade: "Los años 22: ambición máxima. Si lo sueñas puedes construirlo — pero necesitas equipo." },
    33: { name: "El Maestro Sanador", emoji: "💜", color: "#D946EF", tagline: "Número maestro — el amor más puro como eje de toda tu vida", body: "El 33 es el número maestro del amor sin condiciones — raro, exigente, transformador. El 33 es el que ama sin retener, sirve sin esperar, cura sin necesitar ser curado. Tu misión trasciende lo personal — tu servicio es a la conciencia colectiva.", strengths: ["Amor incondicional genuino", "Capacidad de sanar con la presencia", "Compasión sin límites"], challenges: ["Agotamiento del cuidador", "Dificultad para recibir", "Culpa cuando no puede 'salvar' a otros"], purpose: "Encarnar el amor como frecuencia universal — no como sentimiento.", affirmation: "El amor que soy no necesita esfuerzo para irradiarse.", decade: "Los años 33: servicio puro. Tu presencia sana. No necesitas hacer nada — solo ser." },
};

const KARMIC_DATA: Record<number, { name: string; body: string; gift: string }> = {
    13: { name: "Deuda del 13 — La Transformación", body: "El 13 kármico trae la energía de la muerte y el renacimiento. En vidas anteriores, el alma resistió el cambio o abusó del poder de transformar. En esta vida, aprenderás que el trabajo duro y la disciplina son sagrados — no castigos. Cada vez que algo 'muere' en tu vida, algo superior nace.", gift: "Capacidad extraordinaria de renacer de las cenizas una y otra vez." },
    14: { name: "Deuda del 14 — La Libertad Responsable", body: "El 14 kármico indica un alma que en vidas pasadas abusó de la libertad o escapó de sus compromisos. En esta vida, la tentación de excesos (adicciones, evasiones, fugas) será un patrón recurrente hasta que aprendas que la verdadera libertad se construye dentro de compromisos elegidos conscientemente.", gift: "Una vez integrado: se convierte en el campeón de la libertad auténtica — no la escapista." },
    16: { name: "Deuda del 16 — El Orgullo del Ego", body: "El 16 kármico es el más intenso — implica que el ego ha ocupado el lugar del espíritu. Las caídas en la vida del 16 no son castigos: son correcciones del cosmos para que el alma recuerde que no es el ego quien dirige. Los matrimonios, carreras o proyectos que se rompen repentinamente son parte de este patrón.", gift: "Cuando el ego cede: sabiduría espiritual profunda que very pocos alcanzan." },
    19: { name: "Deuda del 19 — El Abuso de Poder", body: "El 19 kármico señala un alma que en vidas anteriores usó el poder personal de forma egoísta o manipuladora. En esta vida, vendrás repitidamente a situaciones donde dependerás de otros — para aprender que el poder verdadero se comparte. La independencia excesiva es el síntoma; la interdependencia consciente es la cura.", gift: "Una vez integrado: liderazgo al servicio genuino — poderoso y humilde al mismo tiempo." },
};

const DECADE_GUIDANCE: Record<number, Record<number, string>> = {
    1: { 20: "Los 20 bajo influencia del 1: década del yo auténtico. Define quién eres antes de definir qué haces.", 30: "Los 30 bajo el 1: lanza tu proyecto más importante. Es el inicio de tu ciclo de 9 largo.", 40: "Los 40 bajo el 1: reinvención. El que eras ya no te queda. Abraza la nueva identidad.", 50: "Los 50 bajo el 1: liderazgo maduro. Tu mayor regalo es tu ejemplo." },
    2: { 20: "Los 20 bajo el 2: aprende a relacionarte sin perderte. Cada pareja es un espejo.", 30: "Los 30 bajo el 2: construye alianzas que duran. La soledad no te sirve esta década.", 40: "Los 40 bajo el 2: profundiza las relaciones existentes en lugar de buscar nuevas.", 50: "Los 50 bajo el 2: ármonía y reconciliación. Suelto lo que no puedo cambiar en el otro." },
};

type TabType = "life" | "personal" | "soul" | "expression" | "personality" | "karmic" | "cycles";

export default function NumerologiaClient() {
    const [birthDate, setBirthDate] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [result, setResult] = useState<{
        life: number; personal: number; expression: number;
        soul: number; personality: number; karmic: number | null;
        pinnacles: ReturnType<typeof calcPinnacles>;
    } | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("life");
    const [gatePhase, setGatePhase] = useState<"closed" | "email" | "open">("closed");

    useEffect(() => {
        track.moduleEnter("numerologia_v2");
        const cleanup = initScrollTracker("numerologia_v2");
        return cleanup;
    }, []);

    function calculate() {
        if (!birthDate) return;
        const life = calcLife(birthDate);
        const personal = calcPersonalYear(birthDate);
        const karmic = calcKarmic(birthDate);
        const pinnacles = calcPinnacles(birthDate);
        const names = name ? calcNameNumbers(name) : { expression: 0, soul: 0, personality: 0 };
        setResult({ life, personal, karmic, pinnacles, ...names });
        track.calculateClick("numerologia_v2", name ? "with_name" : "date_only");
    }

    async function submitEmail() {
        if (!email || !email.includes("@")) return;
        try {
            await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: "email_lead_captured",
                    module: "numerologia_v2",
                    session_id: typeof window !== "undefined" ? (localStorage.getItem("sid") || "anon") : "anon",
                    properties: { email, life_number: result?.life, source: "numerologia_gate" }
                })
            });
        } catch { }
        setEmailSent(true);
        setGatePhase("open");
        track.gateHit("numerologia_email");
    }

    const numData = result ? NUM_DATA[result.life] : null;
    const currentYear = new Date().getFullYear();
    const birthYear = birthDate ? parseInt(birthDate.split("-")[0]) : 0;

    const TABS: { key: TabType; label: string; color: string; locked?: boolean }[] = [
        { key: "life", label: "Número de Vida", color: "#7C3AED" },
        { key: "personal", label: "Año " + currentYear, color: "#EC4899" },
        ...(result?.expression ? [{ key: "expression" as TabType, label: "Expresión", color: "#F59E0B" }] : []),
        ...(result?.soul ? [{ key: "soul" as TabType, label: "Alma", color: "#06B6D4", locked: gatePhase === "closed" }] : []),
        ...(result?.personality ? [{ key: "personality" as TabType, label: "Personalidad", color: "#10B981", locked: gatePhase === "closed" }] : []),
        ...(result?.karmic ? [{ key: "karmic" as TabType, label: "N° Kármico 🔒", color: "#F97316", locked: gatePhase === "closed" }] : []),
        { key: "cycles", label: "Ciclos de Vida 🔒", color: "#84CC16", locked: gatePhase === "closed" },
    ];

    function renderNumberCard(n: number, label: string, color: string) {
        const d = NUM_DATA[n];
        if (!d) return null;
        return (
            <div className="glass-card" style={{ padding: "2rem", borderColor: color + "30" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div style={{ fontSize: "3rem", lineHeight: 1 }}>{d.emoji}</div>
                    <div>
                        <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", color, fontWeight: 700, marginBottom: "0.15rem" }}>{label} — {n}</p>
                        <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 800, color: "#F8F8FF" }}>{d.name}</h2>
                    </div>
                </div>
                <p style={{ fontSize: "0.9rem", fontStyle: "italic", color: d.color, marginBottom: "1rem", lineHeight: 1.6 }}>&ldquo;{d.tagline}&rdquo;</p>
                <p style={{ fontSize: "0.84rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.85, marginBottom: "1rem" }}>{d.body}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div className="glass-card" style={{ padding: "0.85rem", borderColor: d.color + "20" }}>
                        <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: d.color, marginBottom: "0.4rem", letterSpacing: "0.1em" }}>✦ Fortalezas</p>
                        {d.strengths.map(s => <p key={s} style={{ fontSize: "0.76rem", color: "rgba(248,248,255,0.5)", marginBottom: "0.15rem" }}>· {s}</p>)}
                    </div>
                    <div className="glass-card" style={{ padding: "0.85rem" }}>
                        <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "rgba(248,248,255,0.2)", marginBottom: "0.4rem", letterSpacing: "0.1em" }}>⚠️ Desafíos</p>
                        {d.challenges.map(c => <p key={c} style={{ fontSize: "0.76rem", color: "rgba(248,248,255,0.35)", marginBottom: "0.15rem" }}>· {c}</p>)}
                    </div>
                </div>
                <div style={{ padding: "0.75rem 1rem", background: d.color + "0D", borderRadius: "0.6rem", border: `1px solid ${d.color}20`, marginBottom: "0.75rem" }}>
                    <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: d.color, marginBottom: "0.25rem", letterSpacing: "0.1em" }}>Tu propósito</p>
                    <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.55)", lineHeight: 1.7 }}>{d.purpose}</p>
                </div>
                <div style={{ textAlign: "center", padding: "0.65rem" }}>
                    <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "rgba(248,248,255,0.2)", marginBottom: "0.3rem" }}>Afirmación</p>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, fontStyle: "italic", color: "#F8F8FF" }}>&ldquo;{d.affirmation}&rdquo;</p>
                </div>
            </div>
        );
    }

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
                            La numerología pitagórica convierte tu fecha de nacimiento en un código de frecuencia que describe tu misión, tus fortalezas, tu karma y los ciclos de cada etapa de tu vida.
                        </p>
                        <div className="glass-card" style={{ padding: "1.5rem", maxWidth: 480, margin: "0 auto", textAlign: "left" }}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.35)", display: "block", marginBottom: "0.4rem" }}>Fecha de nacimiento</label>
                                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
                                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "0.6rem", border: "1px solid rgba(124,58,237,0.3)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.9rem" }} />
                            </div>
                            <div style={{ marginBottom: "1.25rem" }}>
                                <label style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.35)", display: "block", marginBottom: "0.4rem" }}>
                                    Nombre completo <span style={{ fontWeight: 400, opacity: 0.5 }}>(opcional — desbloquea 3 números extra)</span>
                                </label>
                                <input type="text" placeholder="Tu nombre tal como figura en tu documento" value={name} onChange={e => setName(e.target.value)}
                                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "0.6rem", border: "1px solid rgba(124,58,237,0.2)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.88rem" }} />
                            </div>
                            <button className="btn-gold" style={{ width: "100%", fontWeight: 800 }} onClick={calculate} disabled={!birthDate}>
                                Calcular mi código numerológico →
                            </button>
                            {result && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "0.4rem", marginTop: "1rem", textAlign: "center" }}>
                                    {[
                                        ["Vida", result.life, "#7C3AED"],
                                        ["Año " + currentYear, result.personal, "#EC4899"],
                                        ...(result.expression ? [["Expresión", result.expression, "#F59E0B"]] : []),
                                        ...(result.soul ? [["Alma 🔒", result.soul, "#06B6D4"]] : []),
                                        ...(result.personality ? [["Personalidad 🔒", result.personality, "#10B981"]] : []),
                                        ...(result.karmic ? [["Kármico 🔒", result.karmic, "#F97316"]] : []),
                                    ].map(([label, num, color]) => (
                                        <div key={String(label)} className="glass-card" style={{ padding: "0.5rem", borderColor: String(color) + "30" }}>
                                            <p style={{ fontSize: "1.4rem", fontWeight: 900, color: String(color) }}>{String(num)}</p>
                                            <p style={{ fontSize: "0.55rem", color: "rgba(248,248,255,0.3)", lineHeight: 1.3 }}>{String(label)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* RESULTS */}
                {result && numData && (
                    <section className="section-pad" style={{ background: "rgba(0,0,0,0.12)" }}>
                        <div className="container-sm" style={{ maxWidth: 680 }}>
                            {/* Tabs */}
                            <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                                {TABS.map(t => (
                                    <button key={t.key} onClick={() => {
                                        if (t.locked && gatePhase === "closed") { setGatePhase("email"); track.gateHit("numerologia_v2_" + t.key); return; }
                                        setActiveTab(t.key);
                                    }}
                                        style={{ padding: "0.4rem 0.9rem", borderRadius: "2rem", border: `1px solid ${activeTab === t.key ? t.color : "rgba(255,255,255,0.07)"}`, background: activeTab === t.key ? t.color + "18" : "transparent", color: activeTab === t.key ? t.color : "rgba(248,248,255,0.3)", fontSize: "0.78rem", fontWeight: activeTab === t.key ? 700 : 400, cursor: "pointer" }}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab content */}
                            {activeTab === "life" && renderNumberCard(result.life, "Número de Vida", "#7C3AED")}
                            {activeTab === "personal" && renderNumberCard(result.personal, `Año Personal ${currentYear}`, "#EC4899")}
                            {activeTab === "expression" && result.expression > 0 && renderNumberCard(result.expression, "Número de Expresión", "#F59E0B")}

                            {activeTab === "soul" && gatePhase === "open" && result.soul > 0 && (
                                <div>
                                    <div className="glass-card" style={{ padding: "1rem", borderColor: "#06B6D420", marginBottom: "1rem" }}>
                                        <p style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "#06B6D4", fontWeight: 700, marginBottom: "0.3rem" }}>Qué es el Número del Alma</p>
                                        <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.7 }}>Se calcula solo con las vocales de tu nombre completo. Revela lo que tu alma anhela en privado — lo que raramente muestras al mundo pero que dirige tus decisiones más profundas.</p>
                                    </div>
                                    {renderNumberCard(result.soul, "Número del Alma", "#06B6D4")}
                                </div>
                            )}

                            {activeTab === "personality" && gatePhase === "open" && result.personality > 0 && (
                                <div>
                                    <div className="glass-card" style={{ padding: "1rem", borderColor: "#10B98120", marginBottom: "1rem" }}>
                                        <p style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "#10B981", fontWeight: 700, marginBottom: "0.3rem" }}>Qué es el Número de Personalidad</p>
                                        <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.7 }}>Se calcula solo con las consonantes de tu nombre. Es la máscara que el mundo ve primero — tu imagen pública antes de que te conozcan en profundidad.</p>
                                    </div>
                                    {renderNumberCard(result.personality, "Número de Personalidad", "#10B981")}
                                </div>
                            )}

                            {activeTab === "karmic" && gatePhase === "open" && result.karmic && (
                                <div className="glass-card" style={{ padding: "2rem", borderColor: "#F9731630" }}>
                                    <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "#F97316", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "0.5rem" }}>Número Kármico Detectado — {result.karmic}</p>
                                    <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>{KARMIC_DATA[result.karmic].name}</h2>
                                    <p style={{ fontSize: "0.84rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.85, marginBottom: "1rem" }}>{KARMIC_DATA[result.karmic].body}</p>
                                    <div style={{ padding: "0.75rem 1rem", background: "#F9731608", borderRadius: "0.6rem", border: "1px solid #F9731620" }}>
                                        <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "#F97316", marginBottom: "0.25rem", letterSpacing: "0.1em" }}>Tu regalo kármico</p>
                                        <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.55)", lineHeight: 1.7 }}>{KARMIC_DATA[result.karmic].gift}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === "cycles" && gatePhase === "open" && (
                                <div>
                                    <div className="glass-card" style={{ padding: "1.25rem", borderColor: "#84CC1620", marginBottom: "1rem" }}>
                                        <p style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "#84CC16", fontWeight: 700, marginBottom: "0.5rem" }}>Tus 4 Años Pinnacle</p>
                                        <p style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.4)", marginBottom: "1rem", lineHeight: 1.6 }}>Los Pinnacle son las 4 grandes cimas de tu vida — períodos donde cierta energía está especialmente activada.</p>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                            {result.pinnacles.values.map((v, i) => {
                                                const ages = result.pinnacles.ages;
                                                const ageRange = i === 0 ? `0–${ages[0]}` : i === 3 ? `${ages[2]}+` : `${ages[i - 1]}–${ages[i]}`;
                                                const d = NUM_DATA[v];
                                                return d ? (
                                                    <div key={i} className="glass-card" style={{ padding: "0.75rem", borderColor: d.color + "20" }}>
                                                        <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: d.color, marginBottom: "0.2rem" }}>Pinnacle {i + 1} · Edad {ageRange}</p>
                                                        <p style={{ fontSize: "1.2rem", fontWeight: 900, color: d.color }}>Número {v}</p>
                                                        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#F8F8FF", marginBottom: "0.2rem" }}>{d.name}</p>
                                                        <p style={{ fontSize: "0.68rem", color: "rgba(248,248,255,0.35)", lineHeight: 1.5 }}>{d.decade}</p>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>

                                    {/* Decade guidance */}
                                    {birthYear > 0 && (() => {
                                        const age = currentYear - birthYear;
                                        const decade = Math.floor(age / 10) * 10;
                                        const life = result.life;
                                        const guidance = DECADE_GUIDANCE[life]?.[decade] || `En tu ${decade > 0 ? `década de los ${decade}` : "infancia"} con número ${life}: ${NUM_DATA[life]?.decade || ""}`;
                                        return (
                                            <div className="glass-card" style={{ padding: "1.25rem", borderColor: "#84CC1620" }}>
                                                <p style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "#84CC16", marginBottom: "0.5rem", fontWeight: 700 }}>Tu etapa actual (edad ~{Math.floor(age)})</p>
                                                <p style={{ fontSize: "0.84rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.8 }}>{guidance}</p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* EMAIL CAPTURE GATE */}
                            {gatePhase === "email" && (
                                <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center", borderColor: "rgba(124,58,237,0.4)", marginTop: "1rem" }}>
                                    <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🔑</p>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.25rem" }}>Desbloquea tu análisis completo</p>
                                    <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.35)", marginBottom: "1rem", lineHeight: 1.6 }}>
                                        Número del Alma, Número de Personalidad, Número Kármico y Ciclos de Vida por décadas — gratis con tu email.
                                    </p>
                                    {!emailSent ? (
                                        <div style={{ display: "flex", gap: "0.5rem", maxWidth: 360, margin: "0 auto" }}>
                                            <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)}
                                                onKeyDown={e => e.key === "Enter" && submitEmail()}
                                                style={{ flex: 1, padding: "0.6rem 0.85rem", borderRadius: "0.6rem", border: "1px solid rgba(124,58,237,0.3)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.85rem" }} />
                                            <button className="btn-gold" style={{ padding: "0.6rem 1rem", fontWeight: 700, fontSize: "0.82rem", whiteSpace: "nowrap" }} onClick={submitEmail}>
                                                Ver todo →
                                            </button>
                                        </div>
                                    ) : (
                                        <p style={{ color: "#4ADE80", fontSize: "0.85rem", fontWeight: 600 }}>✅ ¡Perfecto! Accediendo...</p>
                                    )}
                                    <p style={{ fontSize: "0.62rem", color: "rgba(248,248,255,0.15)", marginTop: "0.75rem" }}>Sin spam · Sin tarjeta · Puedes darte de baja cuando quieras</p>
                                </div>
                            )}

                            {/* PAYWALL — after email, upgrades to full */}
                            {gatePhase === "open" && (
                                <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", borderColor: "rgba(124,58,237,0.2)", marginTop: "1rem" }}>
                                    <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>✨ Integra tu numerología con tu carta natal</p>
                                    <p style={{ fontSize: "0.73rem", color: "rgba(248,248,255,0.35)", marginBottom: "0.85rem", lineHeight: 1.6 }}>
                                        Plan Esencial — Numerología + Big Three + 20 módulos de autoconocimiento integrados.
                                    </p>
                                    <a href="/precios" className="btn-gold" style={{ fontWeight: 700, textDecoration: "none", display: "inline-block", padding: "0.6rem 1.5rem", fontSize: "0.82rem" }}
                                        onClick={() => track.upgradeClick("numerologia_v2", "esencial")}>
                                        Activar Plan Esencial →
                                    </a>
                                </div>
                            )}

                            {/* Share */}
                            <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center", marginTop: "1rem" }}>
                                <button onClick={() => { track.shareWhatsApp("numerologia_v2"); window.open(`https://wa.me/?text=${encodeURIComponent(`Mi número de vida es el ${result.life} — ${numData.name} ${numData.emoji}\n"${numData.tagline}"\n\n¿Cuál es el tuyo? → crystal-cosmos.vercel.app/numerologia-y-tu-numero-de-vida`)}`, "_blank"); }}
                                    style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                                    💬 Compartir mi número
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* INFO */}
                <section className="section-pad">
                    <div className="container-sm" style={{ maxWidth: 680, textAlign: "center" }}>
                        <h2 className="font-display" style={{ fontSize: "clamp(1.2rem,2vw,1.6rem)", fontWeight: 700, marginBottom: "0.5rem" }}>Los 6 números que forman tu código completo</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginTop: "1.25rem" }}>
                            {[
                                { label: "Número de Vida", desc: "Tu misión y patrón de toda la vida. Fecha de nacimiento.", color: "#7C3AED", emoji: "🌟" },
                                { label: "Año Personal", desc: "El ciclo anual de 9 en que estás ahora mismo.", color: "#EC4899", emoji: "📅" },
                                { label: "N° de Expresión", desc: "Cómo te proyectas. Valor de tu nombre completo.", color: "#F59E0B", emoji: "🔤" },
                                { label: "N° del Alma", desc: "Lo que anhelas en privado. Solo las vocales.", color: "#06B6D4", emoji: "💙" },
                                { label: "N° de Personalidad", desc: "Cómo te ven antes de conocerte. Las consonantes.", color: "#10B981", emoji: "🎭" },
                                { label: "N° Kármico", desc: "Deudas del alma de vidas anteriores. Solo en algunos.", color: "#F97316", emoji: "⚡" },
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
