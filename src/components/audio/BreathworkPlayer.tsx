"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tone from 'tone';
import { Play, Pause, Wind, Moon, Flame, Shield, Activity, Waves } from 'lucide-react';

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

const BREATH_PATTERNS = {
    Moon: {
        name: 'Luna (Relajación 4-7-8)',
        desc: 'Baja el ritmo cardíaco y prepara para el sueño o meditación profunda.',
        icon: Moon,
        color: 'emerald',
        sequence: [
            { phase: 'inhale', duration: 4000, label: 'Inhala', scale: 1.5, text: 'text-emerald-400', bg: 'bg-emerald-500/20' },
            { phase: 'hold1', duration: 7000, label: 'Sostén', scale: 1.5, text: 'text-emerald-300', bg: 'bg-emerald-400/20' },
            { phase: 'exhale', duration: 8000, label: 'Exhala', scale: 1, text: 'text-emerald-500', bg: 'bg-emerald-600/20' },
            { phase: 'hold2', duration: 0, label: '', scale: 1, text: '', bg: '' }
        ]
    },
    Mars: {
        name: 'Marte (Box Breathing 4-4-4-4)',
        desc: 'Respiración táctica. Resetea el sistema nervioso y aumenta el enfoque agudo.',
        icon: Flame,
        color: 'red',
        sequence: [
            { phase: 'inhale', duration: 4000, label: 'Inhala', scale: 1.5, text: 'text-red-400', bg: 'bg-red-500/20' },
            { phase: 'hold1', duration: 4000, label: 'Sostén', scale: 1.5, text: 'text-red-300', bg: 'bg-red-400/20' },
            { phase: 'exhale', duration: 4000, label: 'Exhala', scale: 1, text: 'text-red-500', bg: 'bg-red-600/20' },
            { phase: 'hold2', duration: 4000, label: 'Sostén vacío', scale: 1, text: 'text-red-400', bg: 'bg-red-500/10' }
        ]
    },
    Saturn: {
        name: 'Saturno (Coherencia 5-5)',
        desc: 'Equilibrio perfecto. Sincroniza el corazón y el cerebro para aterrizar (grounding).',
        icon: Shield,
        color: 'indigo',
        sequence: [
            { phase: 'inhale', duration: 5000, label: 'Inhala', scale: 1.5, text: 'text-indigo-400', bg: 'bg-indigo-500/20' },
            { phase: 'hold1', duration: 0, label: '', scale: 1.5, text: '', bg: '' },
            { phase: 'exhale', duration: 5000, label: 'Exhala', scale: 1, text: 'text-indigo-400', bg: 'bg-indigo-600/20' },
            { phase: 'hold2', duration: 0, label: '', scale: 1, text: '', bg: '' }
        ]
    }
};

export function BreathworkPlayer() {
    const [activePattern, setActivePattern] = useState<keyof typeof BREATH_PATTERNS>('Moon');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    const synthRef = useRef<Tone.Synth | null>(null);
    const filterRef = useRef<Tone.Filter | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const reqAnimRef = useRef<number>(0);

    // Initialize audio
    useEffect(() => {
        filterRef.current = new Tone.Filter(400, "lowpass").toDestination();
        synthRef.current = new Tone.Synth({
            oscillator: { type: "sine" },
            envelope: { attack: 2, decay: 1, sustain: 0.5, release: 2 }
        }).connect(filterRef.current);

        return () => {
            synthRef.current?.dispose();
            filterRef.current?.dispose();
            cancelAnimationFrame(reqAnimRef.current);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const pattern = BREATH_PATTERNS[activePattern];
    const activeSteps = pattern.sequence.filter(s => s.duration > 0);
    const currentStep = activeSteps[currentStepIndex] || activeSteps[0];

    const playAudioCue = (phase: string, duration: number) => {
        if (!synthRef.current || !filterRef.current) return;

        const d = duration / 1000;

        if (phase === 'inhale') {
            synthRef.current.triggerAttack("C3");
            synthRef.current.frequency.rampTo("C4", d);
            filterRef.current.frequency.rampTo(2000, d);
        } else if (phase === 'exhale') {
            synthRef.current.triggerAttack("C4");
            synthRef.current.frequency.rampTo("C2", d);
            filterRef.current.frequency.rampTo(200, d);
        } else if (phase.startsWith('hold')) {
            synthRef.current.triggerRelease();
        }
    };

    const nextStep = () => {
        if (!isPlaying) return;

        setCurrentStepIndex(prev => {
            const nextIdx = (prev + 1) % activeSteps.length;
            const nextPhase = activeSteps[nextIdx];

            playAudioCue(nextPhase.phase, nextPhase.duration);

            startTimeRef.current = Date.now();
            setTimeLeft(nextPhase.duration);

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(nextStep, nextPhase.duration);

            return nextIdx;
        });
    };

    const updateVisualTimer = () => {
        if (isPlaying && activeSteps[currentStepIndex]) {
            const elapsed = new Date().getTime() - startTimeRef.current;
            const remaining = Math.max(0, activeSteps[currentStepIndex].duration - elapsed);
            setTimeLeft(remaining);
        }
        reqAnimRef.current = requestAnimationFrame(updateVisualTimer);
    };

    useEffect(() => {
        if (isPlaying) {
            reqAnimRef.current = requestAnimationFrame(updateVisualTimer);
        } else {
            cancelAnimationFrame(reqAnimRef.current);
            setTimeLeft(0);
        }
        return () => cancelAnimationFrame(reqAnimRef.current);
    }, [isPlaying, currentStepIndex]);

    const togglePlay = async () => {
        if (!isPlaying) {
            await Tone.start();
            setIsPlaying(true);
            setCurrentStepIndex(0);
            const firstStep = activeSteps[0];
            playAudioCue(firstStep.phase, firstStep.duration);

            startTimeRef.current = new Date().getTime();
            setTimeLeft(firstStep.duration);

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(nextStep, firstStep.duration);
        } else {
            setIsPlaying(false);
            synthRef.current?.triggerRelease();
            if (timerRef.current) clearTimeout(timerRef.current);
            setCurrentStepIndex(0);
        }
    };

    // Change pattern safely
    const handlePatternChange = (key: keyof typeof BREATH_PATTERNS) => {
        if (isPlaying) togglePlay();
        setActivePattern(key);
    };

    const Icon = pattern.icon;

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md mx-auto text-zinc-200 relative overflow-hidden">
            {/* Dynamic ambient background based on phase */}
            <div
                className={`absolute inset-0 opacity-20 transition-colors duration-1000 ${isPlaying ? currentStep.bg : 'bg-transparent'}`}
            />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700 shadow-inner`}>
                        <Wind size={24} className={currentStep.text || `text-${pattern.color}-400`} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Pacing Somático</h3>
                        <p className="text-xs text-zinc-400 font-medium">Respiración Astrológica Guiada</p>
                    </div>
                </div>
            </div>

            {/* Main Breathing Circle */}
            <div className="relative h-64 flex items-center justify-center mb-8 z-10">
                {/* Helper rings */}
                <div className="absolute w-48 h-48 border border-zinc-800/50 rounded-full" />
                <div className="absolute w-32 h-32 border border-zinc-800/50 rounded-full" />

                {/* Animated breathing circle */}
                <motion.div
                    animate={{
                        scale: isPlaying ? currentStep.scale : 1,
                        backgroundColor: isPlaying ? [
                            'rgba(39, 39, 42, 1)',
                            currentStep.phase === 'inhale' ? 'rgba(74, 222, 128, 0.2)' :
                                currentStep.phase === 'exhale' ? 'rgba(39, 39, 42, 1)' : 'rgba(96, 165, 250, 0.2)'
                        ] : 'rgba(39, 39, 42, 1)'
                    }}
                    transition={{
                        duration: isPlaying ? currentStep.duration / 1000 : 1,
                        ease: "easeInOut"
                    }}
                    className={`absolute w-32 h-32 rounded-full border border-zinc-700 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm z-20`}
                >
                    {isPlaying ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep.phase}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="flex flex-col items-center"
                            >
                                <span className={`text-xl font-bold ${currentStep.text}`}>{currentStep.label}</span>
                                <span className="text-sm font-mono text-zinc-400 mt-1">{(timeLeft / 1000).toFixed(1)}s</span>
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="flex flex-col items-center opacity-50">
                            <Activity size={32} className={`mb-2 text-${pattern.color}-400`} />
                            <span className="text-xs font-bold tracking-widest uppercase">Pausado</span>
                        </div>
                    )}
                </motion.div>

                {/* Orbiting element (just visual fluff) */}
                {isPlaying && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute w-56 h-56 rounded-full border border-transparent z-10 pointer-events-none"
                    >
                        <div className={`absolute -top-1 left-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_white]`} />
                    </motion.div>
                )}
            </div>

            <div className="flex justify-center mb-8 relative z-10">
                <button
                    onClick={togglePlay}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isPlaying
                        ? 'bg-zinc-800 text-zinc-300 border border-zinc-700 shadow-inner'
                        : `bg-${pattern.color}-600 hover:bg-${pattern.color}-500 text-white shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:scale-105`
                        }`}
                >
                    {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
                </button>
            </div>

            <div className="space-y-4 relative z-10">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Programa Astrológico</label>
                <div className="grid grid-cols-3 gap-2">
                    {Object.entries(BREATH_PATTERNS).map(([key, data]) => {
                        const PIcon = data.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => handlePatternChange(key as any)}
                                className={`py-3 px-2 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${activePattern === key
                                    ? `bg-zinc-800 border-${data.color}-500/50 text-${data.color}-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]`
                                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400'
                                    }`}
                            >
                                <PIcon size={18} />
                                <span className="font-bold text-[10px] uppercase tracking-wider">{key}</span>
                            </button>
                        )
                    })}
                </div>
                <p className="text-xs text-center text-zinc-400 mt-4 leading-relaxed h-10">
                    {pattern.desc}
                </p>
            </div>
        </div>
    );
}
