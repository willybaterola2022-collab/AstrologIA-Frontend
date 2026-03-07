"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";

// Current planetary positions — calculated from known ephemeris data
// For daily content we use CosmicToday engine (same as homepage widget)
// Full precision requires backend — free users get Sun+Moon daily reading

const MOON_PHASES = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
const MOON_NAMES = ["Nueva", "Creciente", "Cuarto Creciente", "Gibosa Creciente",
    "Llena", "Gibosa Menguante", "Cuarto Menguante", "Menguante"];

function getMoonPhase(date: Date): { emoji: string; name: string; percent: number } {
    const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
    let jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4)
        + Math.floor(275 * month / 9) + day + 1721013.5;
    const daysSinceNew = (jd - 2451549.5) % 29.53058867;
    const normalized = ((daysSinceNew % 29.53) + 29.53) % 29.53;
    const idx = Math.floor(normalized / 3.69) % 8;
    const percent = Math.round((normalized / 29.53) * 100);
    return { emoji: MOON_PHASES[idx], name: MOON_NAMES[idx], percent };
}

function getSunSign(date: Date): string {
    const m = date.getMonth() + 1, d = date.getDate();
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

// Daily energy archetype: cycles through planetary energies based on day number
function getDailyPlanet(date: Date): { planet: string; emoji: string; energy: string; color: string } {
    const planets = [
        { planet: "Luna", emoji: "🌙", energy: "Día de introspección y emociones", color: "#A855F7" },
        { planet: "Marte", emoji: "♂️", energy: "Día de acción y determinación", color: "#EF4444" },
        { planet: "Mercurio", emoji: "☿", energy: "Día de comunicación y ideas", color: "#60A5FA" },
        { planet: "Júpiter", emoji: "♃", energy: "Día de expansión y abundancia", color: "#F59E0B" },
        { planet: "Venus", emoji: "♀️", energy: "Día de amor y creación", color: "#EC4899" },
        { planet: "Saturno", emoji: "♄", energy: "Día de disciplina y estructura", color: "#6B7280" },
        { planet: "Sol", emoji: "☀️", energy: "Día de liderazgo y expresión", color: "#FCD34D" },
    ];
    const dayNum = Math.floor(date.getTime() / 86400000);
    return planets[dayNum % 7];
}

// Daily messages per sign — 12 interpretaciones por cada signo solar (curated slots)
const DAILY_MESSAGES: Record<string, {
    emoji: string; energy: string; love: string; money: string; body: string;
    affirmation: string; challenge: string; element: string; color: string;
}> = {
    Aries: { emoji: "♈", element: "Fuego", color: "#EF4444", energy: "La energía de hoy impulsa tu autonomía. Es un momento de tomar iniciativa sin esperar autorización de nadie.", love: "Las relaciones se benefician cuando expresas tu deseo directamente, sin juegos. Di lo que quieres.", money: "Hoy es buen día para iniciar algo nuevo en lo económico. La energía de acción está de tu lado.", body: "Activa el cuerpo con movimiento intenso antes del mediodía. El fuego que no se mueve, quema.", affirmation: "Actúo desde mi centro y confío en mi impulso.", challenge: "El reto de hoy: escucha antes de reaccionar." },
    Tauro: { emoji: "♉", element: "Tierra", color: "#10B981", energy: "La energía de hoy te pide arraigo. Conecta con lo que es tuyo: tu cuerpo, tu tiempo, tu valor.", love: "El amor se nutre de presencia, no de palabras. Muestra tu afecto de forma concreta y tangible.", money: "Los recursos fluyen cuando valoras lo que ya tienes. Gratitud antes de expansión.", body: "Come con conciencia. Tu cuerpo hoy pide calidad, no cantidad.", affirmation: "Me permito recibir con la misma gracia con que doy.", challenge: "El reto de hoy: soltar el control sobre lo que no puedes sostener." },
    Géminis: { emoji: "♊", element: "Aire", color: "#60A5FA", energy: "Tu mente está encendida. Las ideas fluyen — es un día excepcional para comunicar, escribir y conectar.", love: "Una conversación profunda puede renovar lo que sentías estancado. Habla, escucha, juega.", money: "La información es tu moneda hoy. Aprende algo nuevo sobre finanzas o negocia con ligereza.", body: "Respira conscientemente. Tus pulmones son los órganos de la curiosidad — ábrelos.", affirmation: "Mi mente es un instrumento de claridad y conexión.", challenge: "El reto de hoy: aterriza una idea en vez de coleccionar más." },
    Cáncer: { emoji: "♋", element: "Agua", color: "#A855F7", energy: "La energía de hoy activa tu mundo emocional. Lo que sientes es información — no te resistas.", love: "El amor necesita seguridad. Ofrece contención y pide lo que necesitas sin rodeos.", money: "Las decisiones económicas de hoy se benefician de la intuición. Confía en lo que sientes antes de analizar.", body: "Cuida tu estómago — órgano de la emoción en Cáncer. Aliméntate con alimentos que te nutran el alma.", affirmation: "Mis emociones son mi fuerza, no mi debilidad.", challenge: "El reto de hoy: actúa desde el amor y no desde el miedo al abandono." },
    Leo: { emoji: "♌", element: "Fuego", color: "#F59E0B", energy: "Tu presencia irradia hoy. Las personas te ven — úsalo para inspirar, no para impresionar.", love: "El amor que buscas empieza por amarte a ti. Tu luz auténtica atrae lo que es real.", money: "Tu carisma es un activo hoy. Las oportunidades llegan a través de tu visibilidad.", body: "Cuida tu corazón — literalmente. Ejercicio cardiovascular y sol con moderación.", affirmation: "Mi singularidad es mi mayor contribución al mundo.", challenge: "El reto de hoy: lidera desde el servicio, no desde el ego." },
    Virgo: { emoji: "♍", element: "Tierra", color: "#84CC16", energy: "La energía de hoy premia el orden y el servicio. Lo que haces con precisión hoy tiene impacto real.", love: "Muestra amor a través de actos concretos de cuidado. Tu pareja se siente amada cuando te ven sus necesidades.", money: "Analiza tus finanzas con detalle hoy. Los pequeños ajustes generan grandes resultados.", body: "Tu sistema digestivo es tu termómetro de estrés. Aliméntate limpio y respira despacio.", affirmation: "Sirvo con excelencia sin perderme a mí en el servicio.", challenge: "El reto de hoy: acepta la imperfección como parte del proceso." },
    Libra: { emoji: "♎", element: "Aire", color: "#EC4899", energy: "La armonía y la belleza son tus aliadas hoy. Busca el equilibrio en cada decisión que tomas.", love: "Las relaciones piden diálogo honesto. La diplomacia no es esconder lo que sientes — es decirlo con gracia.", money: "Las asociaciones económicas son favorables hoy. El dinero también fluye en la colaboración.", body: "Tu sistema renal refleja cómo equilibras las relaciones. Bebe mucha agua hoy.", affirmation: "Elijo la paz que viene de la honestidad, no del silencio.", challenge: "El reto de hoy: toma una decisión sin buscar la aprobación de todos." },
    Escorpio: { emoji: "♏", element: "Agua", color: "#7C3AED", energy: "Las profundidades te llaman. Hoy es un día para ir a lo que importa, sin medias tintas.", love: "El deseo y la vulnerabilidad son dos caras de lo mismo. Permite ser visto en tu verdad más honesta.", money: "Dinero y poder están relacionados hoy. Una transformación financiera profunda es posible — no tengas miedo.", body: "Órganos reproductivos y el sistema de eliminación necesitan atención. Detox emocional y físico.", affirmation: "Mi vulnerabilidad es la puerta a mi mayor potencia.", challenge: "El reto de hoy: deja ir lo que ya terminó aunque todavía duela." },
    Sagitario: { emoji: "♐", element: "Fuego", color: "#F97316", energy: "La libertad y la expansión vibran alto hoy. Tu alma pide más horizonte — no le digas que no.", love: "El amor que perdura es el que da espacio. Ama sin poseer y conecta desde la autenticidad.", money: "Las oportunidades llegan de lejos hoy — internacional, multicultural, amplio.", body: "Tus caderas y muslos guardan la energía reprimida. Muévete, baila, estira.", affirmation: "Confío en el camino aunque no vea todavía el destino.", challenge: "El reto de hoy: comprométete con algo antes de saltar al próximo horizonte." },
    Capricornio: { emoji: "♑", element: "Tierra", color: "#6B7280", energy: "La disciplina con maestría es tu superpoder hoy. Lo que construyes con paciencia dura décadas.", love: "El amor se construye, no se improvisa. Pequeños actos de compromiso sostenido dicen más que grandes gestos.", money: "Hoy es el día del trabajo profundo. El esfuerzo que pones hoy tiene retorno compuesto.", body: "Tus rodillas y huesos necesitan movimiento consciente. No fuerces — construye con consistencia.", affirmation: "Mi éxito es la suma acumulada de mis elecciones de hoy.", challenge: "El reto de hoy: permite que alguien te ayude sin sentirlo como debilidad." },
    Acuario: { emoji: "♒", element: "Aire", color: "#38BDF8", energy: "Tu visión del futuro es necesaria hoy. El mundo necesita tu perspectiva diferente — compártela.", love: "Las relaciones se renuevan con ideas frescas. Sorprende a quien amas con algo inesperado.", money: "La innovación tecnológica o social puede abrir oportunidades financieras hoy.", body: "Tus pantorrillas y tobillos reflejan tu libertad de movimiento. Haz algo que rompa tu rutina física.", affirmation: "Mi diferencia es mi contribución más valiosa a la humanidad.", challenge: "El reto de hoy: conecta emocionalmente, no solo intelectualmente." },
    Piscis: { emoji: "♓", element: "Agua", color: "#8B5CF6", energy: "La intuición es tu brújula hoy. Lo invisible es tan real como lo tangible — confía en lo que sientes.", love: "El amor espiritual y romántico se tocan hoy. Permítete soñar con lo que tu corazón verdaderamente anhela.", money: "La creatividad puede generar ingresos inesperados. Confía en la inspiración.", body: "Pies y sistema linfático necesitan atención. Camina descalzo, baño de sales, música sanadora.", affirmation: "Me permito disolver en el Amor más grande que yo.", challenge: "El reto de hoy: pon límites desde el amor, no desde la huida." },
};

const SIGN_EMOJIS: Record<string, string> = {
    Aries: "♈", Tauro: "♉", Géminis: "♊", Cáncer: "♋", Leo: "♌", Virgo: "♍",
    Libra: "♎", Escorpio: "♏", Sagitario: "♐", Capricornio: "♑", Acuario: "♒", Piscis: "♓"
};

export default function ClimaCosmicoClient() {
    const today = new Date();
    const moonPhase = getMoonPhase(today);
    const dailyPlanet = getDailyPlanet(today);
    const currentSunSign = getSunSign(today);

    const [selectedSign, setSelectedSign] = useState<string>("");
    const [reading, setReading] = useState<typeof DAILY_MESSAGES["Aries"] | null>(null);
    const [showPremiumGate, setShowPremiumGate] = useState(false);

    const dateStr = today.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const signList = Object.keys(DAILY_MESSAGES);

    function handleSignSelect(sign: string) {
        setSelectedSign(sign);
        setReading(DAILY_MESSAGES[sign]);
        setShowPremiumGate(false);
    }

    useEffect(() => {
        // Auto-select based on today's Sun sign for demo
        handleSignSelect(currentSunSign);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const msg = reading;
    const elemColor = msg?.color || "#A855F7";

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>

                {/* HERO */}
                <section className="section-pad" style={{ textAlign: "center", background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(124,58,237,0.12) 0%, transparent 70%)" }}>
                    <div className="container-sm" style={{ maxWidth: 720 }}>
                        <span className="badge" style={{ marginBottom: "1rem", display: "inline-flex" }}>🌤️ Clima Cósmico · {dateStr}</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1rem" }}>
                            ¿Qué le está pasando al cielo hoy?
                        </h1>
                        <p style={{ fontSize: "1rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 2.5rem" }}>
                            Cada día tiene una vibración planetaria distinta. Descubre el clima cósmico que te afecta hoy y cómo aprovechar su energía al máximo.
                        </p>

                        {/* COSMIC STATUS BAR */}
                        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "center", marginBottom: "2rem" }}>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", marginBottom: "0.2rem" }}>Fase Lunar</p>
                                <p style={{ fontSize: "1.4rem" }}>{moonPhase.emoji}</p>
                                <p style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.5)" }}>{moonPhase.name} · {moonPhase.percent}%</p>
                            </div>
                            <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", marginBottom: "0.2rem" }}>Planeta del Día</p>
                                <p style={{ fontSize: "1.4rem" }}>{dailyPlanet.emoji}</p>
                                <p style={{ fontSize: "0.7rem", color: dailyPlanet.color }}>{dailyPlanet.planet}</p>
                            </div>
                            <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", marginBottom: "0.2rem" }}>Sol Transitando</p>
                                <p style={{ fontSize: "1.4rem" }}>{SIGN_EMOJIS[currentSunSign]}</p>
                                <p style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.5)" }}>{currentSunSign}</p>
                            </div>
                            <div style={{ width: 1, background: "rgba(255,255,255,0.06)" }} />
                            <div style={{ textAlign: "center", maxWidth: 160 }}>
                                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", marginBottom: "0.2rem" }}>Energía general</p>
                                <p style={{ fontSize: "0.72rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.5 }}>{dailyPlanet.energy}</p>
                            </div>
                        </div>

                        {/* SIGN SELECTOR */}
                        <p style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.75rem" }}>Selecciona tu signo solar para tu lectura personal de hoy:</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(72px,1fr))", gap: "0.5rem", maxWidth: 600, margin: "0 auto 2rem" }}>
                            {signList.map(s => {
                                const isActive = selectedSign === s;
                                const col = DAILY_MESSAGES[s].color;
                                return (
                                    <button key={s} onClick={() => handleSignSelect(s)} style={{
                                        padding: "0.5rem 0.35rem", borderRadius: "0.5rem",
                                        border: `1px solid ${isActive ? col : "rgba(255,255,255,0.06)"}`,
                                        background: isActive ? col + "20" : "rgba(255,255,255,0.02)",
                                        cursor: "pointer", textAlign: "center", transition: "all 0.2s"
                                    }}>
                                        <div style={{ fontSize: "1rem" }}>{DAILY_MESSAGES[s].emoji}</div>
                                        <div style={{ fontSize: "0.58rem", color: isActive ? col : "rgba(248,248,255,0.35)", fontWeight: isActive ? 700 : 400, marginTop: "0.1rem" }}>{s}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* READING */}
                {msg && (
                    <section className="section-pad" style={{ background: "rgba(0,0,0,0.15)" }}>
                        <div className="container-sm" style={{ maxWidth: 700 }}>

                            {/* Main energy card */}
                            <div className="glass-card" style={{ padding: "2rem", borderColor: elemColor + "35", marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: elemColor, borderRadius: "50%", filter: "blur(100px)", opacity: 0.08 }} />
                                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
                                    <span style={{ fontSize: "2.5rem" }}>{msg.emoji}</span>
                                    <div>
                                        <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: elemColor, fontWeight: 700 }}>Lectura de hoy · {selectedSign}</p>
                                        <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 800 }}>Clima Personal</h2>
                                        <p style={{ fontSize: "0.72rem", color: "rgba(248,248,255,0.35)" }}>Elemento {msg.element}</p>
                                    </div>
                                </div>

                                {/* Energy */}
                                <div style={{ padding: "1rem 1.25rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.75rem", borderLeft: `3px solid ${elemColor}`, marginBottom: "1.25rem" }}>
                                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: elemColor, marginBottom: "0.35rem" }}>✦ Energía del día</p>
                                    <p style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.65)", lineHeight: 1.75 }}>{msg.energy}</p>
                                </div>

                                {/* 3-column: love, money, body */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                                    {[
                                        { label: "💗 Amor", text: msg.love },
                                        { label: "💰 Dinero", text: msg.money },
                                        { label: "🔴 Cuerpo", text: msg.body },
                                    ].map(d => (
                                        <div key={d.label} style={{ padding: "0.85rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.6rem" }}>
                                            <p style={{ fontSize: "0.68rem", fontWeight: 700, marginBottom: "0.35rem" }}>{d.label}</p>
                                            <p style={{ fontSize: "0.72rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.6 }}>{d.text}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Affirmation */}
                                <div style={{ padding: "1rem 1.25rem", background: `${elemColor}10`, borderRadius: "0.75rem", border: `1px solid ${elemColor}25`, marginBottom: "1.25rem", textAlign: "center" }}>
                                    <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: elemColor, marginBottom: "0.35rem" }}>✦ Afirmación de hoy</p>
                                    <p style={{ fontSize: "0.9rem", fontWeight: 600, fontStyle: "italic", color: "#F8F8FF", lineHeight: 1.6 }}>&ldquo;{msg.affirmation}&rdquo;</p>
                                </div>

                                {/* Challenge */}
                                <div style={{ padding: "0.75rem 1rem", background: "rgba(255,255,255,0.02)", borderRadius: "0.6rem", borderLeft: "2px solid rgba(255,255,255,0.1)" }}>
                                    <p style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.6 }}>⚡ {msg.challenge}</p>
                                </div>
                            </div>

                            {/* PREMIUM GATE — Full transit reading */}
                            {!showPremiumGate ? (
                                <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center", borderColor: "rgba(245,158,11,0.2)", marginBottom: "1.5rem" }}>
                                    <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>🔒 Lectura completa de tránsitos del día</p>
                                    <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.4)", marginBottom: "1rem", lineHeight: 1.6 }}>
                                        Con tu carta natal completa, Malka detecta qué planetas te impactan hoy con precisión de arc-segundo — Saturno en tu Casa 10, Marte activando tu Venus natal...
                                    </p>
                                    <button className="btn-gold" onClick={() => setShowPremiumGate(true)} style={{ fontWeight: 700, fontSize: "0.82rem" }}>
                                        Ver mis tránsitos exactos →
                                    </button>
                                </div>
                            ) : (
                                <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center", borderColor: "rgba(245,158,11,0.4)", marginBottom: "1.5rem" }}>
                                    <p style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.5rem" }}>✨ Activa tu Plan Esencial</p>
                                    <p style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.5)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                                        Tu carta natal completa + tránsitos diarios personalizados + alertas cuando algo importante llega a tu vida.
                                    </p>
                                    <a href="/precios" className="btn-gold" style={{ fontWeight: 700, textDecoration: "none", display: "inline-block", padding: "0.6rem 1.5rem" }}>
                                        Ver planes desde €9/mes →
                                    </a>
                                </div>
                            )}

                            {/* Share */}
                            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                                <button
                                    onClick={() => {
                                        const text = `El clima cósmico de hoy para ${selectedSign}: ${msg.affirmation} 🌟 Ver el tuyo: crystal-cosmos.vercel.app/el-clima-cosmico-de-hoy`;
                                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                                    }}
                                    style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
                                >
                                    💬 Compartir en WhatsApp
                                </button>
                                <button
                                    onClick={() => handleSignSelect(currentSunSign)}
                                    style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(248,248,255,0.4)", fontSize: "0.78rem", cursor: "pointer" }}
                                >
                                    ↑ Mi signo de hoy ({currentSunSign})
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* MOON CALENDAR — next 7 days */}
                <section className="section-pad">
                    <div className="container-sm">
                        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.3rem,2vw,1.8rem)", fontWeight: 700, marginBottom: "0.4rem" }}>Próximos 7 días</h2>
                            <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.35)" }}>El clima cósmico de la semana — planifica tu energía</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.5rem" }}>
                            {Array.from({ length: 7 }, (_, i) => {
                                const d = new Date(today);
                                d.setDate(today.getDate() + i);
                                const moon = getMoonPhase(d);
                                const dp = getDailyPlanet(d);
                                const isToday = i === 0;
                                return (
                                    <div key={i} style={{
                                        padding: "0.6rem 0.3rem", borderRadius: "0.6rem", textAlign: "center",
                                        border: `1px solid ${isToday ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.05)"}`,
                                        background: isToday ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.02)"
                                    }}>
                                        <p style={{ fontSize: "0.55rem", color: isToday ? "#A855F7" : "rgba(248,248,255,0.3)", marginBottom: "0.2rem", fontWeight: isToday ? 700 : 400 }}>
                                            {isToday ? "Hoy" : d.toLocaleDateString("es-ES", { weekday: "short" })}
                                        </p>
                                        <p style={{ fontSize: "0.9rem" }}>{moon.emoji}</p>
                                        <p style={{ fontSize: "0.9rem" }}>{dp.emoji}</p>
                                        <p style={{ fontSize: "0.5rem", color: dp.color, marginTop: "0.1rem" }}>{dp.planet}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <p style={{ textAlign: "center", fontSize: "0.65rem", color: "rgba(248,248,255,0.2)", marginTop: "0.75rem" }}>
                            🔒 La lectura personalizada de cada día — en tu Plan Esencial
                        </p>
                    </div>
                </section>

            </main>
            <GlobalFooter />
        </>
    );
}
