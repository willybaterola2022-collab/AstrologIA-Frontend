"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Play, Pause, Waves, Brain, Moon, Sun } from 'lucide-react';

const PLANETARY_FREQUENCIES = {
    Sun: { hz: 126.22, name: 'Sol (Poder)', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    Moon: { hz: 210.42, name: 'Luna (Intuición)', icon: Moon, color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/30' },
    Mars: { hz: 144.72, name: 'Marte (Acción)', icon: Waves, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    Jupiter: { hz: 183.58, name: 'Júpiter (Expansión)', icon: Waves, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
    Saturn: { hz: 147.85, name: 'Saturno (Karma)', icon: Waves, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/30' },
    Om: { hz: 136.1, name: 'Tierra/Om (Raíz)', icon: Brain, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
};

const BRAINWAVE_STATES = {
    Alpha: { gap: 10, name: 'Alpha (Calma)', desc: 'Ideal para estudio y visualización.' },
    Theta: { gap: 6, name: 'Theta (Insight)', desc: 'Ideal para meditación e hipnosis profunda.' },
    Delta: { gap: 2.5, name: 'Delta (Sueño)', desc: 'Ideal para renovación y sanación física.' }
};

export function BinauralBeatsPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [planet, setPlanet] = useState<keyof typeof PLANETARY_FREQUENCIES>('Om');
    const [brainwave, setBrainwave] = useState<keyof typeof BRAINWAVE_STATES>('Theta');
    const [volume, setVolume] = useState(-12); // dB

    const audioRefs = useRef<{
        oscL?: Tone.Oscillator;
        oscR?: Tone.Oscillator;
        panL?: Tone.Panner;
        panR?: Tone.Panner;
        vol?: Tone.Volume;
    }>({});

    useEffect(() => {
        // Solo inicializar si no existen
        if (!audioRefs.current.vol) {
            audioRefs.current.vol = new Tone.Volume(volume).toDestination();
            audioRefs.current.panL = new Tone.Panner(-1).connect(audioRefs.current.vol);
            audioRefs.current.panR = new Tone.Panner(1).connect(audioRefs.current.vol);
            audioRefs.current.oscL = new Tone.Oscillator(0, "sine").connect(audioRefs.current.panL);
            audioRefs.current.oscR = new Tone.Oscillator(0, "sine").connect(audioRefs.current.panR);
        }

        return () => {
            // Cleanup on unmount
            if (audioRefs.current.vol) {
                audioRefs.current.oscL?.dispose();
                audioRefs.current.oscR?.dispose();
                audioRefs.current.panL?.dispose();
                audioRefs.current.panR?.dispose();
                audioRefs.current.vol?.dispose();
                audioRefs.current = {};
            }
        };
    }, []);

    // Update volume
    useEffect(() => {
        if (audioRefs.current.vol) {
            audioRefs.current.vol.volume.rampTo(volume, 0.1);
        }
    }, [volume]);

    // Update frequencies smoothly
    useEffect(() => {
        if (isPlaying && audioRefs.current.oscL && audioRefs.current.oscR) {
            const baseFreq = PLANETARY_FREQUENCIES[planet].hz;
            const gap = BRAINWAVE_STATES[brainwave].gap;
            audioRefs.current.oscL.frequency.rampTo(baseFreq - gap / 2, 2);
            audioRefs.current.oscR.frequency.rampTo(baseFreq + gap / 2, 2);
        }
    }, [planet, brainwave, isPlaying]);

    const togglePlay = async () => {
        if (!isPlaying) {
            await Tone.start();
            const baseFreq = PLANETARY_FREQUENCIES[planet].hz;
            const gap = BRAINWAVE_STATES[brainwave].gap;

            const { oscL, oscR, vol } = audioRefs.current;
            if (oscL && oscR && vol) {
                oscL.frequency.value = baseFreq - gap / 2;
                oscR.frequency.value = baseFreq + gap / 2;
                oscL.start();
                oscR.start();

                // Fade in
                vol.volume.value = -60;
                vol.volume.rampTo(volume, 2);
            }
        } else {
            const { oscL, oscR, vol } = audioRefs.current;
            if (oscL && oscR && vol) {
                // Fade out
                vol.volume.rampTo(-60, 2);
                setTimeout(() => {
                    oscL.stop();
                    oscR.stop();
                }, 2000);
            }
        }
        setIsPlaying(!isPlaying);
    };

    const PlanetIcon = PLANETARY_FREQUENCIES[planet].icon;

    return (
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 p-6 rounded-3xl shadow-2xl w-full max-w-md mx-auto text-slate-200 relative overflow-hidden">
            {/* Glow background effect */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[80px] rounded-full transition-colors duration-1000 ${PLANETARY_FREQUENCIES[planet].bg}`} />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${PLANETARY_FREQUENCIES[planet].bg} border ${PLANETARY_FREQUENCIES[planet].border} ${PLANETARY_FREQUENCIES[planet].color} shadow-inner transition-colors duration-500`}>
                        <PlanetIcon size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">Cura Sónica</h3>
                        <p className="text-xs text-slate-400 font-medium tracking-wide">Pulsos Binaurales (Audífonos req.)</p>
                    </div>
                </div>
                <button
                    onClick={togglePlay}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${isPlaying
                            ? 'bg-slate-800 text-indigo-400 border border-indigo-500/50 shadow-[0_0_30px_rgba(79,70,229,0.3)]'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:scale-105'
                        }`}
                >
                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                </button>
            </div>

            <div className="space-y-6 relative z-10">
                <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Sintonía Planetaria</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(PLANETARY_FREQUENCIES).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => setPlanet(key as any)}
                                className={`py-2 px-3 rounded-xl text-sm border font-medium transition-all duration-300 ${planet === key
                                        ? `bg-slate-800 ${data.border} ${data.color} shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]`
                                        : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                                    }`}
                            >
                                {data.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Estado Cognitivo</label>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(BRAINWAVE_STATES).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => setBrainwave(key as any)}
                                className={`py-2 px-2 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 ${brainwave === key
                                        ? 'bg-slate-800 border-emerald-500/50 text-emerald-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]'
                                        : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                                    }`}
                            >
                                <span className="font-bold text-xs">{key}</span>
                                <span className="text-[10px] opacity-60 font-mono">{data.gap}Hz</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-center mt-3 text-slate-500 font-medium">
                        {BRAINWAVE_STATES[brainwave].desc}
                    </p>
                </div>

                <div className="pt-2">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Intensidad</label>
                    </div>
                    <input
                        type="range"
                        min="-40"
                        max="0"
                        step="1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Active state visualization */}
            <div className={`mt-6 overflow-hidden rounded-xl transition-all duration-1000 origin-top ${isPlaying ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-3 bg-slate-950/50 border border-slate-800/80 flex justify-between items-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 animate-pulse"></div>
                    <span className="text-[10px] text-slate-400 z-10 font-mono tracking-widest flex items-center gap-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        TRANSMITIENDO FRECUENCIA
                    </span>
                    <div className="flex gap-4 font-mono text-xs z-10 text-slate-300">
                        <span className="flex flex-col items-center">
                            <span className="text-[9px] text-slate-500">L</span>
                            {(PLANETARY_FREQUENCIES[planet].hz - BRAINWAVE_STATES[brainwave].gap / 2).toFixed(1)}
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="flex flex-col items-center">
                            <span className="text-[9px] text-slate-500">R</span>
                            {(PLANETARY_FREQUENCIES[planet].hz + BRAINWAVE_STATES[brainwave].gap / 2).toFixed(1)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
