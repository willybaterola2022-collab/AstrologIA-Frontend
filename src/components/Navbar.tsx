"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            padding: "1rem 1.5rem",
            background: scrolled ? "rgba(3,0,20,0.92)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
            transition: "all 0.35s ease",
            display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg,#7C3AED,#F59E0B)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem"
                }}>✦</div>
                <span style={{
                    fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: "1.1rem",
                    background: "linear-gradient(135deg,#A855F7,#F59E0B)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>AstrologIA</span>
            </div>

            {/* Desktop nav */}
            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="hidden-mobile">
                {["Carta Natal", "Módulos", "Sinastría", "Precios"].map(link => (
                    <a key={link} href={`#${link.toLowerCase().replace(" ", "-")}`}
                        style={{ color: "rgba(248,248,255,0.7)", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
                        onMouseOver={e => (e.currentTarget.style.color = "#A855F7")}
                        onMouseOut={e => (e.currentTarget.style.color = "rgba(248,248,255,0.7)")}
                    >{link}</a>
                ))}
            </div>

            {/* CTA */}
            <a href="#carta-natal" className="btn-gold" style={{ padding: "0.6rem 1.5rem", fontSize: "0.85rem" }}>
                Empezar Gratis →
            </a>
        </nav>
    );
}
