export default function HeroSection() {
    return (
        <section style={{
            minHeight: "100vh", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "8rem 1.5rem 4rem",
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)",
        }}>
            <div className="container-sm">
                <div className="badge animate-pulse-glow" style={{ marginBottom: "1.75rem", display: "inline-flex" }}>
                    ✦ Swiss Ephemeris · IA Clínica · 18 Módulos
                </div>

                <h1 className="font-display" style={{
                    fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900,
                    lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.02em",
                }}>
                    El universo escribió tu{" "}
                    <span className="text-gradient-cosmic">manual completo</span>
                    {" "}en el momento de nacer.
                </h1>

                <p style={{
                    fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "rgba(248,248,255,0.65)",
                    maxWidth: 600, margin: "0 auto 2.5rem", lineHeight: 1.7,
                }}>
                    No es tu horóscopo. No es tu signo solar.
                    Es el mapa completo de tu psicología, tus heridas, tu misión
                    y el momento exacto en que debes actuar.
                </p>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <a href="#carta-natal" className="btn-gold">
                        ✦ Descifra tu Carta Natal — Gratis
                    </a>
                    <a href="#módulos" className="btn-outline">
                        Ver las 8 dimensiones ↓
                    </a>
                </div>

                {/* Social proof micro */}
                <div style={{ marginTop: "3rem", display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        ["18", "Módulos de análisis"],
                        ["8", "Dimensiones del alma"],
                        ["100%", "Cálculo personalizado"],
                    ].map(([n, label]) => (
                        <div key={n} style={{ textAlign: "center" }}>
                            <div className="font-display text-gradient-violet" style={{ fontSize: "2rem", fontWeight: 700 }}>{n}</div>
                            <div style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Scroll indicator */}
                <div style={{ marginTop: "4rem", opacity: 0.4, animation: "float 2.5s ease-in-out infinite" }}>
                    <div style={{ width: 1.5, height: 48, background: "linear-gradient(to bottom,rgba(124,58,237,0.8),transparent)", margin: "0 auto", borderRadius: 9 }} />
                    <div style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.4)", marginTop: "0.5rem", letterSpacing: "0.1em" }}>SCROLL</div>
                </div>
            </div>
        </section>
    );
}
