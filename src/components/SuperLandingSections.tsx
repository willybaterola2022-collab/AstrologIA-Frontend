"use client";
import Link from "next/link";

// S03 — The Problem Section with native AdSense-style card
export function ProblemSection() {
    return (
        <section className="section-pad" style={{ background: "rgba(0,0,0,0.2)" }}>
            <div className="container-sm">
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span className="badge" style={{ marginBottom: "0.75rem", display: "inline-flex", background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)", color: "#EF4444" }}>
                        El problema
                    </span>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1rem" }}>
                        Por qué el horóscopo te falla cada vez
                    </h2>
                    <p style={{ color: "rgba(248,248,255,0.45)", fontSize: "0.95rem", maxWidth: 540, margin: "0 auto" }}>
                        El signo solar es solo el 8% de tu carta natal. El otro 92% nadie te lo ha mostrado.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {[
                        { icon: "📰", title: "Genérico para millones", desc: "El mismo texto para todos los Escorpios del planeta. Tu carta es única como tu huella dactilar." },
                        { icon: "🔮", title: "Signo solar solamente", desc: "Ignora tu Luna (emociones), tu Ascendente (presencia), Marte, Venus y 9 planetas más." },
                        { icon: "🎯", title: "Sin aplicación real", desc: "Te dice que 'es un buen día para relaciones.' No te dice QUÉ hacer con tu Quirón en Cancér." },
                        { icon: "🧠", title: "Sin psicología profunda", desc: "Ningún horóscopo te explica el patrón tóxico que repites. Tu carta natal sí lo hace." },
                        { icon: "💸", title: "Consultas a €150/hora", desc: "Los astrólogos buenos cuestan lo que no todos pueden pagar. AstrologIA lo democratiza." },
                    ].map(item => (
                        <div key={item.title} className="glass-card" style={{ padding: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "1.3rem", flexShrink: 0, marginTop: "0.1rem" }}>{item.icon}</span>
                            <div>
                                <h3 style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.3rem" }}>{item.title}</h3>
                                <p style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.45)", lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Native Ad Placement — ético, nativo, alineado */}
                <div style={{
                    padding: "1rem 1.25rem", borderRadius: "0.75rem",
                    border: "1px solid rgba(245,158,11,0.15)", background: "rgba(245,158,11,0.03)",
                    display: "flex", gap: "1rem", alignItems: "center",
                }}>
                    <span style={{ fontSize: "1.5rem" }}>📚</span>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.15rem" }}>
                            "Quién eres realmente" — Howard Sasportas
                        </p>
                        <p style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.35)" }}>
                            La guía más completa sobre psicología astrológica junguiana. Perfecto para acompañar tu análisis.
                        </p>
                    </div>
                    <a href="https://www.amazon.es/s?k=astrologia+junguiana" target="_blank" rel="noopener noreferrer sponsored" style={{ fontSize: "0.72rem", color: "#F59E0B", textDecoration: "none", flexShrink: 0, fontWeight: 600 }}>
                        Ver →
                    </a>
                    <span style={{ fontSize: "0.55rem", color: "rgba(248,248,255,0.15)", flexShrink: 0 }}>Patrocinado</span>
                </div>
            </div>
        </section>
    );
}

// S07 — Nodo Norte teaser section
export function NodoNorteTeaser() {
    return (
        <section className="section-pad" style={{ background: "rgba(124,58,237,0.03)" }}>
            <div className="container-sm">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
                    <div>
                        <span className="badge" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>⬆️ Nodo Norte</span>
                        <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,2.5vw,2.2rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1rem" }}>
                            La respuesta al "¿para qué vine a este mundo?"
                        </h2>
                        <p style={{ color: "rgba(248,248,255,0.5)", fontSize: "0.9rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                            Hay un punto en tu carta natal que sabe exactamente cuál es tu misión en esta vida. No como metáfora — como cálculo astronómico de precisión. El <strong style={{ color: "#F8F8FF" }}>Nodo Norte</strong> es el vector evolutivo de tu alma.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem" }}>
                            {[
                                "Qué viniste a aprender y desarrollar en esta vida",
                                "Qué traes trabajado del pasado (Nodo Sur)",
                                "Cómo activar tu misión en el trabajo, relaciones y propósito",
                            ].map(t => (
                                <div key={t} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                                    <span style={{ color: "#A855F7", marginTop: "0.1rem", flexShrink: 0 }}>✦</span>
                                    <span style={{ fontSize: "0.83rem", color: "rgba(248,248,255,0.55)" }}>{t}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/mision-de-vida-nodo-norte" className="btn-gold" style={{ display: "inline-flex" }}>
                            Calcular mi misión de vida →
                        </Link>
                    </div>
                    <div className="glass-card" style={{ padding: "1.75rem", textAlign: "center" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⬆️</div>
                        <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.25)", marginBottom: "0.5rem" }}>Ejemplo · Nodo Norte en</p>
                        <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.6rem", fontWeight: 700, background: "linear-gradient(135deg,#A855F7,#60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.25rem" }}>
                            Escorpio — Casa 8
                        </h3>
                        <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.7, marginBottom: "1rem" }}>
                            "Tu misión es transformar el miedo en poder. Viniste a sumergirte en las profundidades — la muerte, la sexualidad, el dinero de los demás — y convertirlos en recursos para ti y para otros."
                        </p>
                        <p style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.25)" }}>144 combinaciones únicas · Swiss Ephemeris</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// S08 — Patrones Relacionales teaser
export function PatronesTeaser() {
    const ARQUETIPOS = [
        { name: "El Rescatador", emoji: "🩹", desc: "Siempre cuidas, niegas tus necesidades", planet: "Venus ♓ + Quirón" },
        { name: "El Espejo", emoji: "🪞", desc: "Atraes a quien eres tú sin reconocerlo", planet: "Luna + Plutón" },
        { name: "El Fusionador", emoji: "🌊", desc: "Pierdes tu identidad en la pareja", planet: "Neptuno + Casa 7" },
        { name: "El Maduro", emoji: "👑", desc: "Buscas estabilidad, a veces limitas tu pasión", planet: "Saturno + Venus" },
    ];

    return (
        <section className="section-pad" style={{ background: "rgba(0,0,0,0.25)" }}>
            <div className="container-sm">
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <span className="badge" style={{ marginBottom: "0.75rem", display: "inline-flex", background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.15)", color: "#F87171" }}>
                        💔 Patrones Relacionales
                    </span>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2.3rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1rem" }}>
                        Por qué siempre atraes a la misma persona
                    </h2>
                    <p style={{ color: "rgba(248,248,255,0.45)", fontSize: "0.9rem", maxWidth: 520, margin: "0 auto" }}>
                        Diferente nombre, diferente cara — mismo patrón. Tu Venus, tu Marte y tu Casa 7 lo llevan escrito. Nosotros lo nombramos.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {ARQUETIPOS.map(a => (
                        <div key={a.name} className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
                            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{a.emoji}</div>
                            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.35rem" }}>{a.name}</h3>
                            <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.4)", lineHeight: 1.5, marginBottom: "0.5rem" }}>{a.desc}</p>
                            <span style={{ fontSize: "0.65rem", color: "rgba(168,85,247,0.6)", fontFamily: "monospace" }}>{a.planet}</span>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.35)", marginBottom: "1.25rem" }}>8 arquetipos · Basado en Venus, Marte, Casa 7, Quirón y Plutón</p>
                    <Link href="/por-que-repites-patrones-en-amor" className="btn-primary">Descubrir mi patrón →</Link>
                </div>

                {/* Native Ad */}
                <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", borderRadius: "0.75rem", border: "1px solid rgba(239,68,68,0.1)", background: "rgba(239,68,68,0.03)", display: "flex", gap: "1rem", alignItems: "center" }}>
                    <span style={{ fontSize: "1.3rem" }}>🤍</span>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.1rem" }}>Terapia de pareja online — Sin espera</p>
                        <p style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.35)" }}>Plataforma de psicólogos certificados. Primera sesión con descuento.</p>
                    </div>
                    <a href="#" style={{ fontSize: "0.72rem", color: "#F87171", textDecoration: "none", fontWeight: 600 }}>Ver →</a>
                    <span style={{ fontSize: "0.55rem", color: "rgba(248,248,255,0.15)" }}>Patrocinado</span>
                </div>
            </div>
        </section>
    );
}

// S12 — Wealth Timer teaser (ROCKSTAR)
export function WealthTimerTeaser() {
    return (
        <section className="section-pad" style={{ background: "linear-gradient(180deg, rgba(245,158,11,0.04) 0%, transparent 100%)" }}>
            <div className="container-sm">
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <span className="badge" style={{ marginBottom: "0.75rem", display: "inline-flex", background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.25)", color: "#F59E0B" }}>
                        💰 Wealth Timer™ — Exclusivo
                    </span>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2.3rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1rem" }}>
                        ¿Cuándo es tu mejor ventana para ganar dinero?
                    </h2>
                    <p style={{ color: "rgba(248,248,255,0.45)", fontSize: "0.9rem", maxWidth: 520, margin: "0 auto" }}>
                        Júpiter, Venus y el Sol pasan por las casas de dinero de tu carta en momentos muy específicos. Wealth Timer™ calcula los 3 picos de energía económica en los próximos 90 días.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: "2rem", maxWidth: 500, margin: "0 auto", borderColor: "rgba(245,158,11,0.2)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                        {[
                            { week: "14–21 Abril", score: 94, label: "Ventana MÁXIMA", color: "#F59E0B", desc: "Júpiter trínando tu Medio Cielo. Presenta, negocia, sé visible." },
                            { week: "2–9 Mayo", score: 72, label: "Ventana ALTA", color: "#10B981", desc: "Venus en tu Casa 2. Bueno para cierres y acuerdos de valor." },
                            { week: "19–26 Mayo", score: 58, label: "Ventana MEDIA", color: "#60A5FA", desc: "Luna Nueva en tu Casa 10. Siembra intenciones de carrera." },
                        ].map(item => (
                            <div key={item.week} style={{ padding: "0.85rem 1rem", borderRadius: "0.6rem", background: "rgba(255,255,255,0.03)", border: `1px solid ${item.color}30` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: item.color }}>{item.label}</span>
                                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: item.color }}>{item.score}/100</span>
                                </div>
                                <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, marginBottom: "0.4rem" }}>
                                    <div style={{ height: "100%", width: `${item.score}%`, background: item.color, borderRadius: 99 }} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.4)" }}>{item.week}</span>
                                    <span style={{ fontSize: "0.7rem", color: "rgba(248,248,255,0.35)", maxWidth: 200, textAlign: "right" }}>{item.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "0.72rem", color: "rgba(248,248,255,0.25)", marginBottom: "0.75rem" }}>* Ejemplo basado en carta natal tipo · Tu análisis será distinto</p>
                        <Link href="/ventanas-de-fortuna-astrologica" className="btn-gold" style={{ display: "inline-flex" }}>
                            Ver mis ventanas de dinero →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

// S13 — Malka teaser (ROCKSTAR)
export function MalkaTeaser() {
    return (
        <section className="section-pad" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)" }}>
            <div className="container-sm">
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <span className="badge" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>🎙️ Malka · Astróloga IA de Voz</span>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1rem" }}>
                        La primera astróloga que te escucha
                    </h2>
                    <p style={{ color: "rgba(248,248,255,0.45)", fontSize: "0.9rem", maxWidth: 480, margin: "0 auto 2rem" }}>
                        Malka conoce tu carta natal completa, sabe qué está pasando en el cielo hoy, y responde tus preguntas más profundas — por voz, en tiempo real.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: "2rem", maxWidth: 480, margin: "0 auto", textAlign: "center", border: "1px solid rgba(124,58,237,0.3)" }}>
                    {/* Fake conversation */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.75rem", textAlign: "left" }}>
                        <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>👤</span>
                            <div style={{ background: "rgba(255,255,255,0.06)", padding: "0.6rem 0.85rem", borderRadius: "0 0.75rem 0.75rem 0.75rem", fontSize: "0.8rem", color: "rgba(248,248,255,0.7)" }}>
                                "Malka, ¿por qué siempre termino atrayendo personas que me necesitan?"
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", justifyContent: "flex-end" }}>
                            <div style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", padding: "0.6rem 0.85rem", borderRadius: "0.75rem 0 0.75rem 0.75rem", fontSize: "0.8rem", color: "rgba(248,248,255,0.8)", maxWidth: "80%" }}>
                                "Tienes Quirón en Piscis en la Casa 12 tocando Venus. La herida de la invisibilidad te hace poner las necesidades ajenas antes que las tuyas. Es tu don también — tu capacidad de sentir al otro es extraordinaria. Pero primero tienes que sentirte a ti misma..."
                            </div>
                            <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>✨</span>
                        </div>
                    </div>

                    {/* Mic button */}
                    <Link href="/malka" style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 72, height: 72, borderRadius: "50%",
                        background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
                        border: "2px solid rgba(124,58,237,0.5)",
                        boxShadow: "0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(124,58,237,0.15)",
                        textDecoration: "none", fontSize: "1.8rem",
                        marginBottom: "1rem",
                        animation: "pulse 2s ease-in-out infinite",
                    }}>🎙️</Link>
                    <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.35)" }}>Presiona para hablar con Malka · Auriculares recomendados</p>
                </div>
            </div>
        </section>
    );
}

// S16 — Testimonials
export function TestimonialsSection() {
    const TESTIMONIALS = [
        { name: "Valeria M.", sign: "Escorpio ♏", text: "Cuando vi mi Nodo Norte en Acuario en Casa 11, entendí por qué siempre me había sentido distinta. No rara — pionera. Eso cambió todo.", avatar: "🌟" },
        { name: "Carlos R.", sign: "Sagitario ♐", text: "El Wealth Timer me dijo que esperara hasta mayo para negociar mi contrato. Esperé. Subida del 34%. No es casualidad, es timing.", avatar: "⭐" },
        { name: "Ana L.", sign: "Cáncer ♋", text: "Descubrí que soy 'El Rescatador' en relaciones gracias a los Patrones. Ahora entiendo por qué me agotaba tanto. Por fin tengo herramientas.", avatar: "✨" },
        { name: "Miguel T.", sign: "Géminis ♊", text: "Malka es de otro planeta (literalmente). Le pregunté sobre mi miedo al compromiso y respondió como si me conociera de toda la vida. Por el Marte en Virgo en Casa 7.", avatar: "🌙" },
        { name: "Laura P.", sign: "Capricornio ♑", text: "Mi terapeuta y yo llevamos 2 años trabajando mi patrón de abandono. En 10 minutos con AstrologIA lo vi nombrado y mapeado. Lloré.", avatar: "💫" },
        { name: "Diego F.", sign: "Aries ♈", text: "Pensé que era solo astrología. Es autoconocimiento de verdad. El Manual del Ser me dio más insights que 3 tests de personalidad juntos.", avatar: "🔥" },
    ];

    return (
        <section className="section-pad" style={{ background: "rgba(0,0,0,0.1)" }}>
            <div className="container-sm">
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
                        Vidas que cambiaron con su carta
                    </h2>
                    <p style={{ color: "rgba(248,248,255,0.35)", fontSize: "0.85rem" }}>Testimonios reales de nuestra comunidad</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem" }}>
                    {TESTIMONIALS.map(t => (
                        <div key={t.name} className="glass-card" style={{ padding: "1.25rem" }}>
                            <p style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.6)", lineHeight: 1.75, marginBottom: "1rem", fontStyle: "italic" }}>
                                &ldquo;{t.text}&rdquo;
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>{t.avatar}</span>
                                <div>
                                    <p style={{ fontSize: "0.78rem", fontWeight: 700 }}>{t.name}</p>
                                    <p style={{ fontSize: "0.68rem", color: "rgba(248,248,255,0.3)" }}>{t.sign}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// S17 — Comparison table
export function ComparisonSection() {
    const rows = [
        { feature: "Precisión del análisis", generic: "Signo solar (1/12)", astrologia: "12 planetas + casas + aspectos" },
        { feature: "Personalización", generic: "Para millones de personas", astrologia: "Único como tu huella dactilar" },
        { feature: "Psicología profunda", generic: "❌", astrologia: "Jung + Hellinger + Kabbalah" },
        { feature: "Patrones tóxicos", generic: "❌", astrologia: "8 arquetipos relacionales" },
        { feature: "Propósito de vida", generic: "Genérico", astrologia: "Nodo Norte exacto por signo y casa" },
        { feature: "Timing financiero", generic: "❌", astrologia: "Wealth Timer™ — 90 días" },
        { feature: "Astróloga de voz", generic: "❌", astrologia: "Malka — 24/7 disponible" },
        { feature: "Coste", generic: "€0 (pero sin valor real)", astrologia: "Gratis hasta que lo necesitas de verdad" },
    ];

    return (
        <section className="section-pad" style={{ background: "rgba(124,58,237,0.02)" }}>
            <div className="container-sm">
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
                        AstrologIA vs el resto
                    </h2>
                </div>
                <div className="glass-card" style={{ overflow: "hidden", padding: 0 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr" }}>
                        <div style={{ padding: "0.85rem 1rem", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.25)", fontWeight: 700 }}>Análisis</div>
                        <div style={{ padding: "0.85rem 1rem", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(248,248,255,0.25)", fontWeight: 700, textAlign: "center" }}>Horóscopo genérico</div>
                        <div style={{ padding: "0.85rem 1rem", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#A855F7", fontWeight: 700, textAlign: "center", background: "rgba(124,58,237,0.1)" }}>✦ AstrologIA</div>
                    </div>
                    {rows.map((row, i) => (
                        <div key={row.feature} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", borderTop: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                            <div style={{ padding: "0.75rem 1rem", fontSize: "0.8rem", color: "rgba(248,248,255,0.55)" }}>{row.feature}</div>
                            <div style={{ padding: "0.75rem 1rem", fontSize: "0.78rem", color: "rgba(248,248,255,0.35)", textAlign: "center" }}>{row.generic}</div>
                            <div style={{ padding: "0.75rem 1rem", fontSize: "0.78rem", color: "#A855F7", textAlign: "center", fontWeight: 600, background: "rgba(124,58,237,0.05)" }}>{row.astrologia}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// S20 — Final CTA
export function FinalCTASection() {
    return (
        <section className="section-pad" style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(124,58,237,0.12) 0%, transparent 70%)",
            textAlign: "center"
        }}>
            <div className="container-sm">
                <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>✦</div>
                <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, marginBottom: "1.25rem" }}>
                    Tu mapa está esperando.<br />
                    <span style={{ background: "linear-gradient(135deg,#A855F7,#F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        El universo sí tiene un plan para ti.
                    </span>
                </h2>
                <p style={{ color: "rgba(248,248,255,0.45)", fontSize: "1rem", maxWidth: 460, margin: "0 auto 2rem", lineHeight: 1.7 }}>
                    Más de 12,000 personas ya descubrieron su carta natal con AstrologIA. Tu análisis completo tarda 30 segundos.
                </p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/carta-natal" className="btn-gold" style={{ padding: "0.9rem 2.25rem", fontSize: "1rem" }}>
                        Calcular mi carta natal →
                    </Link>
                    <Link href="/malka" style={{
                        padding: "0.9rem 2.25rem", fontSize: "1rem", borderRadius: "0.75rem",
                        border: "1px solid rgba(124,58,237,0.4)", color: "rgba(248,248,255,0.7)",
                        textDecoration: "none", fontWeight: 600, transition: "all 0.2s",
                    }}>
                        🎙️ Hablar con Malka
                    </Link>
                </div>
                <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.2)", marginTop: "1.5rem" }}>
                    ✦ Gratis para empezar · Sin tarjeta de crédito · Cancelación inmediata
                </p>
            </div>
        </section>
    );
}
