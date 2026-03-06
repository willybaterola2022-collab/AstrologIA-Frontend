"use client";
import { useState, useRef, useCallback } from "react";

type PatternKey = "Luna" | "Marte" | "Saturno";

const BREATH_PATTERNS: Record<PatternKey, {
    name: string; desc: string; emoji: string; color: string;
    inhale: number; hold1: number; exhale: number; hold2: number;
}> = {
    Luna: {
        name: "Luna 4-7-8", desc: "Baja el ritmo cardíaco. Ideal para el sueño o meditación profunda.",
        emoji: "🌙", color: "#34D399", inhale: 4, hold1: 7, exhale: 8, hold2: 0
    },
    Marte: {
        name: "Marte Box 4-4-4-4", desc: "Respiración táctica. Resetea el sistema nervioso y aumenta el enfoque.",
        emoji: "♂️", color: "#EF4444", inhale: 4, hold1: 4, exhale: 4, hold2: 4
    },
    Saturno: {
        name: "Saturno 5-5", desc: "Equilibrio perfecto. Sincroniza corazón y cerebro para aterrizar.",
        emoji: "♄", color: "#818CF8", inhale: 5, hold1: 0, exhale: 5, hold2: 0
    },
};

type Phase = "idle" | "inhale" | "hold1" | "exhale" | "hold2";

export default function BreathingSection() {
    const [pattern, setPattern] = useState<PatternKey>("Luna");
    const [phase, setPhase] = useState<Phase>("idle");
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const p = BREATH_PATTERNS[pattern];

    const stopAll = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (countRef.current) clearInterval(countRef.current);
        setPhase("idle");
        setIsPlaying(false);
        setTimeLeft(0);
    }, []);

    const startPhase = useCallback((ph: Phase, duration: number, onEnd: () => void) => {
        if (duration === 0) { onEnd(); return; }
        setPhase(ph);
        setTimeLeft(duration);
        if (countRef.current) clearInterval(countRef.current);
        countRef.current = setInterval(() => setTimeLeft(t => Math.max(0, t - 0.1)), 100);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(onEnd, duration * 1000);
    }, []);

    const runCycle = useCallback(() => {
        const pp = BREATH_PATTERNS[pattern];
        startPhase("inhale", pp.inhale, () => {
            startPhase("hold1", pp.hold1, () => {
                startPhase("exhale", pp.exhale, () => {
                    startPhase("hold2", pp.hold2, () => runCycle());
                });
            });
        });
    }, [pattern, startPhase]);

    const PHASE_LABELS: Record<Phase, string> = {
        idle: "Pausado", inhale: "Inhala", hold1: "Sostén", exhale: "Exhala", hold2: "Sostén vacío"
    };

    const circleScale = phase === "inhale" || phase === "hold1" ? 1.55 : 1;
    const circleColor = phase === "inhale" ? p.color + "40" : phase === "exhale" ? "rgba(0,0,0,0.3)" : p.color + "20";

    return (
        <section className="section-pad">
            <div className="container-sm">
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
                        Pacing Somático Astrológico
                    </h2>
                    <p style={{ color: "rgba(248,248,255,0.45)", fontSize: "0.9rem" }}>Respira con el ritmo del cosmos</p>
                </div>

                <div className="glass-card" style={{ padding: "2rem", maxWidth: 420, margin: "0 auto" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <div>
                            <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.1rem" }}>Pacing Somático</h3>
                            <p style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.35)" }}>Respiración Astrológica Guiada</p>
                        </div>
                    </div>

                    {/* Breathing Circle */}
                    <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: "1.5rem" }}>
                        {/* Helper rings */}
                        <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />
                        <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />
                        {/* Main circle */}
                        <div style={{
                            width: 110, height: 110, borderRadius: "50%",
                            background: circleColor,
                            border: `1px solid ${isPlaying ? p.color + "60" : "rgba(255,255,255,0.1)"}`,
                            transform: `scale(${circleScale})`,
                            transition: `transform ${phase === "inhale" ? p.inhale : phase === "exhale" ? p.exhale : 0.5}s ease-in-out, background 0.5s`,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            boxShadow: isPlaying ? `0 0 40px ${p.color}33` : "none",
                        }}>
                            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: p.color }}>{PHASE_LABELS[phase]}</span>
                            {isPlaying && timeLeft > 0 && (
                                <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(248,248,255,0.5)", marginTop: "0.1rem" }}>
                                    {timeLeft.toFixed(1)}s
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Play button */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                        <button onClick={() => { if (isPlaying) { stopAll(); } else { setIsPlaying(true); runCycle(); } }} style={{
                            width: 56, height: 56, borderRadius: "50%", border: "none", cursor: "pointer",
                            background: isPlaying ? "rgba(255,255,255,0.06)" : p.color,
                            color: "white", fontSize: "1.1rem", transition: "all 0.3s",
                            boxShadow: isPlaying ? "none" : `0 0 20px ${p.color}66`,
                        }}>
                            {isPlaying ? "⏸" : "▶"}
                        </button>
                    </div>

                    {/* Pattern selector */}
                    <div>
                        <label style={{ display: "block", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(248,248,255,0.3)", marginBottom: "0.6rem" }}>PROGRAMA ASTROLÓGICO</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem" }}>
                            {Object.entries(BREATH_PATTERNS).map(([key, data]) => (
                                <button key={key} onClick={() => { if (isPlaying) stopAll(); setPattern(key as PatternKey); }} style={{
                                    padding: "0.6rem 0.4rem", borderRadius: "0.6rem", border: "1px solid",
                                    borderColor: pattern === key ? data.color + "66" : "rgba(255,255,255,0.08)",
                                    background: pattern === key ? data.color + "15" : "transparent",
                                    color: pattern === key ? data.color : "rgba(248,248,255,0.4)",
                                    fontSize: "0.72rem", cursor: "pointer", transition: "all 0.25s",
                                    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem",
                                }}>
                                    <span style={{ fontSize: "1rem" }}>{data.emoji}</span>
                                    <span style={{ fontWeight: 700, fontSize: "0.65rem" }}>{key}</span>
                                </button>
                            ))}
                        </div>
                        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(248,248,255,0.35)", marginTop: "0.75rem", lineHeight: 1.5 }}>
                            {p.desc}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
