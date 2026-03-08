"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";
import { track } from "@/lib/analytics";

// ══════════════════════════════════════════════════════════
// EL ORÁCULO CÓSMICO — Sistema de perfilado psicológico
// Inspirado en Akinator pero para revelar tu arquetipo
// URL: /quien-eres-realmente — Zero mención de astrología
// 20 preguntas → 1 perfil arquetípico → módulo recomendado
// ══════════════════════════════════════════════════════════

type Element = "FIRE" | "EARTH" | "AIR" | "WATER";
type Modality = "CARDINAL" | "FIXED" | "MUTABLE";

interface Answer {
    text: string;
    element: Element;
    modality: Modality;
    weight: number;
}

interface Question {
    id: number;
    question: string;
    context?: string;
    answers: Answer[];
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        question: "Cuando tienes que tomar una decisión importante bajo presión, ¿qué haces primero?",
        answers: [
            { text: "Actúo — la intuición me guía mejor que el análisis", element: "FIRE", modality: "CARDINAL", weight: 2 },
            { text: "Analizo todas las consecuencias antes de moverme", element: "EARTH", modality: "FIXED", weight: 2 },
            { text: "Hablo con alguien de confianza para procesar mis ideas", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Espero a sentir que es el momento correcto", element: "WATER", modality: "CARDINAL", weight: 2 },
        ],
    },
    {
        id: 2,
        question: "Un amigo te pide ayuda con algo que no es tu especialidad. ¿Cuál es tu respuesta instintiva?",
        answers: [
            { text: "Me ofrezco sin pensarlo — encontraré la forma", element: "FIRE", modality: "CARDINAL", weight: 2 },
            { text: "Le digo honestamente si puedo o no, y no prometo lo que no sé", element: "EARTH", modality: "FIXED", weight: 2 },
            { text: "Le pregunto más detalles para ver cómo puedo conectarle con alguien que sí sabe", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Lo siento antes de hablar — si algo me dice que sí, digo sí", element: "WATER", modality: "MUTABLE", weight: 2 },
        ],
    },
    {
        id: 3,
        question: "¿Cómo prefieres pasar un fin de semana sin obligaciones?",
        answers: [
            { text: "Haciendo algo nuevo — actividad física, viaje impulsivo, experiencia intensa", element: "FIRE", modality: "CARDINAL", weight: 1 },
            { text: "En casa, con mis rituales favoritos — cocinar, jardín, lectura tranquila", element: "EARTH", modality: "FIXED", weight: 1 },
            { text: "Viendo gente, conversaciones interesantes, descubrir algo nuevo mental o culturalmente", element: "AIR", modality: "MUTABLE", weight: 1 },
            { text: "Tiempo a solas para recargar — música, naturaleza, descanso profundo", element: "WATER", modality: "FIXED", weight: 1 },
        ],
    },
    {
        id: 4,
        question: "Cuando algo te hace enojar o te duele, ¿cómo lo procesas típicamente?",
        answers: [
            { text: "Lo expreso directamente — no guardo lo que siento", element: "FIRE", modality: "CARDINAL", weight: 2 },
            { text: "Me callo pero no olvido — proceso solo y en silencio", element: "EARTH", modality: "FIXED", weight: 2 },
            { text: "Necesito hablarlo — el lenguaje me ayuda a entender lo que siento", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Lo siento con toda la intensidad antes de poder procesarlo", element: "WATER", modality: "FIXED", weight: 2 },
        ],
    },
    {
        id: 5,
        question: "¿Cuál de estos escenarios te genera más satisfacción profunda?",
        answers: [
            { text: "Haber iniciado algo que otros no se atrevían a iniciar", element: "FIRE", modality: "CARDINAL", weight: 2 },
            { text: "Haber construido algo que dura, que es tangible y real", element: "EARTH", modality: "FIXED", weight: 2 },
            { text: "Haber conectado a personas o ideas que antes estaban desconectadas", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Haber acompañado a alguien en un momento que nadie más vio", element: "WATER", modality: "CARDINAL", weight: 2 },
        ],
    },
    {
        id: 6,
        question: "Tu jefe o socio te da feedback crítico en público. Tu reacción interna inmediata es:",
        answers: [
            { text: "Me defiendo — o por dentro o por fuera, según el contexto", element: "FIRE", modality: "CARDINAL", weight: 2 },
            { text: "Evalúo si tiene razón antes de reaccionar", element: "EARTH", modality: "MUTABLE", weight: 2 },
            { text: "Analizo el contexto — ¿por qué lo dijo así, aquí, ahora?", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Me afecta emocionalmente aunque no lo muestre", element: "WATER", modality: "FIXED", weight: 2 },
        ],
    },
    {
        id: 7,
        question: "¿Qué tipo de proyecto te genera más energía?",
        answers: [
            { text: "Algo nuevo que no existe aún — ser el primero en hacerlo", element: "FIRE", modality: "CARDINAL", weight: 2 },
            { text: "Algo con estructura clara, recursos definidos, proceso concreto", element: "EARTH", modality: "FIXED", weight: 2 },
            { text: "Algo que conecta personas o ideas de campos distintos", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Algo con profundidad emocional o transformación real en las personas", element: "WATER", modality: "CARDINAL", weight: 2 },
        ],
    },
    {
        id: 8,
        question: "Una persona que no te conoce te observa en una reunión. ¿Qué ve?",
        answers: [
            { text: "A alguien que toma espacio — presencia fuerte, opiniones claras", element: "FIRE", modality: "CARDINAL", weight: 2 },
            { text: "A alguien confiable, medido, que habla cuando tiene algo que decir", element: "EARTH", modality: "FIXED", weight: 2 },
            { text: "A alguien curioso, que hace las preguntas que los demás no hacen", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "A alguien que escucha y percibe lo que pasa debajo de la superficie", element: "WATER", modality: "FIXED", weight: 2 },
        ],
    },
    {
        id: 9,
        question: "Tu relación con el dinero es más parecida a:",
        answers: [
            { text: "Una herramienta para hacer cosas — y cuando se acaba, viene más", element: "FIRE", modality: "MUTABLE", weight: 2 },
            { text: "Algo que se cuida, se acumula y se protege con responsabilidad", element: "EARTH", modality: "FIXED", weight: 2 },
            { text: "Un medio de intercambio — lo que importa es el valor que habilita", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Algo cargado emocionalmente — que implica seguridad o inseguridad", element: "WATER", modality: "CARDINAL", weight: 2 },
        ],
    },
    {
        id: 10,
        question: "¿Cuál de estos miedos te resulta más familiar?",
        answers: [
            { text: "Perder la libertad o quedarme atascado en algo que ya no quiero", element: "FIRE", modality: "CARDINAL", weight: 3 },
            { text: "La inestabilidad — perder lo que construí, lo que tengo asegurado", element: "EARTH", modality: "FIXED", weight: 3 },
            { text: "Quedarme solo intelectualmente — sin nadie que piense como yo", element: "AIR", modality: "FIXED", weight: 3 },
            { text: "El abandono o la traición — que alguien en quien confío me falle", element: "WATER", modality: "CARDINAL", weight: 3 },
        ],
    },
    {
        id: 11,
        question: "Cuando algo no sale como esperabas, tu primer movimiento es:",
        answers: [
            { text: "Reencuadrar rápido — busco la siguiente oportunidad", element: "FIRE", modality: "MUTABLE", weight: 2 },
            { text: "Entender qué falló exactamente para no repetirlo", element: "EARTH", modality: "MUTABLE", weight: 2 },
            { text: "Necesito contarlo para procesar — el relato me da perspectiva", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Primero siento el impacto — el análisis viene después", element: "WATER", modality: "MUTABLE", weight: 2 },
        ],
    },
    {
        id: 12,
        question: "¿Cuál describe mejor tu estilo de liderazgo natural?",
        answers: [
            { text: "Asumo el frente cuando hay vacío de liderazgo — es instintivo", element: "FIRE", modality: "CARDINAL", weight: 2 },
            { text: "Lidero con el ejemplo y la consistencia — no con discursos", element: "EARTH", modality: "FIXED", weight: 2 },
            { text: "Facilito — creo las condiciones para que otros brillen", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Lidero desde la comprensión emocional del equipo", element: "WATER", modality: "CARDINAL", weight: 2 },
        ],
    },
    {
        id: 13,
        question: "Tu zona de genialidad más natural es:",
        answers: [
            { text: "Iniciar, inspirar, activar — encender lo que estaba dormido", element: "FIRE", modality: "CARDINAL", weight: 2 },
            { text: "Construir, estabilizar, hacer que algo funcione de verdad", element: "EARTH", modality: "FIXED", weight: 2 },
            { text: "Pensar, conectar, comunicar — ver las redes que otros no ven", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Sentir, sanar, profundizar — ir donde otros no se atreven", element: "WATER", modality: "CARDINAL", weight: 2 },
        ],
    },
    {
        id: 14,
        question: "¿Cómo eres en situaciones de conflicto interpersonal?",
        answers: [
            { text: "Confronto — prefiero el conflicto abierto al silencio cargado", element: "FIRE", modality: "CARDINAL", weight: 2 },
            { text: "Soy mediador — me cuesta el drama y busco estabilizar", element: "EARTH", modality: "FIXED", weight: 2 },
            { text: "Analizo y propongo salidas lógicas — me frustro con lo irracional", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Absorbo la tensión emocional — a veces demasiado", element: "WATER", modality: "FIXED", weight: 2 },
        ],
    },
    {
        id: 15,
        question: "Cuando estás en tu mejor versión, los demás dicen que eres:",
        answers: [
            { text: "Inspirador, valiente, apasionado", element: "FIRE", modality: "CARDINAL", weight: 2 },
            { text: "Confiable, consistente, profundamente práctico", element: "EARTH", modality: "FIXED", weight: 2 },
            { text: "Brillante, agudo, el que siempre tiene la perspectiva fresca", element: "AIR", modality: "MUTABLE", weight: 2 },
            { text: "Profundo, sabio, el que entiende sin que tengas que explicar", element: "WATER", modality: "FIXED", weight: 2 },
        ],
    },
];

// ── Arquetipos finales (combinaciones elemento+modalidad → arquetipo) ──
const ARCHETYPES: Record<string, { name: string; emoji: string; tagline: string; body: string; shadow: string; gift: string; module: string; moduleUrl: string; color: string }> = {
    "FIRE-CARDINAL": { name: "El Pionero", emoji: "🔥", color: "#EF4444", tagline: "Viniste a abrir caminos que otros recorren después", body: "Tu energía más natural es la del que inicia. Cuando hay vacío, tú llenas. Cuando otros dudan, tú actúas. No es imprudencia — es una brújula interna que señala hacia donde hay posibilidad aunque aún no esté mapeada. Tu desafío es quedarte el tiempo suficiente para ver los frutos de lo que enciendes.", shadow: "La impaciencia y el abandono de proyectos antes de que maduren.", gift: "Activar lo que estaba dormido. Ser el primer paso de lo que se convierte en algo grande.", module: "Nodo Norte", moduleUrl: "/mision-de-vida-nodo-norte" },
    "FIRE-FIXED": { name: "El Rey/La Reina", emoji: "👑", color: "#F59E0B", tagline: "Tu presencia transforma cualquier espacio en el que entras", body: "Tienes la energía del fuego pero anclada — no dispersa. Eso te da una autoridad natural que no necesita imponerse: se siente. Sabes quién eres con una certeza que pocos tienen. Tu desafío es usar ese fuego para inspirar, no para proyectar.", shadow: "La necesidad de reconocimiento cuando no llega.", gift: "Inspirar no con lo que dices sino con lo que eres.", module: "Manual del Ser", moduleUrl: "/quien-soy-yo-segun-mi-carta-natal" },
    "FIRE-MUTABLE": { name: "El Explorador", emoji: "🌎", color: "#F97316", tagline: "Tu destino siempre está en el próximo horizonte", body: "Fuego en movimiento constante. Tu inteligencia es adaptativa — absorbes, sintetizas, saltas. Necesitas la expansión como el oxígeno. El peligro es confundir el movimiento con el progreso. Tu mayor trabajo es aprender a llevar el fuego a la profundidad, no solo a la extensión.", shadow: "La huida del compromiso cuando llega la rutina.", gift: "Llevar entusiasmo y visión a cualquier territorio nuevo.", module: "Ventanas de Fortuna", moduleUrl: "/ventanas-de-fortuna-astrologica" },
    "EARTH-CARDINAL": { name: "El Constructor", emoji: "🏛️", color: "#84CC16", tagline: "Lo que tocas queda de pie cuando tú ya no estás", body: "Tienes el don de materializar — de tomar una visión y convertirla en algo con peso, estructura, durabilidad. No teorizas: haces. Tu inteligencia es táctil, práctica, estratégica. El mayor riesgo es confundir el control con la seguridad.", shadow: "El exceso de rigidez cuando el plan no funciona.", gift: "Construir lo que dura más que una vida.", module: "Retorno de Saturno", moduleUrl: "/retorno-de-saturno-calculadora" },
    "EARTH-FIXED": { name: "El Guardián", emoji: "🌳", color: "#22C55E", tagline: "Tu valor más silencioso es la estabilidad que das a los demás", body: "La tierra en su forma más sólida. Eres el ancla en el que otros se apoyan sin que lo vean. Tu confiabilidad no es aburrimiento — es el recurso más escaso en un mundo de promesas incumplidas. Tu desafío es no dar tanto que te vacíes en silencio.", shadow: "La dificultad para cambiar incluso cuando el cambio es necesario.", gift: "Crear la base sobre la que otros crecen.", module: "Bienestar Emocional", moduleUrl: "/bienestar-emocional-y-autoconocimiento" },
    "EARTH-MUTABLE": { name: "El Alquimista", emoji: "⚗️", color: "#10B981", tagline: "Conviertes el caos en orden — y el orden en servicio", body: "Tierra en movimiento. Tienes la capacidad de ver el detalle y el proceso simultáneamente. Eres el que hace que las cosas funcionen, el que pule lo que otros esbozan, el que diseña sistemas donde había confusión. Tu trampa es el perfeccionismo que paraliza.", shadow: "La autocrítica que convierte el intento en fracaso antes de empezar.", gift: "El don de hacer que lo complejo funcione de forma simple.", module: "Patrones en el Amor", moduleUrl: "/por-que-repites-patrones-en-amor" },
    "AIR-CARDINAL": { name: "El Arquitecto", emoji: "⚡", color: "#60A5FA", tagline: "Ves la estructura de los sistemas antes de que existan", body: "Mente que diseña. Tienes la capacidad de ver cómo conectar piezas que aún no están unidas. Tu inteligencia es sistémica y social — no te limitas a pensar: diseñas estructuras que permiten a otros pensar y actuar mejor. Tu reto es descender de las ideas a la implementación.", shadow: "La parálisis del análisis cuando la perfección bloquea la acción.", gift: "Diseñar el futuro con precisión suficiente para que otros puedan construirlo.", module: "Manual del Ser", moduleUrl: "/quien-soy-yo-segun-mi-carta-natal" },
    "AIR-FIXED": { name: "El Inventor", emoji: "💡", color: "#818CF8", tagline: "Tu mente ve lo que el mundo aún no puede ver", body: "Aire anclado en sus principios. Eres el pensador que no se mueve por presión social — tus ideas son tuyas y las defiendes con una lealtad que pocos entienden. Tu inteligencia es innovadora, incluso disruptiva. Tu sombra es la desconexión del presente cuando el futuro te llama tanto.", shadow: "La rigidez intelectual que se cierra cuando algo contradice tu modelo.", gift: "Conceptualizar lo que aún no puede ser visto.", module: "Nodo Norte", moduleUrl: "/mision-de-vida-nodo-norte" },
    "AIR-MUTABLE": { name: "El Mercurio", emoji: "🪄", color: "#A78BFA", tagline: "Eres el puente que hace que mundos distintos se entiendan", body: "Aire en su forma más fluida. Tu mente procesa múltiples idiomas simultáneamente — técnico, emocional, artístico, filosófico. Eso te hace el mejor traductor de realidades que la mayoría percibe como incompatibles. Tu reto es no dispersarte en todos los idiomas sin profundizar en ninguno.", shadow: "La superficialidad cuando hay demasiados canales abiertos al mismo tiempo.", gift: "Crear los puentes de comprensión que nadie más puede construir.", module: "Clima Cósmico", moduleUrl: "/el-clima-cosmico-de-hoy" },
    "WATER-CARDINAL": { name: "El Sanador", emoji: "🌊", color: "#14B8A6", tagline: "Percibes lo que otros no ven — y eso es tu mayor poder", body: "Agua que nace de una fuente propia. Tu sensibilidad no es debilidad — es sonar. Percibes tensiones, verdades no dichas, heridas que nadie nombró. Tienes el don de hacer que las personas se sientan vistas con una profundidad que pocas veces experimentan. Tu reto es que eso te agota — necesitas saber cuándo cerrar el grifo.", shadow: "Absorber lo de los demás hasta no reconocer qué es tuyo.", gift: "La presencia que sana sin que nadie entienda exactamente cómo.", module: "Herida del Alma", moduleUrl: "/herida-del-alma-quiron-astral" },
    "WATER-FIXED": { name: "El Alquimista Oscuro", emoji: "🌑", color: "#8B5CF6", tagline: "Lo que te destruyó también te dio acceso a lo que pocos pueden ver", body: "La transformación más profunda. Aguas subterráneas que no se ven pero modelan todo el paisaje. Has habitado lugares interiores que la mayoría evita — y de ahí has sacado comprensión. Tu inteligencia es la de quien ha pasado por el fuego y sabe distinguir lo esencial de lo accesorio.", shadow: "El control como defensa ante la posibilidad de ser traicionado.", gift: "Comprender y sostener la transformación más radical.", module: "Patrones en el Amor", moduleUrl: "/por-que-repites-patrones-en-amor" },
    "WATER-MUTABLE": { name: "El Visionario Místico", emoji: "🌌", color: "#EC4899", tagline: "No tienes límites claros porque viniste a disolver los que otros no pueden cruzar", body: "Agua en su forma más fluida y expansiva. Tienes acceso a capas de realidad que la mayoría nunca toca — emocional, espiritual, imaginativa. Tu inteligencia es intuitiva y no siempre lineal, lo que puede resultar desconcertante para quienes operan en lo racional. Tu reto es encarnar esa visión en algo concreto.", shadow: "La evasión de la realidad cuando se vuelve demasiado densa.", gift: "Ser puente entre lo visible y lo invisible.", module: "Manual del Ser", moduleUrl: "/quien-soy-yo-segun-mi-carta-natal" },
};

// Calculate archetype from scores
function calculateArchetype(elementScores: Record<Element, number>, modalityScores: Record<Modality, number>) {
    const topElement = (Object.entries(elementScores) as [Element, number][]).sort((a, b) => b[1] - a[1])[0][0];
    const topModality = (Object.entries(modalityScores) as [Modality, number][]).sort((a, b) => b[1] - a[1])[0][0];
    const key = `${topElement}-${topModality}`;
    return ARCHETYPES[key] || ARCHETYPES["AIR-MUTABLE"];
}

const ELEMENT_COLORS: Record<Element, string> = { FIRE: "#EF4444", EARTH: "#22C55E", AIR: "#60A5FA", WATER: "#8B5CF6" };
const ELEMENT_LABELS: Record<Element, string> = { FIRE: "Fuego", EARTH: "Tierra", AIR: "Aire", WATER: "Agua" };

export default function OraculoClient() {
    const [screen, setScreen] = useState<"intro" | "quiz" | "thinking" | "result">("intro");
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [archetype, setArchetype] = useState<typeof ARCHETYPES[string] | null>(null);
    const [dotCount, setDotCount] = useState(0);
    const [showModule, setShowModule] = useState(false);

    useEffect(() => {
        track.moduleEnter("oraculo");
    }, []);

    useEffect(() => {
        if (screen !== "thinking") return;
        const iv = setInterval(() => setDotCount(n => (n + 1) % 4), 400);
        const tm = setTimeout(() => { setScreen("result"); }, 3200);
        return () => { clearInterval(iv); clearTimeout(tm); };
    }, [screen]);

    function handleAnswer(ans: Answer) {
        const next = [...answers, ans];
        setAnswers(next);
        track.ctaClick("oraculo", `q${currentQ + 1}_${ans.element}`);

        if (currentQ + 1 < QUESTIONS.length) {
            setCurrentQ(currentQ + 1);
        } else {
            // Calculate
            const eScore: Record<Element, number> = { FIRE: 0, EARTH: 0, AIR: 0, WATER: 0 };
            const mScore: Record<Modality, number> = { CARDINAL: 0, FIXED: 0, MUTABLE: 0 };
            next.forEach(a => { eScore[a.element] += a.weight; mScore[a.modality] += a.weight; });
            const result = calculateArchetype(eScore, mScore);
            setArchetype(result);
            setScreen("thinking");
            track.resultReceived("oraculo", result.name, Object.values(eScore).reduce((a, b) => a + b, 0));
        }
    }

    const progress = ((currentQ) / QUESTIONS.length) * 100;
    const q = QUESTIONS[currentQ];

    // ── INTRO ──────────────────────────────────────────────────────────
    if (screen === "intro") return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>
                <div style={{ minHeight: "calc(100vh - 5rem)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", background: "radial-gradient(ellipse 60% 60% at 50% 30%, rgba(139,92,246,0.12) 0%, transparent 70%)" }}>
                    <div className="container-sm" style={{ maxWidth: 560, textAlign: "center" }}>
                        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔮</div>
                        <span className="badge" style={{ marginBottom: "1rem", display: "inline-flex" }}>El Oráculo Cósmico</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem" }}>
                            ¿Quién eres realmente?
                        </h1>
                        <p style={{ fontSize: "0.95rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.8, marginBottom: "2rem" }}>
                            15 preguntas. Sin trampa, sin respuesta correcta. <br />
                            Al terminar revelo tu arquetipo psicológico profundo — el patrón que define cómo piensas, sientes, lideras y te relacionas.
                        </p>
                        <div className="glass-card" style={{ padding: "1rem 1.25rem", marginBottom: "2rem", textAlign: "left" }}>
                            {["Duración: 3-4 minutos", "No hay respuestas correctas o incorrectas", "Responde con tu primer impulso — no el ideal", "12 arquetipos posibles — cuál es el tuyo?"].map(t => (
                                <p key={t} style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.4)", margin: "0.3rem 0" }}>✓ {t}</p>
                            ))}
                        </div>
                        <button className="btn-gold" style={{ padding: "0.85rem 2.5rem", fontSize: "1rem", fontWeight: 800 }}
                            onClick={() => { setScreen("quiz"); track.calculateClick("oraculo"); }}>
                            Revelarme ahora →
                        </button>
                    </div>
                </div>
            </main>
            <GlobalFooter />
        </>
    );

    // ── QUIZ ──────────────────────────────────────────────────────────
    if (screen === "quiz") return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh", display: "flex", alignItems: "center", padding: "2rem 1rem", background: "radial-gradient(ellipse 50% 50% at 50% 20%, rgba(99,102,241,0.08) 0%, transparent 70%)" }}>
                <div className="container-sm" style={{ maxWidth: 580, width: "100%" }}>
                    {/* Progress */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                            <span style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.3)" }}>Pregunta {currentQ + 1} de {QUESTIONS.length}</span>
                            <span style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.3)" }}>{Math.round(progress)}%</span>
                        </div>
                        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #7C3AED, #EC4899)", borderRadius: 2, transition: "width 0.4s ease" }} />
                        </div>
                    </div>

                    {/* Question */}
                    <div className="glass-card" style={{ padding: "2rem", marginBottom: "1rem" }}>
                        {q.context && <p style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.25)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{q.context}</p>}
                        <p className="font-display" style={{ fontSize: "clamp(1rem,2vw,1.25rem)", fontWeight: 700, lineHeight: 1.4, color: "#F8F8FF" }}>
                            {q.question}
                        </p>
                    </div>

                    {/* Answers */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                        {q.answers.map((ans, i) => (
                            <button key={i} onClick={() => handleAnswer(ans)}
                                style={{ padding: "1rem 1.25rem", borderRadius: "0.75rem", textAlign: "left", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)", color: "rgba(248,248,255,0.75)", fontSize: "0.85rem", lineHeight: 1.6, cursor: "pointer", transition: "all 0.15s ease" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,58,237,0.4)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "#F8F8FF"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.025)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(248,248,255,0.75)"; }}>
                                <span style={{ color: "rgba(124,58,237,0.7)", marginRight: "0.5rem", fontWeight: 700 }}>{["A", "B", "C", "D"][i]}.</span>
                                {ans.text}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
            <GlobalFooter />
        </>
    );

    // ── THINKING ──────────────────────────────────────────────────────
    if (screen === "thinking") return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ fontSize: "4rem", animation: "pulse 1.5s ease-in-out infinite" }}>🔮</div>
                <p className="font-display" style={{ fontSize: "1.2rem", fontWeight: 700, color: "rgba(248,248,255,0.6)" }}>
                    El Oráculo analiza{".".repeat(dotCount)}
                </p>
                <p style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.2)" }}>Procesando 15 dimensiones de respuesta</p>
            </main>
            <GlobalFooter />
        </>
    );

    // ── RESULT ────────────────────────────────────────────────────────
    if (screen === "result" && archetype) return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>
                <div style={{ minHeight: "calc(100vh - 5rem)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", background: `radial-gradient(ellipse 70% 70% at 50% 30%, ${archetype.color}15 0%, transparent 70%)` }}>
                    <div className="container-sm" style={{ maxWidth: 620, textAlign: "center" }}>

                        {/* Archetype reveal */}
                        <div style={{ fontSize: "4rem", marginBottom: "0.75rem" }}>{archetype.emoji}</div>
                        <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: archetype.color, fontWeight: 700, marginBottom: "0.3rem" }}>Tu arquetipo es</p>
                        <h1 className="font-display" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "#F8F8FF", marginBottom: "0.5rem" }}>
                            {archetype.name}
                        </h1>
                        <p style={{ fontSize: "0.95rem", color: archetype.color, fontWeight: 600, fontStyle: "italic", marginBottom: "2rem", lineHeight: 1.5 }}>
                            &ldquo;{archetype.tagline}&rdquo;
                        </p>

                        {/* Cards */}
                        <div className="glass-card" style={{ padding: "1.75rem", borderColor: archetype.color + "30", marginBottom: "1rem", textAlign: "left" }}>
                            <p style={{ fontSize: "0.88rem", color: "rgba(248,248,255,0.65)", lineHeight: 1.9 }}>{archetype.body}</p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1rem" }}>
                            <div className="glass-card" style={{ padding: "1rem", borderColor: archetype.color + "20", textAlign: "left" }}>
                                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.12em", color: archetype.color, marginBottom: "0.35rem" }}>🎁 Tu don</p>
                                <p style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.55)", lineHeight: 1.7 }}>{archetype.gift}</p>
                            </div>
                            <div className="glass-card" style={{ padding: "1rem", borderColor: "rgba(255,255,255,0.04)", textAlign: "left" }}>
                                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(248,248,255,0.2)", marginBottom: "0.35rem" }}>⚠️ Tu sombra</p>
                                <p style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.35)", lineHeight: 1.7 }}>{archetype.shadow}</p>
                            </div>
                        </div>

                        {/* Module CTA */}
                        {!showModule ? (
                            <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", borderColor: archetype.color + "30", marginBottom: "1rem" }}>
                                <p style={{ fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>🔒 El mapa completo de tu arquetipo</p>
                                <p style={{ fontSize: "0.72rem", color: "rgba(248,248,255,0.35)", marginBottom: "0.85rem", lineHeight: 1.6 }}>
                                    Descubre cómo tu arquetipo se manifiesta en amor, dinero, trabajo y propósito de vida con tu análisis completo.
                                </p>
                                <button className="btn-gold" style={{ fontSize: "0.8rem", fontWeight: 700 }}
                                    onClick={() => { setShowModule(true); track.gateHit("oraculo"); }}>
                                    Ver mi análisis completo →
                                </button>
                            </div>
                        ) : (
                            <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", borderColor: archetype.color + "40", marginBottom: "1rem" }}>
                                <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>¿Quieres profundizar en tu arquetipo {archetype.name}?</p>
                                <a href={archetype.moduleUrl} className="btn-gold" style={{ fontWeight: 700, textDecoration: "none", display: "inline-block", padding: "0.6rem 1.5rem", fontSize: "0.82rem" }}
                                    onClick={() => track.upgradeClick("oraculo", archetype.module)}>
                                    Explorar: {archetype.module} →
                                </a>
                            </div>
                        )}

                        {/* Share + retry */}
                        <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <button onClick={() => { track.shareWhatsApp("oraculo"); window.open(`https://wa.me/?text=${encodeURIComponent(`Soy ${archetype.name} ${archetype.emoji}\n"${archetype.tagline}"\n\n¿Cuál es tu arquetipo? → crystal-cosmos.vercel.app/quien-eres-realmente`)}`, "_blank"); }}
                                style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                                💬 Compartir en WhatsApp
                            </button>
                            <button onClick={() => { setScreen("intro"); setCurrentQ(0); setAnswers([]); setArchetype(null); setShowModule(false); }}
                                style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(248,248,255,0.3)", fontSize: "0.78rem", cursor: "pointer" }}>
                                Repetir test
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <GlobalFooter />
        </>
    );

    return null;
}
