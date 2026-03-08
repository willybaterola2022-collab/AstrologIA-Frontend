"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";
import { track, initScrollTracker } from "@/lib/analytics";

// ══════════════════════════════════════════════════════════
// KABBALAH ASTROLÓGICA — Árbol de la Vida Personalizado
// URL: /kabbalah-y-tu-arbol-de-la-vida
// Fuente: Sefer Yetzirah (Ariel Kaplan) + Zohar + mapeo astro-Kabbalístico
// Calcula: Sefirah rectora según signo solar + sendero del alma 
// ══════════════════════════════════════════════════════════

const SIGNS = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];

// Las 10 Sefirot del Árbol de la Vida
const SEFIROT: Record<string, { hebrew: string; meaning: string; planet: string; color: string; dimension: string; body: string; shadow: string; gift: string; prayer: string }> = {
    Kether: {
        hebrew: "כֶּתֶר", meaning: "Corona",
        planet: "Primer Motor / Ain Sof",
        color: "#FFFFFF",
        dimension: "La unidad primordial — el punto antes del comienzo",
        body: "Kether es la corona del Árbol, el punto de contacto con lo Infinito. Es la chispa de conciencia antes de cualquier forma, el instante antes del pensamiento, la presencia pura antes de la identificación. Quien conecta con Kether toca la unidad que precede a toda dualidad.",
        shadow: "La ilusión de separación de la fuente divina",
        gift: "La capacidad de experimentar la unidad cuando los demás solo ven fragmentos",
        prayer: "Que la Corona de lo Infinito descanse sobre todo lo que hago",
    },
    Chokmah: {
        hebrew: "חָכְמָה", meaning: "Sabiduría",
        planet: "Urano / Zodíaco",
        color: "#C0C0C0",
        dimension: "El primer destello de conciencia — la Sabiduría divina primordial",
        body: "Chokmah es el primer destello de la luz divina — el Yang cósmico, la chispa de intuición pura antes de que se organice en pensamiento. Es la sabiduría que aparece de forma instantánea, no aprendida sino revelada. El impulso creador original.",
        shadow: "La incapacidad de bajar la visión a la realidad cotidiana",
        gift: "El acceso a verdades que llegan completas, sin proceso lógico",
        prayer: "Que la Sabiduría divina fluya a través de mi intuición",
    },
    Binah: {
        hebrew: "בִּינָה", meaning: "Comprensión",
        planet: "Saturno",
        color: "#2D1B4E",
        dimension: "La Gran Madre — el útero del universo que da forma a todo lo que existe",
        body: "Binah es la comprensión profunda — el Yin divino que recibe la chispa de Chokmah y le da forma. Es la inteligencia que organiza, que con-tiene, que gestiona. Saturno, su planeta regente, da la estructura que permite que la luz se manifieste en el tiempo.",
        shadow: "El exceso de forma que sofoca la esencia",
        gift: "La capacidad de dar forma estable a lo que todavía no existe",
        prayer: "Que la Comprensión me muestre la forma que lo invisible necesita tomar",
    },
    Chesed: {
        hebrew: "חֶסֶד", meaning: "Misericordia / Amor",
        planet: "Júpiter",
        color: "#1E40AF",
        dimension: "El amor que fluye sin condiciones — la abundancia de lo divino",
        body: "Chesed es el amor expansivo, la gracia divina que fluye sin pedir nada a cambio. Júpiter, su planeta regente, expande todo lo que toca. En Chesed aprendemos que la verdadera abundancia no se acumula — se ofrece. El liderazgo natural que nace del corazón.",
        shadow: "El exceso de bondad que no pone límites cuando son necesarios",
        gift: "La capacidad de dar con generosidad genuina sin llevar la cuenta",
        prayer: "Que el Amor divino fluya a través de cada acción que emprendo",
    },
    Geburah: {
        hebrew: "גְּבוּרָה", meaning: "Poder / Justicia",
        planet: "Marte",
        color: "#B91C1C",
        dimension: "La fortaleza que poda lo que ya no sirve — la justicia sagrada",
        body: "Geburah es el otro lado del amor de Chesed: la fortaleza que sabe cuándo cortar, cuándo poner límites, cuándo la compasión requiere decir no. Marte, su regente, da el valor para la acción difícil. Sin Geburah, Chesed se vuelve codependencia.",
        shadow: "El poder que se vuelve crueldad cuando se desconecta del amor",
        gift: "La capacidad de actuar con decisión cuando otros dudan por temor",
        prayer: "Que la Fortaleza divina me dé el valor de actuar con justicia",
    },
    Tiferet: {
        hebrew: "תִּפְאֶרֶת", meaning: "Belleza / Armonía",
        planet: "Sol",
        color: "#EAB308",
        dimension: "El corazón del Árbol — la armonía que equilibra todos los opuestos",
        body: "Tiferet es el centro del Árbol de la Vida — el punto donde Misericordia y Fortaleza se equilibran en Belleza. El Sol, su regente, ilumina desde el centro. Tiferet es el yo auténtico, el corazón que late en el centro de toda experiencia. Quien vive desde Tiferet vive desde su verdad más honda.",
        shadow: "La vanidad que confunde la forma con la esencia",
        gift: "La capacidad de integrar los opuestos y mantenerse en equilibrio desde el corazón",
        prayer: "Que la Belleza divina se exprese a través del centro de mi ser",
    },
    Netzah: {
        hebrew: "נֶצַח", meaning: "Victoria / Eternidad",
        planet: "Venus",
        color: "#15803D",
        dimension: "El deseo sagrado — la fuerza que impulsa la creación a través del amor y la belleza",
        body: "Netzah es la fuerza del deseo en su forma más pura — el impulso creativo que nace del amor a la belleza, a la vida, al placer sagrado. Venus, su planeta, rige la atracción. Netzah nos recuerda que el deseo no es opuesto a lo espiritual — es el motor de toda creación.",
        shadow: "El deseo que se vuelve compulsión cuando pierde su conexión con lo sagrado",
        gift: "La capacidad de crear belleza a partir del amor genuino por la vida",
        prayer: "Que la Victoria divina se manifieste a través de todo lo que amo",
    },
    Hod: {
        hebrew: "הוֹד", meaning: "Gloria / Majestad",
        planet: "Mercurio",
        color: "#D97706",
        dimension: "La inteligencia que da forma al mundo — el lenguaje del universo",
        body: "Hod es la majestad de la mente divina — la capacidad de nombrar, organizar y comunicar lo que existe. Mercurio, su regente, preside el intercambio. En Hod el pensamiento se vuelve puente entre lo invisible y lo visible, entre el individuo y el colectivo.",
        shadow: "La inteligencia que se vuelve manipulación cuando pierde la integridad",
        gift: "La capacidad de dar forma verbal y conceptual a verdades que otros solo sienten",
        prayer: "Que la Gloria divina se manifieste en cada palabra que pronuncio",
    },
    Yesod: {
        hebrew: "יְסוֹד", meaning: "Fundamento",
        planet: "Luna",
        color: "#7C3AED",
        dimension: "El puente entre lo visible y lo invisible — la memoria sagrada del alma",
        body: "Yesod es el fundamento que conecta el mundo visible (Malkuth) con los mundos superiores. La Luna, su regente, gobierna los ritmos, los sueños, la memoria inconsciente. Yesod es el inconsciente colectivo en términos jungianos — el repositorio de todo lo que fue.",
        shadow: "La ilusión — confundir el reflejo con la realidad",
        gift: "La capacidad de percibir verdades a través de los sueños, la intuición y el cuerpo",
        prayer: "Que el Fundamento divino conecte mi vida cotidiana con lo eterno",
    },
    Malkuth: {
        hebrew: "מַלְכוּת", meaning: "Reino",
        planet: "Tierra",
        color: "#92400E",
        dimension: "El punto de manifestación — donde lo divino toca lo material",
        body: "Malkuth es el Reino de la materia — el punto donde todo el Árbol de la Vida se materializa en la experiencia cotidiana. La Tierra es su símbolo. Aquí el cuerpo, las relaciones y el trabajo son sagrados. Malkuth nos enseña que lo divino no está alejado de la vida diaria.",
        shadow: "El materialismo que pierde la conexión con las raíces espirituales",
        gift: "La capacidad de encontrar lo sagrado en cada aspecto de la vida ordinaria",
        prayer: "Que el Reino divino se manifieste en mi vida cotidiana",
    },
};

// Mapeo Signo → Sefirah rectora + sendero kármico
const SIGN_KABBALAH: Record<string, { sefira: string; path: string; letterHebrew: string; pathName: string; tikun: string; meditation: string }> = {
    Aries: { sefira: "Geburah", path: "Sendero del Fuego", letterHebrew: "ה (He)", pathName: "Ventana — la visión que transforma", tikun: "Aprender a actuar con decisión sin crueldad", meditation: "Siéntate en silencio. Visualiza una espada de luz que corta solo lo que ya no sirve. Nada más." },
    Tauro: { sefira: "Netzah", path: "Sendero de la Tierra", letterHebrew: "ו (Vav)", pathName: "Clavo — la conexión que sostiene", tikun: "Aprender a amar sin poseer", meditation: "Coloca tus manos en la tierra o en una superficie. Siente el peso de tu cuerpo. Esto es sagrado." },
    "Géminis": { sefira: "Hod", path: "Sendero del Aire", letterHebrew: "ז (Zayin)", pathName: "Espada — la mente que discrimina", tikun: "Aprender a hablar la verdad completa, no solo la parte conveniente", meditation: "Escribe sin filtro durante 5 minutos. La mente divina habla a través de tu pluma." },
    "Cáncer": { sefira: "Binah", path: "Sendero del Agua", letterHebrew: "ח (Chet)", pathName: "Vallado — la protección sagrada", tikun: "Aprender a contener sin atrapar", meditation: "Visualiza el útero cósmico — el espacio que contiene toda posibilidad. Tú eres ese espacio." },
    Leo: { sefira: "Tiferet", path: "Sendero del Fuego fijo", letterHebrew: "ט (Tet)", pathName: "Serpiente — la transformación desde el centro", tikun: "Aprender a brillar sin oscurecer a los demás", meditation: "Lleva la atención al centro de tu pecho. Respira desde ahí. El Sol ya está dentro." },
    Virgo: { sefira: "Hod", path: "Sendero de la Tierra", letterHebrew: "י (Yod)", pathName: "Mano — el servicio consciente", tikun: "Aprender que el servicio perfecto nace del amor, no de la culpa", meditation: "Haz algo pequeño hoy con atención total. El servicio es la meditación más alta." },
    Libra: { sefira: "Netzah", path: "Sendero del Aire fijo", letterHebrew: "ל (Lamed)", pathName: "Aguijón — el aprendizaje que transforma", tikun: "Aprender que la verdadera armonía requiere tomar posición", meditation: "Sostén un objeto en cada mano. Siente el equilibrio. El equilibrio no es inercia — es tensión activa." },
    Escorpio: { sefira: "Geburah", path: "Sendero del Agua fijo", letterHebrew: "נ (Nun)", pathName: "Pez — lo que vive en las profundidades", tikun: "Aprender a transformar sin destruir", meditation: "Visualiza descender a las aguas más profundas. Allí hay luz. Es tuya." },
    Sagitario: { sefira: "Chesed", path: "Sendero del Fuego", letterHebrew: "ס (Samech)", pathName: "Apoyo — la gracia que sostiene", tikun: "Aprender a comprometerse con lo que el corazón ya eligió", meditation: "Apunta una flecha de luz desde tu corazón al horizonte. ¿Adónde la mandas?" },
    Capricornio: { sefira: "Binah", path: "Sendero de la Tierra", letterHebrew: "ע (Ayin)", pathName: "Ojo — la visión que construye", tikun: "Aprender que el éxito sin amor no es éxito", meditation: "Visualiza una montaña que tardó millones de años en formarse. Tú también estás siendo formado." },
    Acuario: { sefira: "Chokmah", path: "Sendero del Aire", letterHebrew: "צ (Tzadi)", pathName: "Anzuelo — la sabiduría que pesca lo esencial", tikun: "Aprender a encarnar la visión en lugar de solo sostenerla", meditation: "Pregúntate: si el universo pudiera hablar a través de mí hoy, ¿qué diría?" },
    Piscis: { sefira: "Kether", path: "Sendero del Agua", letterHebrew: "ק (Kof)", pathName: "Occipital — el acceso al infinito", tikun: "Aprender a vivir entre mundos sin perderse en ninguno", meditation: "Siéntate junto al agua o visualízala. Deja que los bordes de tu identidad se disuelvan por un momento. Eso es meditación." },
};

export default function KabbalahClient() {
    const [selectedSign, setSelectedSign] = useState("");
    const [activeSefirah, setActiveSefirah] = useState("Tiferet");
    const [showGate, setShowGate] = useState(false);

    useEffect(() => {
        track.moduleEnter("kabbalah");
        const cleanup = initScrollTracker("kabbalah");
        return cleanup;
    }, []);

    const kabData = selectedSign ? SIGN_KABBALAH[selectedSign] : null;
    const sefiData = SEFIROT[activeSefirah];

    const SEFIROT_NAMES = Object.keys(SEFIROT);
    const sefiColors: Record<string, string> = { Kether: "#FFFFFF", Chokmah: "#C0C0C0", Binah: "#2D1B4E", Chesed: "#1E40AF", Geburah: "#B91C1C", Tiferet: "#EAB308", Netzah: "#15803D", Hod: "#D97706", Yesod: "#7C3AED", Malkuth: "#92400E" };

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>

                {/* HERO */}
                <section className="section-pad" style={{ textAlign: "center", background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(30,64,175,0.12) 0%, transparent 70%)" }}>
                    <div className="container-sm" style={{ maxWidth: 700 }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✡️</div>
                        <span className="badge" style={{ marginBottom: "1rem", display: "inline-flex", background: "rgba(30,64,175,0.1)", borderColor: "rgba(30,64,175,0.3)", color: "#93C5FD" }}>Kabbalah Astrológica</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.75rem" }}>
                            El mapa del alma<br />según el Árbol de la Vida
                        </h1>
                        <p style={{ fontSize: "0.9rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.8, maxWidth: 540, margin: "0 auto 2rem" }}>
                            La Kabbalah astrológica conecta las 10 Sefirot del Árbol de la Vida con los signos zodiacales. Tu signo solar determina tu Sefirah rectora — el canal energético principal a través del cual tu alma se manifiesta en esta encarnación.
                        </p>

                        {/* Sign selector */}
                        <div style={{ maxWidth: 360, margin: "0 auto" }}>
                            <select value={selectedSign} onChange={e => { setSelectedSign(e.target.value); track.calculateClick("kabbalah", e.target.value); }}
                                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid rgba(30,64,175,0.3)", background: "rgba(30,64,175,0.06)", color: selectedSign ? "#F8F8FF" : "rgba(248,248,255,0.3)", fontSize: "0.95rem" }}>
                                <option value="" style={{ background: "#0a0a1a" }}>— Selecciona tu signo solar —</option>
                                {SIGNS.map(s => <option key={s} value={s} style={{ background: "#0a0a1a" }}>♦ {s}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                {/* PERSONAL READING */}
                {kabData && (
                    <section className="section-pad">
                        <div className="container-sm" style={{ maxWidth: 700 }}>
                            <div className="glass-card" style={{ padding: "2rem", borderColor: (sefiColors[kabData.sefira] || "#7C3AED") + "30", textAlign: "center", marginBottom: "1rem" }}>
                                <p style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.15em", color: sefiColors[kabData.sefira] || "#7C3AED", marginBottom: "0.3rem" }}>Tu Sefirah rectora · {selectedSign}</p>
                                <h2 className="font-display" style={{ fontSize: "2rem", fontWeight: 900, color: "#F8F8FF", marginBottom: "0.2rem" }}>{kabData.sefira}</h2>
                                <p style={{ fontSize: "1.1rem", color: sefiColors[kabData.sefira] || "#7C3AED", fontFamily: "serif", marginBottom: "0.5rem" }}>{SEFIROT[kabData.sefira]?.hebrew}</p>
                                <p style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.5)", fontStyle: "italic", marginBottom: "1.25rem" }}>"{SEFIROT[kabData.sefira]?.meaning}" — {SEFIROT[kabData.sefira]?.dimension}</p>
                                <p style={{ fontSize: "0.84rem", color: "rgba(248,248,255,0.65)", lineHeight: 1.85, textAlign: "left" }}>{SEFIROT[kabData.sefira]?.body}</p>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1rem" }}>
                                <div className="glass-card" style={{ padding: "1rem", borderColor: (sefiColors[kabData.sefira] || "#7C3AED") + "20" }}>
                                    <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: sefiColors[kabData.sefira] || "#7C3AED", marginBottom: "0.4rem", letterSpacing: "0.1em" }}>Tu sendero kármico</p>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F8F8FF", marginBottom: "0.2rem" }}>{kabData.path}</p>
                                    <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.2rem" }}>Letra hebrea: {kabData.letterHebrew}</p>
                                    <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.35)", fontStyle: "italic" }}>{kabData.pathName}</p>
                                </div>
                                <div className="glass-card" style={{ padding: "1rem" }}>
                                    <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "rgba(248,248,255,0.2)", marginBottom: "0.4rem", letterSpacing: "0.1em" }}>Tu Tikún (corrección kármica)</p>
                                    <p style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.7 }}>{kabData.tikun}</p>
                                </div>
                            </div>

                            {/* Meditation */}
                            <div style={{ padding: "1.25rem", background: "rgba(30,64,175,0.06)", borderRadius: "0.75rem", border: "1px solid rgba(30,64,175,0.2)", marginBottom: "1rem" }}>
                                <p style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "#93C5FD", marginBottom: "0.5rem", letterSpacing: "0.12em" }}>✦ Meditación de tu sendero</p>
                                <p style={{ fontSize: "0.84rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.8, fontStyle: "italic" }}>{kabData.meditation}</p>
                            </div>

                            {/* Gift + Shadow */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1rem" }}>
                                <div className="glass-card" style={{ padding: "0.9rem", borderColor: "rgba(34,197,94,0.12)" }}>
                                    <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "#22C55E", marginBottom: "0.35rem", letterSpacing: "0.1em" }}>✦ Don del alma</p>
                                    <p style={{ fontSize: "0.76rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.7 }}>{SEFIROT[kabData.sefira]?.gift}</p>
                                </div>
                                <div className="glass-card" style={{ padding: "0.9rem" }}>
                                    <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "rgba(248,248,255,0.2)", marginBottom: "0.35rem", letterSpacing: "0.1em" }}>⚠️ Sombra kármica</p>
                                    <p style={{ fontSize: "0.76rem", color: "rgba(248,248,255,0.3)", lineHeight: 1.7 }}>{SEFIROT[kabData.sefira]?.shadow}</p>
                                </div>
                            </div>

                            {/* Gate */}
                            {!showGate ? (
                                <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", borderColor: "rgba(30,64,175,0.25)" }}>
                                    <p style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>🔒 Tu mapa kabbalístico completo</p>
                                    <p style={{ fontSize: "0.73rem", color: "rgba(248,248,255,0.35)", lineHeight: 1.6, marginBottom: "0.85rem" }}>
                                        Los 22 senderos entre Sefirot, los 72 Nombres de Dios y tu nombre, gematría completa de tu carta natal, y los 4 mundos del alma (Nefesh, Ruaj, Neshamá, Reajá).
                                    </p>
                                    <button className="btn-gold" style={{ fontSize: "0.8rem", fontWeight: 700 }} onClick={() => { setShowGate(true); track.gateHit("kabbalah"); }}>
                                        Ver mi mapa completo →
                                    </button>
                                </div>
                            ) : (
                                <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", borderColor: "rgba(30,64,175,0.4)" }}>
                                    <a href="/precios" className="btn-gold" style={{ fontWeight: 700, textDecoration: "none", display: "inline-block", padding: "0.65rem 1.75rem" }}
                                        onClick={() => track.upgradeClick("kabbalah", "maestro")}>
                                        Activar Plan Maestro → Kabbalah Profundo
                                    </a>
                                </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                                <button onClick={() => { track.shareWhatsApp("kabbalah"); window.open(`https://wa.me/?text=${encodeURIComponent(`Mi Sefirah en el Árbol de la Vida es ${kabData.sefira} ✡️\n"${SEFIROT[kabData.sefira]?.meaning}"\n\n¿Cuál es la tuya? → crystal-cosmos.vercel.app/kabbalah-y-tu-arbol-de-la-vida`)}`, "_blank"); }}
                                    style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                                    💬 Compartir mi Sefirah
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* LAS 10 SEFIROT */}
                <section className="section-pad" style={{ background: "rgba(0,0,0,0.10)" }}>
                    <div className="container-sm" style={{ maxWidth: 700 }}>
                        <h2 className="font-display" style={{ fontSize: "clamp(1.2rem,2vw,1.5rem)", fontWeight: 700, textAlign: "center", marginBottom: "1.25rem" }}>Las 10 Sefirot del Árbol de la Vida</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.65rem" }}>
                            {SEFIROT_NAMES.map(name => {
                                const s = SEFIROT[name];
                                const isActive = activeSefirah === name;
                                return (
                                    <button key={name} onClick={() => setActiveSefirah(name)}
                                        style={{ padding: "1rem", borderRadius: "0.75rem", textAlign: "left", cursor: "pointer", border: `1px solid ${isActive ? sefiColors[name] : "rgba(255,255,255,0.06)"}`, background: isActive ? sefiColors[name] + "12" : "rgba(255,255,255,0.02)", transition: "all 0.15s" }}>
                                        <p style={{ fontSize: "0.7rem", color: sefiColors[name], fontFamily: "serif", marginBottom: "0.1rem" }}>{s.hebrew}</p>
                                        <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#F8F8FF", marginBottom: "0.1rem" }}>{name}</p>
                                        <p style={{ fontSize: "0.7rem", color: sefiColors[name], marginBottom: "0.25rem" }}>{s.meaning}</p>
                                        <p style={{ fontSize: "0.68rem", color: "rgba(248,248,255,0.3)" }}>♦ {s.planet}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active Sefirot detail */}
                        {sefiData && (
                            <div className="glass-card" style={{ padding: "1.5rem", marginTop: "1rem", borderColor: sefiColors[activeSefirah] + "25" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.85rem" }}>
                                    <div>
                                        <p style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.15em", color: sefiColors[activeSefirah], marginBottom: "0.15rem" }}>Sefirah · {sefiData.planet}</p>
                                        <h3 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 800 }}>{activeSefirah}</h3>
                                        <p style={{ fontSize: "0.9rem", color: sefiColors[activeSefirah], fontFamily: "serif" }}>{sefiData.hebrew} — {sefiData.meaning}</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.85 }}>{sefiData.body}</p>
                                <p style={{ fontSize: "0.75rem", color: sefiColors[activeSefirah], marginTop: "0.75rem", fontStyle: "italic" }}>✦ {sefiData.prayer}</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <GlobalFooter />
        </>
    );
}
