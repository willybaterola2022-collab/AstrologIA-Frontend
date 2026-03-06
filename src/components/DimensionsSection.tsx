const DIMS = [
    { icon: "☀️", num: "01", title: "Quién eres", desc: "Sol + Luna + Ascendente en lenguaje junguiano. No 'eres Tauro'. Eres El Constructor Paciente con un sistema emocional Capricornio.", color: "#F59E0B" },
    { icon: "🌑", num: "02", title: "Por qué sufres", desc: "Quirón + Casa 12 + Saturno como mapa de heridas primarias. El punto exacto donde tu mayor dolor esconde tu mayor don.", color: "#7C3AED" },
    { icon: "⭐", num: "03", title: "Para qué viniste", desc: "Nodo Norte evolutivo (Green/Forrest/Caruti). Tu misión de alma — el camino que el universo diseñó exactamente para ti.", color: "#A855F7" },
    { icon: "💫", num: "04", title: "Cómo te relacionas", desc: "Venus + Marte + Plutón como arquitectura vincular. Por qué eliges a quien eliges. Por qué te saboteas donde más importa.", color: "#EC4899" },
    { icon: "🪐", num: "05", title: "Cómo fluye tu dinero", desc: "Júpiter + Casa 2/8/10 + Kabbalah de la Abundancia. Tu código de riqueza y los bloqueos exactos que lo frenan.", color: "#10B981" },
    { icon: "⏰", num: "06", title: "Cuándo actuar", desc: "Tránsitos personales como reloj de decisiones. El momento preciso para lanzar, negociar, soltar o esperar.", color: "#3B82F6" },
    { icon: "🌳", num: "07", title: "Tu código ancestral", desc: "Luna + Saturno como herencia psíquica familiar. Qué trauma de tu linaje viniste a sanar. (Hellinger + Jung)", color: "#8B5CF6" },
    { icon: "✡️", num: "08", title: "Tu frecuencia vibracional", desc: "Los Sephirot del Árbol de la Vida correspondientes a tu carta. Tu frecuencia cósmica según la Kabbalah clásica.", color: "#F59E0B" },
];

export default function DimensionsSection() {
    return (
        <section id="módulos" className="section-pad">
            <div className="container-max">
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                    <span className="badge" style={{ marginBottom: "1rem" }}>✦ El Manual del Ser</span>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700, marginBottom: "1rem" }}>
                        Lo que ninguna plataforma puede darte
                    </h2>
                    <p style={{ color: "rgba(248,248,255,0.55)", maxWidth: 560, margin: "0 auto", fontSize: "1rem" }}>
                        Ocho preguntas. Una respuesta exacta para ti. Construida con Swiss Ephemeris, psicología junguiana y Kabbalah clásica.
                    </p>
                </div>

                <div className="modules-grid">
                    {DIMS.map((d) => (
                        <div key={d.num} className="glass-card" style={{ padding: "1.75rem", position: "relative", overflow: "hidden" }}>
                            <div style={{
                                position: "absolute", top: -20, right: -20,
                                width: 80, height: 80, borderRadius: "50%",
                                background: `radial-gradient(circle, ${d.color}22, transparent)`,
                            }} />
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                <span style={{ fontSize: "1.5rem" }}>{d.icon}</span>
                                <span style={{ fontFamily: "'Cinzel',serif", fontSize: "0.65rem", color: d.color, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                                    Dimensión {d.num}
                                </span>
                            </div>
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.6rem", color: "#F8F8FF" }}>
                                {d.title}
                            </h3>
                            <p style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.55)", lineHeight: 1.65 }}>
                                {d.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                    <a href="#carta-natal" className="btn-gold">
                        Obtener mi Manual del Ser Completo →
                    </a>
                </div>
            </div>
        </section>
    );
}
