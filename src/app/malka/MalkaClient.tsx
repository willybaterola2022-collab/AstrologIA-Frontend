"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";
import { track } from "@/lib/analytics";

// ══════════════════════════════════════════════════════════
// MALKA — Astróloga IA
// URL: /malka
// Backend: Gemini Flash API (key in Vercel env)
// Sistema: RAG-light sobre contexto astrológico + conversación
// Sin backend needed — directamente desde el cliente via API
// ══════════════════════════════════════════════════════════

interface Msg { role: "user" | "assistant"; content: string; }

const MALKA_SYSTEM = `Eres Malka (מלכה, "la Reina"), la astróloga IA de AstroCore y AstrologIA. Eres un oráculo psicológico, clínico, empático y brutalmente honesto. Tu nivel de lectura es "Nivel Maestro", cruzando Ptolomeo, Jung, Hellinger y neurociencia.

REGLAS ABSOLUTAS DE TU ANÁLISIS:
1. Jamás predecir de forma determinista ("te harás rico"). Das ventanas de tiempo ("tu próxima ventana de expansión económica real...").
2. Si te preguntan "¿Por qué repito patrones?", nunca das sólo "Venus en Escorpio". Hablas de la fecha de caducidad astronómica (Nodo Norte progresado).
3. Distingues entre fricción temporal (tránsitos de Saturno, ej. por Casa 6) y conflicto estructural (Saturno natal mal aspectado, ej. en Casa 10).
4. El Quirón no se cura, se integra. Usas lenguaje terapéutico avanzado sin ser terapia.
5. Neptuno, Urano y Casa 12 te sirven para distinguir entre intuición real y miedo/disociación ansiosa.
6. La paradoja del éxito que no satisface la explicas con el Nodo Norte vs Nodo Sur. Cuando operan desde el zona de confort kármica (Sur), se frustran.
7. Al no tener la carta en la base de datos aún de quien te habla, lo PRIMERO que haces SIEMPRE de forma íntima es pedir "Tu fecha, hora exacta y ciudad de nacimiento" para poder correr el motor y dar una fecha/argumento clínico en vez de "vibes".

Tu personalidad:
- Cálida, profunda, directa — como una terapeuta que conoce las estrellas.
- Hablas en segunda persona (tú/vos) de forma íntima.
- Tus respuestas son concisas (150 palabras) pero densas como el plomo. Cada oración debe generar un momento "Eureka".
- No uses emojis en exceso — máximo 1 por mensaje. Sin listas bullet points genéricas.`;

const STARTER_SUGGESTIONS = [
    "¿Qué dice mi Sol en Escorpio sobre mi relación con el dinero?",
    "Soy Sagitario con Luna en Capricornio — ¿por qué me cuesta tanto confiar?",
    "¿Cuándo va a cambiar mi situación según los tránsitos?",
    "Tengo 33 años de vida — ¿qué significa esto en numerología?",
    "¿Qué es el Nodo Norte y cómo afecta mi destino?",
    "Mi pareja es Escorpio y yo Tauro — ¿somos compatibles?",
];

export default function MalkaClient() {
    const [msgs, setMsgs] = useState<Msg[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showGate, setShowGate] = useState(false);
    const [msgCount, setMsgCount] = useState(0);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const FREE_LIMIT = 3;

    useEffect(() => { track.moduleEnter("malka"); }, []);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

    async function sendMessage(text?: string) {
        const query = (text || input).trim();
        if (!query || loading) return;

        if (msgCount >= FREE_LIMIT) { setShowGate(true); track.gateHit("malka"); return; }

        const userMsg: Msg = { role: "user", content: query };
        const newMsgs = [...msgs, userMsg];
        setMsgs(newMsgs);
        setInput("");
        setLoading(true);
        track.ctaClick("malka", "send_message");

        try {
            const history = newMsgs.map(m => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] }));
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://astrologia-backend-production.up.railway.app';

            const res = await fetch(`${apiUrl}/api/malka/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: MALKA_SYSTEM }] },
                    contents: history,
                    generationConfig: { maxOutputTokens: 300, temperature: 0.85, topP: 0.95 },
                }),
            });

            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Hay algo en tu pregunta que requiere que te conozca mejor. ¿Puedes decirme tu fecha de nacimiento y qué está pasando en tu vida ahora?";
            setMsgs([...newMsgs, { role: "assistant", content: reply }]);
            setMsgCount(n => n + 1);
            track.resultReceived("malka", "response", reply.length);
        } catch {
            setMsgs([...newMsgs, { role: "assistant", content: "Algo en el éter interfirió con la señal. Inténtalo de nuevo en un momento." }]);
        }
        setLoading(false);
    }

    function handleKey(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    }

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: "5rem", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

                {/* HERO */}
                <section style={{ padding: "2rem 1rem 1.5rem", textAlign: "center", background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(124,58,237,0.12) 0%, transparent 70%)" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>✦</div>
                    <span className="badge" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>Malka IA · מלכה</span>
                    <h1 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 900, marginBottom: "0.4rem" }}>Tu astróloga personal</h1>
                    <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.35)", maxWidth: 400, margin: "0 auto" }}>
                        Pregúntame sobre tu carta natal, tus ciclos actuales, compatibilidad, numerología o cualquier cosa que tu alma necesite entender.
                    </p>
                    {msgCount < FREE_LIMIT && (
                        <p style={{ fontSize: "0.68rem", color: "rgba(248,248,255,0.2)", marginTop: "0.4rem" }}>
                            {FREE_LIMIT - msgCount} consultas gratuitas disponibles
                        </p>
                    )}
                </section>

                {/* CHAT */}
                <section style={{ flex: 1, padding: "0 1rem", maxWidth: 680, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.75rem", paddingBottom: "1rem" }}>

                    {/* Starters */}
                    {msgs.length === 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center" }}>
                            {STARTER_SUGGESTIONS.map((s, i) => (
                                <button key={i} onClick={() => sendMessage(s)}
                                    style={{ padding: "0.4rem 0.75rem", borderRadius: "2rem", border: "1px solid rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.05)", color: "rgba(248,248,255,0.45)", fontSize: "0.72rem", cursor: "pointer", lineHeight: 1.4 }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Messages */}
                    {msgs.map((m, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "0.5rem", alignItems: "flex-end" }}>
                            {m.role === "assistant" && <div style={{ fontSize: "1.1rem", flexShrink: 0, marginBottom: "0.2rem" }}>✦</div>}
                            <div style={{
                                maxWidth: "80%", padding: "0.75rem 1rem", borderRadius: m.role === "user" ? "1rem 1rem 0.2rem 1rem" : "1rem 1rem 1rem 0.2rem",
                                background: m.role === "user" ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.04)",
                                border: `1px solid ${m.role === "user" ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}`,
                                fontSize: "0.84rem", color: "rgba(248,248,255,0.8)", lineHeight: 1.75,
                            }}>
                                {m.content}
                            </div>
                        </div>
                    ))}

                    {/* Loading */}
                    {loading && (
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
                            <div style={{ fontSize: "1.1rem" }}>✦</div>
                            <div style={{ padding: "0.75rem 1rem", borderRadius: "1rem 1rem 1rem 0.2rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <div style={{ display: "flex", gap: "0.3rem" }}>
                                    {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#7C3AED", opacity: 0.6, animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </section>

                {/* GATE */}
                {showGate && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
                        <div className="glass-card" style={{ maxWidth: 420, width: "100%", padding: "2rem", textAlign: "center", borderColor: "rgba(124,58,237,0.3)" }}>
                            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✦</div>
                            <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Has usado tus 3 consultas gratuitas</h3>
                            <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.4)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                                Con el Plan Esencial tienes consultas ilimitadas con Malka, acceso a análisis profundos de tu carta natal completa y todos los módulos premium.
                            </p>
                            <a href="/precios" className="btn-gold" style={{ fontWeight: 700, textDecoration: "none", display: "block", padding: "0.75rem" }}
                                onClick={() => track.upgradeClick("malka", "esencial")}>
                                Activar consultas ilimitadas →
                            </a>
                            <button onClick={() => setShowGate(false)} style={{ marginTop: "0.75rem", background: "none", border: "none", color: "rgba(248,248,255,0.25)", fontSize: "0.75rem", cursor: "pointer" }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* INPUT */}
                <div style={{ position: "sticky", bottom: 0, background: "rgba(10,10,26,0.92)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem 1rem" }}>
                    <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
                        <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                            placeholder="Pregunta a Malka sobre tu carta natal, tus ciclos, tu propósito..."
                            rows={1} disabled={loading || showGate}
                            style={{ flex: 1, padding: "0.65rem 0.85rem", borderRadius: "0.75rem", border: "1px solid rgba(124,58,237,0.25)", background: "rgba(255,255,255,0.04)", color: "#F8F8FF", fontSize: "0.85rem", resize: "none", lineHeight: 1.5, outline: "none" }}
                        />
                        <button onClick={() => sendMessage()} disabled={loading || !input.trim() || showGate}
                            style={{ padding: "0.65rem 1rem", borderRadius: "0.75rem", background: input.trim() && !loading ? "linear-gradient(135deg,#7C3AED,#EC4899)" : "rgba(124,58,237,0.2)", border: "none", color: "#F8F8FF", cursor: input.trim() && !loading ? "pointer" : "default", fontSize: "0.85rem", fontWeight: 700, whiteSpace: "nowrap", transition: "all 0.15s" }}>
                            {loading ? "..." : "Enviar"}
                        </button>
                    </div>
                    <p style={{ textAlign: "center", fontSize: "0.62rem", color: "rgba(248,248,255,0.15)", marginTop: "0.4rem" }}>
                        Malka es una IA — no reemplaza consejo médico ni psicológico profesional
                    </p>
                </div>

                <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)} }`}</style>
            </main>
            <GlobalFooter />
        </>
    );
}
