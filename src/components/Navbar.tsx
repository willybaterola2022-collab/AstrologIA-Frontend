"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
    { href: "/carta-natal", label: "Carta Natal" },
    { href: "/manual-del-ser", label: "Manual del Ser" },
    { href: "/sinastria", label: "Sinastría" },
    { href: "/quiron", label: "Quirón" },
    { href: "/retorno-saturno", label: "Saturno" },
    { href: "/precios", label: "Precios" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            padding: "0.85rem 1.5rem",
            background: scrolled ? "rgba(3,0,20,0.95)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
            transition: "all 0.35s ease",
            display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>✦</div>
                <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: "1rem", background: "linear-gradient(135deg,#A855F7,#F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AstrologIA</span>
            </Link>

            {/* Desktop nav */}
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                {NAV_LINKS.map(link => (
                    <Link key={link.href} href={link.href} style={{ color: "rgba(248,248,255,0.6)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500, transition: "color 0.2s" }}
                        onMouseOver={e => (e.currentTarget.style.color = "#A855F7")}
                        onMouseOut={e => (e.currentTarget.style.color = "rgba(248,248,255,0.6)")}
                    >{link.label}</Link>
                ))}
            </div>

            {/* CTA */}
            <Link href="/carta-natal" className="btn-gold" style={{ padding: "0.55rem 1.25rem", fontSize: "0.8rem" }}>
                Empezar Gratis →
            </Link>
        </nav>
    );
}
