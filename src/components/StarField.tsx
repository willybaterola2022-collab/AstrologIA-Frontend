"use client";
import { useEffect, useRef } from "react";

export default function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars: { x: number; y: number; r: number; a: number; speed: number }[] = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.2,
                a: Math.random(),
                speed: Math.random() * 0.003 + 0.001,
            });
        }

        let frame: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach((s) => {
                s.a += s.speed;
                if (s.a > 1) s.a = 0;
                const alpha = Math.abs(Math.sin(s.a * Math.PI));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
                ctx.fill();
            });
            frame = requestAnimationFrame(draw);
        };
        draw();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
    }, []);

    return <canvas ref={canvasRef} id="stars-canvas" aria-hidden />;
}
