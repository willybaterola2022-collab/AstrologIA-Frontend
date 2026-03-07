"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_PRIMARY = [
    { href: "/carta-natal", label: "Carta Natal" },
    { href: "/manual-del-ser", label: "Manual del Ser" },
    { href: "/sinastria", label: "Sinastría" },
    { href: "/#sonido", label: "🎵 Frecuencias" },
    { href: "/precios", label: "Precios" },
];

const NAV_EXPLORE = [
    { href: "/quiron", label: "⚕️ Quirón — La Herida y el Don" },
    { href: "/retorno-saturno", label: "🪐 Retorno de Saturno" },
    { href: "/nodo-norte", label: "⬆️ Nodo Norte — Misión de Vida" },
    { href: "/patrones", label: "💔 Patrones Relacionales" },
    { href: "/ventanas-de-fortuna-astrologica", label: "💰 Wealth Timer™" },
    { href: "/malka", label: "🎙️ Malka — Astróloga de Voz" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [exploreOpen, setExploreOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            padding: "0.75rem 1.5rem",
            background: scrolled ? "rgba(3,0,20,0.96)" : "rgba(3,0,20,0.4)",
            backdropFilter: "blur(20px)",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
            transition: "all 0.35s ease",
            display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
                <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "linear-gradient(135deg,#7C3AED,#F59E0B)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.85rem", boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                }}>✦</div>
                <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "1rem", background: "linear-gradient(135deg,#A855F7,#F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    AstrologIA
                </span>
                <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em", color: "#A855F7", border: "1px solid rgba(168,85,247,0.4)", borderRadius: "9999px", padding: "0.1rem 0.4rem", textTransform: "uppercase" }}>
                    BETA
                </span>
            </Link>

            {/* Desktop nav */}
            <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                {NAV_PRIMARY.map(link => (
                    <Link key={link.href} href={link.href} style={{
                        color: "rgba(248,248,255,0.55)", textDecoration: "none",
                        fontSize: "0.8rem", fontWeight: 500, padding: "0.4rem 0.75rem",
                        borderRadius: "0.5rem", transition: "all 0.2s",
                    }}
                        onMouseOver={e => { e.currentTarget.style.color = "#F8F8FF"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                        onMouseOut={e => { e.currentTarget.style.color = "rgba(248,248,255,0.55)"; e.currentTarget.style.background = "transparent"; }}
                    >{link.label}</Link>
                ))}

                {/* Explorar dropdown */}
                <div style={{ position: "relative" }}>
                    <button
                        onClick={() => setExploreOpen(o => !o)}
                        style={{
                            color: "rgba(248,248,255,0.55)", background: "transparent", border: "none",
                            fontSize: "0.8rem", fontWeight: 500, padding: "0.4rem 0.75rem",
                            borderRadius: "0.5rem", cursor: "pointer", transition: "all 0.2s",
                            display: "flex", alignItems: "center", gap: "0.3rem",
                        }}
                        onMouseOver={e => { e.currentTarget.style.color = "#F8F8FF"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                        onMouseOut={e => { e.currentTarget.style.color = "rgba(248,248,255,0.55)"; e.currentTarget.style.background = "transparent"; }}
                    >
                        Explorar <span style={{ fontSize: "0.65rem", transition: "transform 0.2s", display: "inline-block", transform: exploreOpen ? "rotate(180deg)" : "none" }}>▾</span>
                    </button>
                    {exploreOpen && (
                        <div style={{
                            position: "absolute", top: "calc(100% + 0.5rem)", right: 0,
                            background: "rgba(8,2,35,0.97)", backdropFilter: "blur(20px)",
                            border: "1px solid rgba(124,58,237,0.2)", borderRadius: "1rem",
                            padding: "0.75rem", minWidth: 260, zIndex: 200,
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                        }}>
                            <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.2)", padding: "0.25rem 0.75rem", marginBottom: "0.25rem" }}>Módulos</p>
                            {NAV_EXPLORE.map(link => (
                                <Link key={link.href} href={link.href} onClick={() => setExploreOpen(false)} style={{
                                    display: "block", padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
                                    color: "rgba(248,248,255,0.6)", textDecoration: "none",
                                    fontSize: "0.82rem", transition: "all 0.15s",
                                }}
                                    onMouseOver={e => { e.currentTarget.style.background = "rgba(124,58,237,0.15)"; e.currentTarget.style.color = "#F8F8FF"; }}
                                    onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(248,248,255,0.6)"; }}
                                >{link.label}</Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Link href="/malka" style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(124,58,237,0.1))",
                    border: "1px solid rgba(124,58,237,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none", fontSize: "1rem", transition: "all 0.2s",
                }}
                    title="Habla con Malka"
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(124,58,237,0.5)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >🎙️</Link>
                <Link href="/carta-natal" className="btn-gold" style={{ padding: "0.5rem 1.2rem", fontSize: "0.78rem" }}>
                    Empezar Gratis →
                </Link>
            </div>
        </nav>
    );
}
