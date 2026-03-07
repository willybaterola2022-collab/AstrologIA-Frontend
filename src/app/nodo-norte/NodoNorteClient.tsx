"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";
import { getNorthNodeReal } from "@/lib/ephemeris";

// 12-sign × 12-house North Node interpretations (curated, copywriter-ready slots)
const NORTH_NODE_SIGNS: Record<string, {
    sign: string; emoji: string; element: string; keyword: string;
    mission: string; karma: string; activation: string[];
    body: string; mind: string; soul: string;
}> = {
    Aries: { sign: "Aries", emoji: "♈", element: "Fuego", keyword: "Coraje", mission: "Tu misión es aprender a liderar y actuar desde el centro de ti misma, sin pedir permiso.", karma: "Vienes de muchas vidas de complacer a los demás, poner sus necesidades primero. Ahora te toca a ti.", activation: ["Inicia proyectos sin esperar a que alguien te lo pida", "Di 'no' una vez esta semana sin dar explicaciones", "Haz algo sola que normalmente harías en compañía"], body: "Mueve el cuerpo de forma individual y soberana — atletismo, danza solitaria, hiking", mind: "Desarrolla tu pensamiento estratégico y la capacidad de decidir rápido", soul: "El alma aprende el valor de existir sin necesitar ser necesitada" },
    Tauro: { sign: "Tauro", emoji: "♉", element: "Tierra", keyword: "Arraigo", mission: "Tu misión es construir seguridad real en el mundo material — dinero, cuerpo, placer, belleza.", karma: "Traes del pasado la habilidad de transformar y destruir. Ahora aprendes a construir y sostener.", activation: ["Crea algo físico con tus manos esta semana", "Conecta con tu cuerpo a través de la comida consciente", "Ahorra o invierte algo esta semana — aunque sea pequeño"], body: "Yoga, contacto con la tierra, masajes, comida de calidad", mind: "Desarrolla paciencia y pensamiento a largo plazo", soul: "El alma aprende que la estabilidad también es espiritual" },
    Géminis: { sign: "Géminis", emoji: "♊", element: "Aire", keyword: "Curiosidad", mission: "Tu misión es comunicar, aprender y conectar ideas. Eres un puente entre mundos.", karma: "Traes del pasado una fe profunda y una visión amplia. Ahora debes bajar a los detalles.", activation: ["Lee sobre un tema que no conozcas en absoluto", "Escribe algo aunque sea imperfecto", "Inicia una conversación con alguien muy diferente a ti"], body: "Ejercicios de coordinación, respiración, debate", mind: "Cultiva la curiosidad como práctica diaria", soul: "El alma aprende que el conocimiento es el amor más generoso" },
    Cáncer: { sign: "Cáncer", emoji: "♋", element: "Agua", keyword: "Pertenencia", mission: "Tu misión es crear hogar, familia y contención emocional — en ti misma y para otros.", karma: "Traes carrera, ambición y logros del pasado. Ahora aprendes que el éxito sin amor es vacío.", activation: ["Cocina algo con intención amorosa", "Llama a alguien querido sin razón concreta", "Crea un espacio físico en tu casa que te haga sentir segura"], body: "Cocina, baños, cuidado del hogar", mind: "Desarrolla la inteligencia emocional y la memoria afectiva", soul: "El alma aprende que sentir profundamente es un acto de valentía" },
    Leo: { sign: "Leo", emoji: "♌", element: "Fuego", keyword: "Creación", mission: "Tu misión es brillar, crear y liderar desde el corazón. El mundo necesita tu singularidad.", karma: "Traes colectivismo y modestia. Ahora aprendes que tu luz es un regalo, no un insulto.", activation: ["Comparte algo creativo tuyo en público", "Viste algo que te haga sentir visto/a", "Di 'yo creo que...' en la próxima reunión"], body: "Artes escénicas, expresión corporal, sol", mind: "Desarrolla la creatividad como disciplina", soul: "El alma aprende que el amor propio no es egoísmo" },
    Virgo: { sign: "Virgo", emoji: "♍", element: "Tierra", keyword: "Servicio", mission: "Tu misión es perfeccionar tu oficio, cuidar tu cuerpo y servir con precisión.", karma: "Traes del pasado inspiración y visión caótica. Ahora aprendes el valor del detalle y el orden.", activation: ["Crea una rutina diaria y mantenla 7 días", "Aprende algo técnico que siempre postergaste", "Haz algo útil y concreto para alguien esta semana"], body: "Nutrición, higiene, medicina natural, yoga preciso", mind: "Desarrolla el pensamiento analítico y la atención al detalle", soul: "El alma aprende que mundano y sagrado no son opuestos" },
    Libra: { sign: "Libra", emoji: "♎", element: "Aire", keyword: "Equilibrio", mission: "Tu misión es aprender el arte de la relación auténtica, la justicia y la belleza.", karma: "Traes del pasado experiencia en actuar solo/a y en conflicto. Ahora aprendes la diplomacia.", activation: ["Negocia algo que normalmente cederías sin decir nada", "Redecora un espacio de tu casa con intención estética", "Busca el punto medio en un conflicto activo"], body: "Danza, yoga en pareja, cuidado de la apariencia como ritual", mind: "Desarrolla el pensamiento mediador y la inteligencia social", soul: "El alma aprende que la paz no es rendición" },
    Escorpio: { sign: "Escorpio", emoji: "♏", element: "Agua", keyword: "Transformación", mission: "Tu misión es sumergirte en las profundidades — la muerte, el poder, el deseo — y transformarlos.", karma: "Traes comodidad y acumulación material. Ahora aprendes a soltar y renacer.", activation: ["Identifica un miedo y da un pequeño paso hacia él", "Lee sobre psicología o el inconsciente", "Ten una conversación profunda sobre algo que normalmente evitas"], body: "Terapia corporal, sexualidad consciente, meditación profunda", mind: "Desarrolla la psicología profunda, la investigación, el pensamiento estratégico", soul: "El alma aprende que morir a lo que fuiste es el mayor acto de amor" },
    Sagitario: { sign: "Sagitario", emoji: "♐", element: "Fuego", keyword: "Expansión", mission: "Tu misión es buscar la verdad, viajar, filosofar y expandirte más allá de tu zona conocida.", karma: "Traes precisión y detalles del pasado. Ahora aprendes la visión amplia y la fe.", activation: ["Planea un viaje o estudio en un lugar nuevo", "Lee un libro de filosofía o espiritualidad", "Expresa una verdad que normalmente guardas para no molestar"], body: "Deportes al aire libre, viajes, arquería", mind: "Filosofía, teología, idiomas, pensamiento sistémico", soul: "El alma aprende que la libertad más profunda es de la mente" },
    Capricornio: { sign: "Capricornio", emoji: "♑", element: "Tierra", keyword: "Maestría", mission: "Tu misión es construir algo duradero en el mundo — una carrera, una estructura, un legado.", karma: "Traes del pasado sensibilidad y cuidado. Ahora aprendes la disciplina y la responsabilidad.", activation: ["Establece una meta profesional concreta con fecha", "Desarrolla una habilidad durante 30 días consecutivos", "Di las palabras 'me hago responsable de...'"], body: "Escalada, disciplinas físicas con progresión, biohacking", mind: "Pensamiento estratégico, gestión del tiempo, finanzas", soul: "El alma aprende que el éxito real es la suma del carácter" },
    Acuario: { sign: "Acuario", emoji: "♒", element: "Aire", keyword: "Revolución", mission: "Tu misión es innovar, conectar colectivos y traer el futuro al presente.", karma: "Traes individualismo y liderazgo personal. Ahora aprendes a servir al colectivo.", activation: ["Únete o crea una comunidad alrededor de algo que te importa", "Propón una idea disruptiva en tu entorno", "Dedica tiempo a una causa más grande que tú"], body: "Tecnología, grupos de danza o deporte colectivo", mind: "Pensamiento sistémico, programación, innovación", soul: "El alma aprende que el amor más elevado es impersonal y universal" },
    Piscis: { sign: "Piscis", emoji: "♓", element: "Agua", keyword: "Trascendencia", mission: "Tu misión es disolverte en lo sagrado — arte, mística, compasión universal, sanación.", karma: "Traes del pasado lógica y servicio concreto. Ahora aprendes a confiar en lo invisible.", activation: ["Medita 10 minutos sin agenda", "Crea algo artístico sin preocuparte del resultado", "Perdona a alguien — o a ti misma — por algo small"], body: "Natación, meditación, yoga restaurativo, música", mind: "Intuición, arte, espiritualidad, psicología transpersonal", soul: "El alma aprende que rendirse a lo divino es la forma más valiente de vivir" },
};

const ELEMENT_COLORS: Record<string, string> = {
    Fuego: "#EF4444", Tierra: "#10B981", Aire: "#60A5FA", Agua: "#A855F7"
};

type Step = "form" | "result";

export default function NodoNorteClient() {
    const [step, setStep] = useState<Step>("form");
    const [form, setForm] = useState({ year: "1990", month: "5", day: "15", hour: "14" });
    const [result, setResult] = useState<{ sign: string; house: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [calcError, setCalcError] = useState<string | null>(null);
    const [explorerSign, setExplorerSign] = useState<string | null>(null);

    const signList = Object.keys(NORTH_NODE_SIGNS);

    async function handleCalculate() {
        setLoading(true);
        setCalcError(null);
        // Real Swiss Ephemeris — no demo math
        const nodeResult = await getNorthNodeReal({
            year: parseInt(form.year),
            month: parseInt(form.month),
            day: parseInt(form.day),
            hour: parseInt(form.hour),
            lat: 40.4168, // Madrid default — city picker in Sprint D
            lon: -3.7038,
        });
        if (!nodeResult.isPrecise || nodeResult.error) {
            setCalcError(nodeResult.error || "El backend está despertando (30 segundos). Vuelve a intentar.");
            setLoading(false);
            return;
        }
        setResult({ sign: nodeResult.sign, house: nodeResult.house });
        setStep("result");
        setLoading(false);
    }

    const node = result && NORTH_NODE_SIGNS[result.sign];
    const elemColor = node ? ELEMENT_COLORS[node.element] : "#A855F7";

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>

                {/* HERO */}
                <section className="section-pad" style={{ textAlign: "center", background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(124,58,237,0.1) 0%, transparent 70%)" }}>
                    <div className="container-sm" style={{ maxWidth: 700 }}>
                        <span className="badge" style={{ marginBottom: "1rem", display: "inline-flex" }}>⬆️ Nodo Norte — Misión de Vida</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1.25rem" }}>
                            ¿Para qué viniste a este mundo?
                        </h1>
                        <p style={{ fontSize: "1rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 2.5rem" }}>
                            El Nodo Norte es el vector evolutivo de tu alma. No como metáfora — como cálculo astronómico. Indica qué viniste a aprender en esta vida y qué karma traes del pasado.
                        </p>

                        {step === "form" && (
                            <div className="glass-card" style={{ padding: "2rem", maxWidth: 440, margin: "0 auto", textAlign: "left" }}>
                                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem", textAlign: "center" }}>
                                    Calcula tu Nodo Norte
                                </h2>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                    {(["year", "month", "day"] as const).map(f => (
                                        <div key={f}>
                                            <label style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", display: "block", marginBottom: "0.3rem" }}>
                                                {f === "year" ? "Año" : f === "month" ? "Mes" : "Día"}
                                            </label>
                                            <input type="number"
                                                value={form[f]}
                                                onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                                                placeholder={f === "year" ? "1990" : f === "month" ? "5" : "15"}
                                                style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "0.5rem", border: "1px solid rgba(124,58,237,0.3)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.9rem" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginBottom: "1.5rem" }}>
                                    <label style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.3)", display: "block", marginBottom: "0.3rem" }}>
                                        Hora de nacimiento (0-23)
                                    </label>
                                    <input type="number"
                                        value={form.hour}
                                        onChange={e => setForm(p => ({ ...p, hour: e.target.value }))}
                                        placeholder="14"
                                        style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "0.5rem", border: "1px solid rgba(124,58,237,0.3)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.9rem" }}
                                    />
                                    <p style={{ fontSize: "0.68rem", color: "rgba(248,248,255,0.2)", marginTop: "0.3rem" }}>
                                        Si no sabes la hora exacta, usa 12 (mediodía)
                                    </p>
                                </div>
                                <button
                                    className="btn-gold"
                                    style={{ width: "100%", fontWeight: 700 }}
                                    onClick={handleCalculate}
                                    disabled={loading}
                                >
                                    {loading ? "⬆️ Calculando con Swiss Ephemeris..." : "Descubrir mi Nodo Norte →"}
                                </button>
                                {calcError && (
                                    <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(239,68,68,0.07)", borderRadius: "0.5rem", border: "1px solid rgba(239,68,68,0.15)" }}>
                                        <p style={{ fontSize: "0.75rem", color: "#F87171", lineHeight: 1.6 }}>⚠️ {calcError}</p>
                                        <button onClick={handleCalculate} style={{ marginTop: "0.4rem", fontSize: "0.72rem", color: "#A855F7", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                                            Reintentar →
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === "result" && node && result && (
                            <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "left" }}>
                                {/* Main result card */}
                                <div className="glass-card" style={{ padding: "2rem", borderColor: `${elemColor}40`, marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>
                                    <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, background: elemColor, borderRadius: "50%", filter: "blur(80px)", opacity: 0.12 }} />
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", marginBottom: "1.5rem" }}>
                                        <div style={{ fontSize: "3rem" }}>{node.emoji}</div>
                                        <div>
                                            <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: elemColor, fontWeight: 700, marginBottom: "0.2rem" }}>
                                                Tu Nodo Norte está en
                                            </p>
                                            <h2 className="font-display" style={{ fontSize: "2rem", fontWeight: 800, color: elemColor, marginBottom: "0.1rem" }}>
                                                {node.sign} · Casa {result.house}
                                            </h2>
                                            <p style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.4)" }}>
                                                Elemento {node.element} · Palabra clave: <strong style={{ color: "#F8F8FF" }}>{node.keyword}</strong>
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: "1.5rem", padding: "1.25rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.75rem", borderLeft: `3px solid ${elemColor}` }}>
                                        <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>⬆️ Tu misión en esta vida</p>
                                        <p style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.75 }}>{node.mission}</p>
                                    </div>

                                    <div style={{ marginBottom: "1.5rem", padding: "1.25rem", background: "rgba(255,255,255,0.02)", borderRadius: "0.75rem", borderLeft: "3px solid rgba(168,85,247,0.3)" }}>
                                        <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>⬇️ Nodo Sur — lo que traes del pasado</p>
                                        <p style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.75 }}>{node.karma}</p>
                                    </div>

                                    {/* Body / Mind / Soul */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                                        {[
                                            { label: "🔴 Cuerpo", text: node.body },
                                            { label: "🔵 Mente", text: node.mind },
                                            { label: "🟣 Alma", text: node.soul },
                                        ].map(d => (
                                            <div key={d.label} style={{ padding: "0.85rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.6rem" }}>
                                                <p style={{ fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.35rem" }}>{d.label}</p>
                                                <p style={{ fontSize: "0.72rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.6 }}>{d.text}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Activation steps */}
                                    <div>
                                        <p style={{ fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.75rem" }}>✦ Plan de activación — 3 pasos esta semana</p>
                                        {node.activation.map((a, i) => (
                                            <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                                <span style={{ width: 22, height: 22, borderRadius: "50%", background: elemColor + "20", border: `1px solid ${elemColor}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: elemColor, flexShrink: 0 }}>{i + 1}</span>
                                                <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.55)", lineHeight: 1.6 }}>{a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Share */}
                                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
                                    <button
                                        onClick={() => {
                                            const text = `Mi Nodo Norte está en ${node.sign} Casa ${result.house} ✦ ${node.mission.split(".")[0]}. Descubre el tuyo: crystal-cosmos.vercel.app/nodo-norte`;
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
                        )}
                    </div>
                </section>

                {/* EXPLORER — 12 signs */}
                <section className="section-pad" style={{ background: "rgba(0,0,0,0.2)" }}>
                    <div className="container-sm">
                        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.3rem,2vw,1.8rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
                                Los 12 Nodos Norte
                            </h2>
                            <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.35)" }}>
                                Todos tienen una misión distinta. Selecciona un signo para explorar.
                            </p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(80px,1fr))", gap: "0.6rem", marginBottom: "1.5rem" }}>
                            {signList.map(s => {
                                const d = NORTH_NODE_SIGNS[s];
                                const col = ELEMENT_COLORS[d.element];
                                const isActive = explorerSign === s;
                                return (
                                    <button key={s} onClick={() => setExplorerSign(isActive ? null : s)} style={{
                                        padding: "0.6rem 0.4rem", borderRadius: "0.6rem",
                                        border: `1px solid ${isActive ? col : "rgba(255,255,255,0.06)"}`,
                                        background: isActive ? col + "20" : "rgba(255,255,255,0.02)",
                                        cursor: "pointer", textAlign: "center",
                                    }}>
                                        <div style={{ fontSize: "1.1rem" }}>{d.emoji}</div>
                                        <div style={{ fontSize: "0.6rem", color: isActive ? col : "rgba(248,248,255,0.35)", fontWeight: isActive ? 700 : 400 }}>{s}</div>
                                    </button>
                                );
                            })}
                        </div>
                        {explorerSign && (() => {
                            const d = NORTH_NODE_SIGNS[explorerSign];
                            const col = ELEMENT_COLORS[d.element];
                            return (
                                <div className="glass-card" style={{ padding: "1.5rem", borderColor: col + "30" }}>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: col, marginBottom: "0.25rem" }}>
                                        {d.emoji} Nodo Norte en {d.sign}
                                    </h3>
                                    <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.35)", marginBottom: "0.75rem" }}>
                                        Elemento {d.element} · Keyword: {d.keyword}
                                    </p>
                                    <p style={{ fontSize: "0.83rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.75 }}>{d.mission}</p>
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
