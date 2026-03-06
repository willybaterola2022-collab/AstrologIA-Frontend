"use client";
const PAINS = [
    "...repites los mismos patrones aunque lo sabes todo?",
    "...das todo en el amor y nunca recibes lo mismo?",
    "...el dinero no llega aunque trabajas más que nadie?",
    "...sabes que viniste a hacer algo importante pero no sabes qué?",
    "...tu familia te dejó una herida que no puedes nombrar?",
];

const TESTIMONIALS = [
    { name: "Marta G.", city: "Barcelona", age: 34, text: "Llevaba 10 años en terapia y en 40 minutos AstrologIA me dio el marco que nunca había encontrado. Mi Quirón en Libra lo explica todo.", stars: 5 },
    { name: "Carlos R.", city: "Madrid", age: 29, text: "El Detector de Patrones Tóxicos me hizo ver que repetí el mismo perfil exacto 4 veces. Ahora sé por qué — y cómo romper el ciclo.", stars: 5 },
    { name: "Lucía A.", city: "México DF", age: 31, text: "Mi Saturn Return me estaba destruyendo. El coach lo convirtió en el trampolín para lanzar mi empresa. Increíble precisión.", stars: 5 },
];

const COMPARISON = [
    { feat: "Cálculo astronómico real", co_star: false, the_pattern: false, us: true },
    { feat: "Psicología Junguiana clínica", co_star: false, the_pattern: "Parcial", us: true },
    { feat: "Las 8 dimensiones del ser", co_star: false, the_pattern: false, us: true },
    { feat: "Kabbalah / Sephirot integrada", co_star: false, the_pattern: false, us: true },
    { feat: "Herencia ancestral (Hellinger)", co_star: false, the_pattern: false, us: true },
    { feat: "Score de energía diario real", co_star: false, the_pattern: false, us: true },
    { feat: "Sinastría de 100 puntos", co_star: false, the_pattern: false, us: true },
    { feat: "En español clínico", co_star: false, the_pattern: false, us: true },
];

const MODULES_PREVIEW = [
    { icon: "🌑", name: "Quirón — La Herida y el Don", desc: "Por qué sufres exactamente donde más vales", endpoint: "/api/karmic-wound" },
    { icon: "💫", name: "Venus — Perfil de Amor", desc: "Cómo amas, cómo necesitas ser amado, qué te rompe", endpoint: "/api/venus-attraction" },
    { icon: "⚡", name: "Marte — Sombra y Fricción", desc: "Cómo te saboteas en relaciones sin darte cuenta", endpoint: "/api/mars-friction" },
    { icon: "🪐", name: "Arquitectura de Riqueza", desc: "Dónde está tu dinero según el universo y por qué no llega", endpoint: "/api/wealth-blueprint" },
    { icon: "⏰", name: "Reloj de Tránsitos", desc: "Cuándo actuar, cuándo esperar, cuándo soltar", endpoint: "/api/daily-transit-score" },
    { icon: "🌀", name: "Retorno de Saturno", desc: "La crisis de los 30 explicada y convertida en trampolín", endpoint: "/api/saturn-return" },
];

export default function ContentSections() {
    return (
        <>
            {/* DOLOR */}
            <section className="section-pad" style={{ background: "linear-gradient(180deg, transparent, rgba(124,58,237,0.06), transparent)" }}>
                <div className="container-sm" style={{ textAlign: "center" }}>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 700, marginBottom: "2.5rem" }}>
                        ¿Alguna vez sentiste que...
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 600, margin: "0 auto 2.5rem" }}>
                        {PAINS.map((p, i) => (
                            <div key={i} className="glass-card" style={{ padding: "1.25rem 1.75rem", textAlign: "left", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <span style={{ color: "#7C3AED", fontSize: "1.2rem", flexShrink: 0, marginTop: 2 }}>✦</span>
                                <span style={{ color: "rgba(248,248,255,0.75)", fontSize: "1rem", lineHeight: 1.6, fontStyle: "italic" }}>"{p}"</span>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: "1.1rem", color: "rgba(248,248,255,0.55)", lineHeight: 1.7 }}>
                        La astrología no es magia.<br />
                        Es el sistema de autoconocimiento más preciso que existe —<br />
                        <span style={{ color: "#A855F7", fontWeight: 600 }}>si se usa con rigor clínico y sin simplificaciones genéricas.</span>
                    </p>
                </div>
            </section>

            <div className="glow-divider" />

            {/* MÓDULOS PREVIEW */}
            <section className="section-pad">
                <div className="container-max">
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <span className="badge" style={{ marginBottom: "1rem" }}>✦ 18 Módulos</span>
                        <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700, marginBottom: "1rem" }}>
                            Más allá del <span className="text-gradient-violet">Manual del Ser</span>
                        </h2>
                        <p style={{ color: "rgba(248,248,255,0.5)", maxWidth: 520, margin: "0 auto" }}>
                            Cada módulo es una entrada diferente al mismo mapa. Tú decides cuánto quieres profundizar.
                        </p>
                    </div>
                    <div className="modules-grid">
                        {MODULES_PREVIEW.map(m => (
                            <div key={m.name} className="glass-card" style={{ padding: "1.5rem" }}>
                                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{m.icon}</div>
                                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.4rem" }}>{m.name}</h3>
                                <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.6 }}>{m.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                        <a href="#precios" className="btn-outline">Ver todos los módulos y planes →</a>
                    </div>
                </div>
            </section>

            <div className="glow-divider" />

            {/* COMPARATIVA */}
            <section className="section-pad">
                <div className="container-max">
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700 }}>
                            Por qué somos radicalmente diferentes
                        </h2>
                    </div>
                    <div className="glass-card" style={{ padding: "0 1rem", overflowX: "auto" }}>
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Funcionalidad</th>
                                    <th style={{ textAlign: "center" }}>Co-Star</th>
                                    <th style={{ textAlign: "center" }}>The Pattern</th>
                                    <th style={{ textAlign: "center", color: "#F59E0B" }}>AstrologIA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARISON.map(row => (
                                    <tr key={row.feat}>
                                        <td style={{ color: "rgba(248,248,255,0.7)" }}>{row.feat}</td>
                                        <td style={{ textAlign: "center" }}>{row.co_star === false ? <span style={{ color: "#EF4444" }}>✗</span> : <span style={{ color: "#10B981" }}>✓</span>}</td>
                                        <td style={{ textAlign: "center" }}>{row.the_pattern === false ? <span style={{ color: "#EF4444" }}>✗</span> : row.the_pattern === true ? <span style={{ color: "#10B981" }}>✓</span> : <span style={{ color: "#F59E0B", fontSize: "0.75rem" }}>{row.the_pattern}</span>}</td>
                                        <td style={{ textAlign: "center" }}>{row.us ? <span style={{ color: "#10B981", fontWeight: 700 }}>✓</span> : <span style={{ color: "#EF4444" }}>✗</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <div className="glow-divider" />

            {/* TESTIMONIOS */}
            <section className="section-pad">
                <div className="container-max">
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <span className="badge" style={{ marginBottom: "1rem" }}>✦ Lo que dicen</span>
                        <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 700 }}>
                            El momento &ldquo;ahá&rdquo;
                        </h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
                        {TESTIMONIALS.map(t => (
                            <div key={t.name} className="glass-card" style={{ padding: "1.75rem" }}>
                                <div style={{ color: "#F59E0B", fontSize: "0.9rem", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>
                                    {"★".repeat(t.stars)}
                                </div>
                                <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(248,248,255,0.75)", fontStyle: "italic", marginBottom: "1.25rem" }}>
                                    &ldquo;{t.text}&rdquo;
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700 }}>
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{t.name}, {t.age}</div>
                                        <div style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.4)" }}>{t.city}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="section-pad" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(124,58,237,0.18) 0%, transparent 70%)" }}>
                <div className="container-sm" style={{ textAlign: "center" }}>
                    <h2 className="font-display" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1.5rem" }}>
                        Nadie más conoce tu manual.
                        <br />
                        <span className="text-gradient-cosmic">Tú tampoco lo conoces todavía.</span>
                    </h2>
                    <p style={{ color: "rgba(248,248,255,0.55)", fontSize: "1.05rem", marginBottom: "2.5rem", lineHeight: 1.7 }}>
                        Empieza con tu Carta Natal. Es gratis.<br />
                        El universo lleva esperándote desde que naciste.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="#carta-natal" className="btn-gold" style={{ fontSize: "1.1rem", padding: "1.15rem 3rem" }}>
                            ✦ Descifra tu Carta Natal — Gratis
                        </a>
                        <a href="#módulos" className="btn-outline">
                            Ver el Manual del Ser →
                        </a>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "3rem 1.5rem 2rem" }}>
                <div className="container-max">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "2rem", marginBottom: "2rem" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>✦</div>
                                <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 600, fontSize: "1rem", background: "linear-gradient(135deg,#A855F7,#F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AstrologIA</span>
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.35)", lineHeight: 1.6 }}>
                                El autoconocimiento más preciso del universo.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.4)", marginBottom: "0.75rem" }}>Módulos</h4>
                            {["Carta Natal", "Manual del Ser", "Quirón", "Sinastría", "Saturn Return", "Tránsitos"].map(l => (
                                <a key={l} href="#carta-natal" style={{ display: "block", fontSize: "0.85rem", color: "rgba(248,248,255,0.5)", textDecoration: "none", marginBottom: "0.35rem" }}
                                    onMouseOver={e => (e.currentTarget.style.color = "#A855F7")}
                                    onMouseOut={e => (e.currentTarget.style.color = "rgba(248,248,255,0.5)")}
                                >{l}</a>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.4)", marginBottom: "0.75rem" }}>Legal</h4>
                            {["Privacidad", "Términos", "Cookies", "GDPR", "Cancelación"].map(l => (
                                <a key={l} href="#" style={{ display: "block", fontSize: "0.85rem", color: "rgba(248,248,255,0.5)", textDecoration: "none", marginBottom: "0.35rem" }}>{l}</a>
                            ))}
                        </div>
                    </div>
                    <div className="glow-divider" style={{ marginBottom: "1.5rem" }} />
                    <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(248,248,255,0.25)" }}>
                        © 2026 AstrologIA · Powered by Swiss Ephemeris + IA Clínica · Made with ✦
                    </p>
                </div>
            </footer>
        </>
    );
}
