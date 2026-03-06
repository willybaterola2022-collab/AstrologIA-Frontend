"use client";
import { useState, useEffect, useRef } from "react";

const PLANETARY_FREQUENCIES = {
    Sol: { hz: 126.22, name: "Sol (Poder)", color: "#F59E0B", emoji: "☀️" },
    Luna: { hz: 210.42, name: "Luna (Intuición)", color: "#CBD5E1", emoji: "🌙" },
    Marte: { hz: 144.72, name: "Marte (Acción)", color: "#EF4444", emoji: "♂️" },
    Júpiter: { hz: 183.58, name: "Júpiter (Expansión)", color: "#60A5FA", emoji: "♃" },
    Saturno: { hz: 147.85, name: "Saturno (Karma)", color: "#818CF8", emoji: "♄" },
    Om: { hz: 136.1, name: "Tierra/Om (Raíz)", color: "#34D399", emoji: "🌍" },
};

const BRAINWAVE_STATES = {
    Alpha: { gap: 10, desc: "Ideal para estudio y visualización." },
    Theta: { gap: 6, desc: "Ideal para meditación e hipnosis profunda." },
    Delta: { gap: 2.5, desc: "Ideal para renovación y sanación física." },
};

export default function BinauralSection() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [planet, setPlanet] = useState<keyof typeof PLANETARY_FREQUENCIES>("Om");
    const [brainwave, setBrainwave] = useState<keyof typeof BRAINWAVE_STATES>("Theta");
    const [volume, setVolume] = useState(0.5);
    const [toneLoaded, setToneLoaded] = useState(false);

    // We load Tone.js dynamically to avoid SSR issues
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscLRef = useRef<OscillatorNode | null>(null);
    const oscRRef = useRef<OscillatorNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const panLRef = useRef<StereoPannerNode | null>(null);
    const panRRef = useRef<StereoPannerNode | null>(null);

    useEffect(() => {
        setToneLoaded(true);
    }, []);

    const stopAudio = () => {
        if (gainRef.current) {
            gainRef.current.gain.exponentialRampToValueAtTime(0.0001, (audioCtxRef.current?.currentTime || 0) + 2);
        }
        setTimeout(() => {
            oscLRef.current?.stop();
            oscRRef.current?.stop();
            oscLRef.current = null;
            oscRRef.current = null;
        }, 2100);
    };

    const startAudio = () => {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        audioCtxRef.current = ctx;

        const baseFreq = PLANETARY_FREQUENCIES[planet].hz;
        const gap = BRAINWAVE_STATES[brainwave].gap;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(volume * 0.3, ctx.currentTime + 2);
        gain.connect(ctx.destination);
        gainRef.current = gain;

        const panL = ctx.createStereoPanner();
        const panR = ctx.createStereoPanner();
        panL.pan.value = -1;
        panR.pan.value = 1;
        panL.connect(gain);
        panR.connect(gain);
        panLRef.current = panL;
        panRRef.current = panR;

        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        oscL.type = "sine";
        oscR.type = "sine";
        oscL.frequency.value = baseFreq - gap / 2;
        oscR.frequency.value = baseFreq + gap / 2;
        oscL.connect(panL);
        oscR.connect(panR);
        oscL.start();
        oscR.start();
        oscLRef.current = oscL;
        oscRRef.current = oscR;
    };

    const togglePlay = () => {
        if (!toneLoaded) return;
        if (isPlaying) {
            stopAudio();
            setIsPlaying(false);
        } else {
            startAudio();
            setIsPlaying(true);
        }
    };

    // Update frequencies when planet/brainwave changes while playing
    useEffect(() => {
        if (isPlaying && oscLRef.current && oscRRef.current && audioCtxRef.current) {
            const baseFreq = PLANETARY_FREQUENCIES[planet].hz;
            const gap = BRAINWAVE_STATES[brainwave].gap;
            const now = audioCtxRef.current.currentTime;
            oscLRef.current.frequency.linearRampToValueAtTime(baseFreq - gap / 2, now + 2);
            oscRRef.current.frequency.linearRampToValueAtTime(baseFreq + gap / 2, now + 2);
        }
    }, [planet, brainwave, isPlaying]);

    const pColor = PLANETARY_FREQUENCIES[planet].color;

    return (
        <section className="section-pad" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="container-sm">
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
                        Sintonía Planetaria
                    </h2>
                    <p style={{ color: "rgba(248,248,255,0.45)", fontSize: "0.9rem" }}>
                        Pulsos binaurales — usa auriculares para máximo efecto
                    </p>
                </div>

                <div className="glass-card" style={{ padding: "2rem", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" }}>
                    {/* Glow */}
                    <div style={{ position: "absolute", top: -60, right: -60, width: 140, height: 140, borderRadius: "50%", background: pColor, filter: "blur(80px)", opacity: 0.15, transition: "background 1s" }} />

                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <div>
                            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.15rem" }}>Cura Sónica</h3>
                            <p style={{ fontSize: "0.72rem", color: "rgba(248,248,255,0.35)" }}>Pulsos Binaurales</p>
                        </div>
                        <button onClick={togglePlay} style={{
                            width: 52, height: 52, borderRadius: "50%", border: "none", cursor: "pointer",
                            background: isPlaying ? "rgba(255,255,255,0.08)" : pColor,
                            color: "white", fontSize: "1.1rem", transition: "all 0.3s",
                            boxShadow: isPlaying ? "none" : `0 0 20px ${pColor}66`,
                        }}>
                            {isPlaying ? "⏸" : "▶"}
                        </button>
                    </div>

                    {/* Planet selector */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(248,248,255,0.3)", marginBottom: "0.6rem" }}>SINTONÍA PLANETARIA</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                            {Object.entries(PLANETARY_FREQUENCIES).map(([key, data]) => (
                                <button key={key} onClick={() => setPlanet(key as keyof typeof PLANETARY_FREQUENCIES)} style={{
                                    padding: "0.5rem 0.75rem", borderRadius: "0.6rem", border: "1px solid",
                                    borderColor: planet === key ? data.color + "66" : "rgba(255,255,255,0.08)",
                                    background: planet === key ? data.color + "18" : "transparent",
                                    color: planet === key ? data.color : "rgba(248,248,255,0.4)",
                                    fontSize: "0.78rem", cursor: "pointer", transition: "all 0.25s",
                                    textAlign: "left",
                                }}>
                                    {data.emoji} {data.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Brainwave selector */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(248,248,255,0.3)", marginBottom: "0.6rem" }}>ESTADO COGNITIVO</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem" }}>
                            {Object.entries(BRAINWAVE_STATES).map(([key, data]) => (
                                <button key={key} onClick={() => setBrainwave(key as keyof typeof BRAINWAVE_STATES)} style={{
                                    padding: "0.5rem 0.4rem", borderRadius: "0.6rem", border: "1px solid",
                                    borderColor: brainwave === key ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)",
                                    background: brainwave === key ? "rgba(16,185,129,0.1)" : "transparent",
                                    color: brainwave === key ? "#34D399" : "rgba(248,248,255,0.4)",
                                    fontSize: "0.7rem", cursor: "pointer", transition: "all 0.25s",
                                    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.1rem",
                                }}>
                                    <span style={{ fontWeight: 700 }}>{key}</span>
                                    <span style={{ fontSize: "0.6rem", opacity: 0.6, fontFamily: "monospace" }}>{data.gap}Hz</span>
                                </button>
                            ))}
                        </div>
                        <p style={{ textAlign: "center", fontSize: "0.72rem", color: "rgba(248,248,255,0.35)", marginTop: "0.5rem" }}>
                            {BRAINWAVE_STATES[brainwave].desc}
                        </p>
                    </div>

                    {/* Volume */}
                    <div>
                        <label style={{ display: "block", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(248,248,255,0.3)", marginBottom: "0.6rem" }}>INTENSIDAD</label>
                        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => setVolume(+e.target.value)}
                            style={{ width: "100%", accentColor: pColor }} />
                    </div>

                    {/* Active indicator */}
                    {isPlaying && (
                        <div style={{ marginTop: "1rem", padding: "0.6rem 1rem", borderRadius: "0.5rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.7rem", fontFamily: "monospace" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(248,248,255,0.5)" }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A855F7", animation: "pulse 1s infinite", display: "inline-block" }} />
                                TRANSMITIENDO FRECUENCIA
                            </span>
                            <span style={{ color: "rgba(248,248,255,0.6)" }}>
                                L:{(PLANETARY_FREQUENCIES[planet].hz - BRAINWAVE_STATES[brainwave].gap / 2).toFixed(1)}
                                {" · "}
                                R:{(PLANETARY_FREQUENCIES[planet].hz + BRAINWAVE_STATES[brainwave].gap / 2).toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
