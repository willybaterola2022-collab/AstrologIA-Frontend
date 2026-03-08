"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";
import { track } from "@/lib/analytics";

// ══════════════════════════════════════════════════════════
// CARTAS DE FAMOSOS — Perfil astrológico de celebrities
// URL: /cartas-astrologicas-de-famosos
// Strategy: Inbound SEO — "carta natal de [famoso]"
// Cada perfil: Sun/Moon/Asc + análisis psicológico
// No menciona astrología — "patrón energético", "perfil"
// ══════════════════════════════════════════════════════════

interface Celebrity {
    name: string; slug: string; born: string;
    sun: string; moon: string; asc: string;
    emoji: string; category: string; color: string;
    headline: string; sunAnalysis: string; moonAnalysis: string; ascAnalysis: string;
    keyPattern: string; cta: string;
}

const CELEBRITIES: Celebrity[] = [
    {
        name: "Taylor Swift", slug: "taylor-swift", born: "13 Dic 1989",
        sun: "Sagitario", moon: "Cáncer", asc: "Escorpio",
        emoji: "🌟", category: "Música", color: "#EC4899",
        headline: "La arquitecta del relato: cómo el Sagitario de Taylor construyó un empire con la verdad emocional del Cáncer",
        sunAnalysis: "Sol en Sagitario: la narradora expansiva. Taylor no escribe canciones — escribe épicas. El Sagitario tiene el don de convertir experiencias personales en verdades universales. Su capacidad para girar el dolor hacia el crecimiento es textbook Sagitario.",
        moonAnalysis: "Luna en Cáncer: la memoria emocional como combustible creativo. Cada álbum de Taylor es un diario emocional preciso. La Luna en Cáncer no olvida — y eso es exactamente lo que hace de sus letras algo tan íntimo que se siente universal.",
        ascAnalysis: "Ascendente Escorpio: la imagen que transforma, muere y renace. La 'era' de Taylor no es marketing — es Escorpio en acción. Cada reinvención es una muerte real de una identidad anterior. La intensidad que proyecta no es performance: es su naturaleza primaria.",
        keyPattern: "Sagitario ☀️ + Cáncer 🌙 + Escorpio ↑ = La perfección de la venganza convertida en arte global",
        cta: "¿Tienes Sagitario en tu carta? El análisis completo te revela qué tienen en común",
    },
    {
        name: "Elon Musk", slug: "elon-musk", born: "28 Jun 1971",
        sun: "Cáncer", moon: "Capricornio", asc: "Capricornio",
        emoji: "🚀", category: "Tech", color: "#3B82F6",
        headline: "El fundador emocional: por qué el Cáncer más controversial del mundo construye cohetes en lugar de castillos",
        sunAnalysis: "Sol en Cáncer: el instinto de protección en escala cósmica. Lo que Musk llama 'salvar a la humanidad' es literalmente Cáncer operando a escala planetaria. El Cáncer no construye empresas — construye casas. SpaceX es la casa de la humanidad. Tesla es la seguridad energética. Cada proyecto tiene la misma lógica: proteger lo que ama.",
        moonAnalysis: "Luna en Capricornio: la frialdad emocional que estabiliza el genio. Capricornio como Luna significa emociones gestionadas con rigidez estructural. Musk no llora en público — procesa. La frialdad aparente de sus decisiones (despidos masivos, pivotes extremos) es la Luna Capricornio administrando la vulnerabilidad Cáncer.",
        ascAnalysis: "Ascendente Capricornio doble con Luna: presencia seria, ambiciosa, a veces intimidante. Lo que proyecta es estructura y autoridad incluso cuando está improvisando. El Capricornio doble explica por qué parece más inversor calculador que inventor soñador.",
        keyPattern: "Cáncer ☀️ + Capricornio 🌙 + Capricornio ↑ = Emoción máxima inside, frialdad máxima outside",
        cta: "¿Tu signo solar tiene algo del instinto protector de Musk?",
    },
    {
        name: "Lionel Messi", slug: "lionel-messi", born: "24 Jun 1987",
        sun: "Cáncer", moon: "Géminis", asc: "Géminis",
        emoji: "⚽", category: "Deporte", color: "#22C55E",
        headline: "El más grande y el más invisible: cómo el Cáncer de Messi convirtió la timidez en dominio total",
        sunAnalysis: "Sol en Cáncer: el jugador que juega para los suyos. Messi nunca fue individualsita en el sentido profundo. Cada jugada maravillosa termina en un pase o en celebrar con el equipo. El Cáncer juega mejor cuando protege a los suyos — su familia, su ciudad, su selección.",
        moonAnalysis: "Luna en Géminis: la adaptabilidad táctica. Lo que llamamos 'inteligencia de juego' es Luna Géminis leyendo el campo de forma simultánea. Messi ve 5 opciones donde otros ven 1. La Luna en Géminis procesa información contextual de forma instantánea.",
        ascAnalysis: "Ascendente Géminis: la apariencia de niño inocente que lo hace subestimable. El Géminis Ascendente proyecta juventud y ligereza. Nadie mira a Messi y ve 'amenaza'. Lo ven y subestiman. Y entonces sucede.",
        keyPattern: "Cáncer ☀️ + Géminis 🌙 + Géminis ↑ = La grandeza que no necesita demostrar que es grande",
        cta: "¿Tienes Cáncer o Géminis en tu carta? El análisis revela qué virtud comparten",
    },
    {
        name: "Beyoncé", slug: "beyonce", born: "4 Sep 1981",
        sun: "Virgo", moon: "Escorpio", asc: "Libra",
        emoji: "👑", category: "Música", color: "#F59E0B",
        headline: "Queen B: cómo la perfección obsesiva del Virgo se convierte en poder transformador",
        sunAnalysis: "Sol en Virgo: el perfeccionismo como práctica espiritual. Beyoncé no ensaya — estudia. Las 12 horas diarias de coreografía no son exceso: son Virgo haciéndose digno del espacio que ocupa. Cada detalle es intencional porque para el Virgo en su frecuencia más alta, la excelencia es una forma de respeto.",
        moonAnalysis: "Luna en Escorpio: la profundidad emocional que nadie ve venir. Detrás de la perfección de Virgo hay una Luna Escorpio que siente con una intensidad extrema. Lemonade no fue un álbum — fue una luna Escorpio destilando traición en alquimia cultural.",
        ascAnalysis: "Ascendente Libra: la imagen de gracia y balance que hace el poder más accesible. Beyoncé nunca parece intimidante aunque sea la persona más poderosa de la sala. La Libra Ascendente media entre el Sol Virgo intenso y la Luna Escorpio profunda — y el resultado es elegancia total.",
        keyPattern: "Virgo ☀️ + Escorpio 🌙 + Libra ↑ = La artesana que siente todo pero proyecta gracia",
        cta: "¿Tienes Virgo o Escorpio en tu carta? Descubre qué comparten con Beyoncé",
    },
    {
        name: "Barack Obama", slug: "barack-obama", born: "4 Ago 1961",
        sun: "Leo", moon: "Géminis", asc: "Acuario",
        emoji: "🌍", category: "Liderazgo", color: "#1D4ED8",
        headline: "El liderazgo que desaparece el ego: por qué el Leo de Obama siempre puso el colectivo primero",
        sunAnalysis: "Sol en Leo: el líder que sabe cuándo ocupar el espacio y cuándo cederlo. Obama tiene la presencia natural del Leo — magnético, cálido, persuasivo. Pero su Leo opera desde el corazón, no desde el ego. La diferencia entre un Leo en su sombra y uno en su luz es exactamente lo que Obama encarna.",
        moonAnalysis: "Luna en Géminis: la mente que procesa 10 perspectivas simultáneas. Su capacidad retórica no es entrenada — es Luna Géminis. Puede estar con cualquier persona, hablar su idioma, hacer que se sienta entendida. La empatía cognitiva del Géminis al servicio del corazón del Leo.",
        ascAnalysis: "Ascendente Acuario: el individuo al servicio de la humanidad. El eje Leo-Acuario es el eje de la performance personal versus el impacto colectivo. Obama nació con ese eje como su arquitectura fundamental. Su misión nunca fue él — fue el nosotros.",
        keyPattern: "Leo ☀️ + Géminis 🌙 + Acuario ↑ = El yo puesto al servicio del todos",
        cta: "¿Tienes Leo o Acuario en tu carta? Descubre tu eje de liderazgo",
    },
    {
        name: "Bad Bunny", slug: "bad-bunny", born: "10 Mar 1994",
        sun: "Piscis", moon: "Libra", asc: "Cáncer",
        emoji: "🐰", category: "Música", color: "#A855F7",
        headline: "El artista que disolvió los géneros: cómo el Piscis de Bad Bunny creó un universo sin límites",
        sunAnalysis: "Sol en Piscis: el artista que absorbe y transforma todo lo que toca. Benito no tiene un estilo — tiene un universo. El Piscis disuelve los límites de categoría, de género, de expectativa. No hay reguetón puro, ni trap puro, ni pop puro — hay Bad Bunny. Eso solo lo puede hacer un Piscis.",
        moonAnalysis: "Luna en Libra: el equilibrio entre el ego artístico y la conexión con la audiencia. Libra como Luna da la sensibilidad relacional que permite a Bad Bunny conectar con millones sin volverse posesivo de su imagen. Sabe cuándo exponerse y cuándo retirarse.",
        ascAnalysis: "Ascendente Cáncer: la imagen de vulnerabilidad masculina que rompió los moldes. Cáncer como Ascendente proyecta sensibilidad, ternura, la disposición a llorar en público sin perder autoridad. Eso fue revolucionario en el reggaetón.",
        keyPattern: "Piscis ☀️ + Libra 🌙 + Cáncer ↑ = La vulnerabilidad como arma de conexión masiva",
        cta: "¿Tienes Piscis en tu carta? El análisis revela qué tienen en común",
    },
    {
        name: "Shakira", slug: "shakira", born: "2 Feb 1977",
        sun: "Acuario", moon: "Cáncer", asc: "Virgo",
        emoji: "💃", category: "Música", color: "#F97316",
        headline: "La venganza más culinaria de la historia: cómo el Acuario de Shakira convirtió el dolor en cultura",
        sunAnalysis: "Sol en Acuario: la originalidad que no puede ser encasillada. Desde el belly dance hasta el flamenco árabe hasta el pop global — Shakira no se adapta a los géneros, los transforma. El Acuario necesita encontrar su camino único o se marchita.",
        moonAnalysis: "Luna en Cáncer: la memoria emocional que nunca olvida. La canción con BZRP Study no fue impulsiva — fue Luna Cáncer reteniendo durante años hasta que tuvo el momento exacto para transformar el dolor en arte comercial masivo.",
        ascAnalysis: "Ascendente Virgo: la disciplina artesanal que produce hits perfectos. Shakira no improvisa letras. Proceso, revisión, precisión — Virgo como Ascendente convierte el talento en craft y el craft en legado.",
        keyPattern: "Acuario ☀️ + Cáncer 🌙 + Virgo ↑ = La artista que procesa en privado y explota en público",
        cta: "¿Tu signo tiene el combo originalidad + memoria emocional de Shakira?",
    },
    {
        name: "Cristiano Ronaldo", slug: "cristiano-ronaldo", born: "5 Feb 1985",
        sun: "Acuario", moon: "Escorpio", asc: "Leo",
        emoji: "⚽", category: "Deporte", color: "#EF4444",
        headline: "La obsesión como diseño: cómo el Leo Ascendente de CR7 procesa el miedo al anonimato",
        sunAnalysis: "Sol en Acuario: el outsider que redefine el sistema. Ronaldo nunca fue el chico de academia predestinado. Llegó de Madeira, habló con acento diferente, tuvo que ganarse todo el respeto que otros recibían automáticamente. El Acuario no acepta el sistema como está — lo domina en sus propios términos.",
        moonAnalysis: "Luna en Escorpio: la obsesión que no tiene límite. 04:00 AM en el gimnasio. La dieta inmaculada. El control total de todo lo que puede controlarse. Eso es Luna Escorpio administrando el miedo a través de la disciplina extrema.",
        ascAnalysis: "Ascendente Leo: 'Siiii!' no es celebración — es necesidad. El Leo Ascendente necesita ser visto, reconocido, aplaudido. No por vanidad superficial sino porque su energía se alimenta del intercambio con la audiencia. Cuando Ronaldo siente la energía del estadio, el Leo se enciende.",
        keyPattern: "Acuario ☀️ + Escorpio 🌙 + Leo ↑ = El outsider que convirtió la inseguridad en espectáculo global",
        cta: "¿Tienes Escorpio o Leo en tu carta? Descubre tu patrón de ambición",
    },
];

const CATEGORIES = ["Todos", "Música", "Tech", "Deporte", "Liderazgo"];

export default function FamososClient() {
    const [selected, setSelected] = useState<Celebrity | null>(null);
    const [category, setCategory] = useState("Todos");
    const [showGate, setShowGate] = useState(false);

    useEffect(() => { track.moduleEnter("famosos"); }, []);

    const filtered = category === "Todos" ? CELEBRITIES : CELEBRITIES.filter(c => c.category === category);

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>

                {/* HERO */}
                <section className="section-pad" style={{ textAlign: "center", background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(245,158,11,0.08) 0%, transparent 70%)" }}>
                    <div className="container-sm" style={{ maxWidth: 700 }}>
                        <span className="badge" style={{ marginBottom: "1rem", display: "inline-flex" }}>👑 Cartas de Famosos</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.75rem" }}>
                            El patrón energético<br />de quienes mueven el mundo
                        </h1>
                        <p style={{ fontSize: "0.9rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto 1.5rem" }}>
                            Detrás de cada figura global hay una arquitectura energética que explica su forma de liderar, crear y relacionarse. Análisis psicológico profundo basado en su Big Three.
                        </p>
                        {/* Category filter */}
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
                            {CATEGORIES.map(cat => (
                                <button key={cat} onClick={() => setCategory(cat)}
                                    style={{ padding: "0.35rem 0.85rem", borderRadius: "2rem", border: `1px solid ${category === cat ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.07)"}`, background: category === cat ? "rgba(245,158,11,0.1)" : "transparent", color: category === cat ? "#FCD34D" : "rgba(248,248,255,0.3)", fontSize: "0.75rem", fontWeight: category === cat ? 700 : 400, cursor: "pointer" }}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CELEBRITY GRID */}
                {!selected && (
                    <section style={{ padding: "1rem 1rem 3rem" }}>
                        <div className="container-sm" style={{ maxWidth: 700 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
                                {filtered.map(c => (
                                    <button key={c.slug} onClick={() => { setSelected(c); track.ctaClick("famosos", c.slug); }}
                                        style={{ padding: "1.25rem", borderRadius: "0.75rem", textAlign: "left", cursor: "pointer", border: `1px solid ${c.color}20`, background: "rgba(255,255,255,0.02)", transition: "all 0.15s" }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = c.color + "40"; (e.currentTarget as HTMLButtonElement).style.background = c.color + "08"; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = c.color + "20"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)"; }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                                            <span style={{ fontSize: "1.75rem" }}>{c.emoji}</span>
                                            <div>
                                                <p style={{ fontSize: "0.72rem", color: c.color, fontWeight: 700, marginBottom: "0.1rem" }}>{c.category}</p>
                                                <p style={{ fontSize: "1rem", fontWeight: 800, color: "#F8F8FF" }}>{c.name}</p>
                                                <p style={{ fontSize: "0.68rem", color: "rgba(248,248,255,0.3)" }}>{c.born}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                                            {[["☀️", c.sun], ["🌙", c.moon], ["↑", c.asc]].map(([ico, sign]) => (
                                                <span key={ico + sign} style={{ fontSize: "0.65rem", padding: "0.18rem 0.5rem", borderRadius: "1rem", background: c.color + "12", color: c.color }}>{ico} {sign}</span>
                                            ))}
                                        </div>
                                        <p style={{ fontSize: "0.74rem", color: "rgba(248,248,255,0.4)", lineHeight: 1.5 }}>{c.keyPattern}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CELEBRITY DETAIL */}
                {selected && (
                    <section className="section-pad">
                        <div className="container-sm" style={{ maxWidth: 700 }}>
                            <button onClick={() => setSelected(null)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.5rem", padding: "0.35rem 0.75rem", color: "rgba(248,248,255,0.35)", fontSize: "0.75rem", cursor: "pointer", marginBottom: "1.25rem" }}>
                                ← Todos los perfiles
                            </button>

                            <div className="glass-card" style={{ padding: "1.75rem", borderColor: selected.color + "25", marginBottom: "1rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                                    <span style={{ fontSize: "2.5rem" }}>{selected.emoji}</span>
                                    <div>
                                        <p style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.12em", color: selected.color }}>{selected.category} · {selected.born}</p>
                                        <h2 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 900 }}>{selected.name}</h2>
                                        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
                                            {[["☀️", selected.sun], ["🌙", selected.moon], ["↑", selected.asc]].map(([ico, sign]) => (
                                                <span key={ico} style={{ fontSize: "0.7rem", padding: "0.2rem 0.55rem", borderRadius: "1rem", background: selected.color + "18", color: selected.color }}>{ico} {sign}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p style={{ fontSize: "0.88rem", fontWeight: 700, color: selected.color, fontStyle: "italic", lineHeight: 1.5, marginBottom: "1.25rem" }}>"{selected.headline}"</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    {[["☀️ Sol en " + selected.sun, selected.sunAnalysis], ["🌙 Luna en " + selected.moon, selected.moonAnalysis], ["↑ Ascendente " + selected.asc, selected.ascAnalysis]].map(([title, text]) => (
                                        <div key={title} style={{ padding: "0.85rem 1rem", background: selected.color + "08", borderRadius: "0.6rem", border: `1px solid ${selected.color}15` }}>
                                            <p style={{ fontSize: "0.65rem", textTransform: "uppercase", color: selected.color, letterSpacing: "0.1em", marginBottom: "0.35rem" }}>{title}</p>
                                            <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.8 }}>{text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.6rem" }}>
                                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F8F8FF" }}>{selected.keyPattern}</p>
                                </div>
                            </div>

                            {!showGate ? (
                                <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", borderColor: selected.color + "25" }}>
                                    <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>🔒 {selected.cta}</p>
                                    <button className="btn-gold" style={{ fontSize: "0.8rem", fontWeight: 700 }} onClick={() => { setShowGate(true); track.gateHit("famosos"); }}>
                                        Ver mi análisis comparativo →
                                    </button>
                                </div>
                            ) : (
                                <div className="glass-card" style={{ padding: "1.25rem", textAlign: "center", borderColor: selected.color + "35" }}>
                                    <a href="/carta-natal" className="btn-gold" style={{ fontWeight: 700, textDecoration: "none", display: "inline-block", padding: "0.65rem 1.75rem" }}
                                        onClick={() => track.upgradeClick("famosos", "carta_natal")}>
                                        Calcular mi carta natal →
                                    </a>
                                </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                                <button onClick={() => { track.shareWhatsApp("famosos"); window.open(`https://wa.me/?text=${encodeURIComponent(`El análisis astrológico de ${selected.name} es increíble 🔮\n${selected.keyPattern}\n→ crystal-cosmos.vercel.app/cartas-astrologicas-de-famosos`)}`, "_blank"); }}
                                    style={{ padding: "0.5rem 1rem", borderRadius: "0.6rem", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                                    💬 Compartir este perfil
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <GlobalFooter />
        </>
    );
}
