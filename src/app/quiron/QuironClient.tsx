"use client";
import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const SIGNS = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];

const CHIRON_SIGNS = [
    { sign: "Aries", wound: "La herida de la identidad — 'No tengo derecho a existir como soy'", gift: "Pionero del autoconocimiento. Maestro del valor de ser.", liberation: "Actuar desde el ser, no desde la aprobación." },
    { sign: "Tauro", wound: "La herida de la supervivencia — 'El mundo no es un lugar seguro para mí'", gift: "Maestro de la presencia corporal y el valor real de las cosas.", liberation: "Confiar en que eres suficiente sin necesitar acumular." },
    { sign: "Géminis", wound: "La herida de la mente — 'Mis ideas no valen, nadie me escucha'", gift: "El comunicador que habla desde la herida y conecta corazones.", liberation: "Hablar desde la autenticidad, no desde el miedo al juicio." },
    { sign: "Cáncer", wound: "La herida del hogar — 'No fui protegido cuando más lo necesitaba'", gift: "El nutrido que sana familias enteras. Terapeuta por naturaleza.", liberation: "Cuidarte a ti primero sin sentirlo como egoísmo." },
    { sign: "Leo", wound: "La herida del reconocimiento — 'No soy visto, no soy especial para nadie'", gift: "El artista que ilumina al mundo precisamente porque conoce la oscuridad.", liberation: "Brillar sin necesitar validación externa como condición." },
    { sign: "Virgo", wound: "La herida de la imperfección — 'Nunca soy suficientemente bueno'", gift: "El sanador meticuloso que convierte el caos en orden funcional.", liberation: "Servir desde el amor, no desde el miedo a fallar." },
    { sign: "Libra", wound: "La herida de la armonía — 'Si digo lo que pienso, pierdo el amor'", gift: "El mediador que reinventa la justicia desde el corazón.", liberation: "Decir no sosteniendo el amor. La paz viene del respeto mutuo." },
    { sign: "Escorpio", wound: "La herida de la traición — 'Confié y fui destruido'", gift: "El guía que acompaña transformaciones profundas sin miedo.", liberation: "Confiar de nuevo desde la discernimiento, no desde el miedo." },
    { sign: "Sagitario", wound: "La herida del sentido — 'El universo es aleatorio y cruel'", gift: "El filósofo que encuentra significado en las grietas del mundo.", liberation: "Abrazar la incertidumbre como maestro, no como amenaza." },
    { sign: "Capricornio", wound: "La herida de la autoridad — 'Debo trabajar hasta morir para merecer'", gift: "El líder que construye estructuras con corazón y propósito.", liberation: "El éxito desde la vocación, no desde el miedo al fracaso." },
    { sign: "Acuario", wound: "La herida de la pertenencia — 'Soy demasiado raro — nunca encajo'", gift: "El visionario que lidera a la humanidad precisamente por ser diferente.", liberation: "La diferencia no es tu condena. Es tu misión." },
    { sign: "Piscis", wound: "La herida de la disolución — 'No sé dónde termino yo y dónde empieza el otro'", gift: "El místico que disuelve el ego para sanar a los demás.", liberation: "Los límites son amor — no traición a tu espíritu." },
];

export default function QuironClient() {
    const [form, setForm] = useState({ year: "1990", month: "6", day: "15", hour: "12", lat: "40.4168", lon: "-3.7038" });
    const [chironSign, setChironSign] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<number | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/karmic-wound`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer demo" },
                body: JSON.stringify({ year: +form.year, month: +form.month, day: +form.day, hour: +form.hour, lat: +form.lat, lon: +form.lon }),
            });
            if (!res.ok) throw new Error();
            const d = await res.json();
            setChironSign(d.data?.chiron?.sign || d.chiron_sign || null);
        } catch {
            const jd = (+form.year - 2000) * 365.25 + +form.month * 30.44 + +form.day;
            setChironSign(SIGNS[Math.floor(((jd * 7.2 + 15) % 360) / 30) % 12]);
        }
        setLoading(false);
    };

    const chironData = CHIRON_SIGNS.find(c => chironSign && c.sign === chironSign);

    return (
        <>
            <StarField />
            <Navbar />
            <main>
                {/* HERO */}
                <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "9rem 1.5rem 4rem", background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 70%)" }}>
                    <div className="container-sm">
                        <span className="badge" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>⚕️ El Sanador Herido</span>
                        <h1 className="font-display" style={{ fontSize: "clamp(2rem,5vw,4.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem" }}>
                            ¿Por qué sufres exactamente<br />
                            <span className="text-gradient-violet">donde más vales?</span>
                        </h1>
                        <p style={{ fontSize: "clamp(1rem,1.8vw,1.2rem)", color: "rgba(248,248,255,0.65)", maxWidth: 580, margin: "0 auto 2rem", lineHeight: 1.75 }}>
                            Quirón no es solo una herida. Es el mapa de tu mayor don oculto. El punto donde tu dolor más profundo se convierte en tu medicina más poderosa — para ti y para quienes te rodean.
                        </p>
                        <a href="#calcular" className="btn-gold">⚕️ Descubrir mi Quirón</a>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* QUÉ ES QUIRÓN */}
                <section className="section-pad">
                    <div className="container-sm">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                            <div>
                                <h2 className="font-display" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, marginBottom: "1.25rem" }}>
                                    El asteroide que lo cambia todo
                                </h2>
                                <p style={{ color: "rgba(248,248,255,0.65)", lineHeight: 1.75, marginBottom: "1rem", fontSize: "0.95rem" }}>
                                    Quirón es el astro entre Saturno y Urano. En la mitología griega era el centauro sabio que sanaba a todos... excepto a sí mismo. Esa paradoja es exactamente lo que marca en tu carta natal.
                                </p>
                                <p style={{ color: "rgba(248,248,255,0.65)", lineHeight: 1.75, fontSize: "0.95rem" }}>
                                    El signo y la casa donde está Quirón en tu carta señalan el área donde experimentaste la herida más profunda en la infancia — y donde, paradójicamente, guardas el mayor potencial de sanar a otros.
                                </p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {[
                                    { icon: "🌑", title: "La Herida", desc: "Llega antes de que puedas defenderte — en la primera infancia, en el cuerpo, en el vínculo familiar" },
                                    { icon: "✦", title: "El Don", desc: "Exactamente donde más duele esconde la mayor capacidad de transformar a otros" },
                                    { icon: "🌕", title: "La Medicina", desc: "Cuando nombramos la herida y dejamos de ocultarla, se convierte en el mayor activo de nuestra vida" },
                                ].map(item => (
                                    <div key={item.title} className="glass-card" style={{ padding: "1.25rem", display: "flex", gap: "1rem" }}>
                                        <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{item.title}</div>
                                            <div style={{ fontSize: "0.82rem", color: "rgba(248,248,255,0.5)", lineHeight: 1.6 }}>{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* CALCULADORA */}
                <section id="calcular" className="section-pad" style={{ background: "rgba(124,58,237,0.04)" }}>
                    <div className="container-max">
                        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700 }}>¿En qué signo está tu Quirón?</h2>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "2rem" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem", marginBottom: "0.65rem" }}>
                                    {[["Año", "year"], ["Mes", "month"], ["Día", "day"]].map(([l, k]) => (
                                        <div key={k}>
                                            <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.3rem", textTransform: "uppercase" }}>{l}</label>
                                            <input className="cosmic-input" style={{ padding: "0.6rem" }} value={form[k as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginBottom: "1.5rem" }}>
                                    <label style={{ display: "block", fontSize: "0.7rem", color: "rgba(248,248,255,0.4)", marginBottom: "0.3rem", textTransform: "uppercase" }}>Hora</label>
                                    <input className="cosmic-input" type="number" min="0" max="23.9" step="0.5" value={form.hour} onChange={e => setForm(p => ({ ...p, hour: e.target.value }))} />
                                </div>
                                <button type="submit" className="btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                                    {loading ? "Calculando tu Quirón..." : "⚕️ Calcular mi Quirón"}
                                </button>
                            </form>

                            {chironData ? (
                                <div className="glass-card" style={{ padding: "2rem", borderColor: "rgba(124,58,237,0.3)" }}>
                                    <div style={{ fontSize: "0.75rem", color: "#A855F7", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>QUIRÓN EN</div>
                                    <h3 className="font-display text-gradient-violet" style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.25rem" }}>{chironData.sign}</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        {[
                                            { label: "🌑 Tu Herida", text: chironData.wound },
                                            { label: "✦ Tu Don", text: chironData.gift },
                                            { label: "🌕 Tu Liberación", text: chironData.liberation },
                                        ].map(item => (
                                            <div key={item.label} style={{ borderLeft: "2px solid rgba(124,58,237,0.3)", paddingLeft: "1rem" }}>
                                                <div style={{ fontSize: "0.75rem", color: "#A855F7", fontWeight: 600, marginBottom: "0.3rem" }}>{item.label}</div>
                                                <div style={{ fontSize: "0.85rem", color: "rgba(248,248,255,0.7)", lineHeight: 1.65 }}>{item.text}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <a href="/manual-del-ser" className="btn-cosmic" style={{ display: "flex", justifyContent: "center", textDecoration: "none", marginTop: "1.5rem" }}>
                                        Ver análisis clínico completo →
                                    </a>
                                </div>
                            ) : (
                                <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center" }}>
                                    <div style={{ fontSize: "3rem", opacity: 0.2, marginBottom: "1rem" }}>⚕️</div>
                                    {/* Browse all 12 signs */}
                                    <p style={{ color: "rgba(248,248,255,0.4)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>O explora Quirón en los 12 signos:</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center" }}>
                                        {CHIRON_SIGNS.map((c, i) => (
                                            <button key={c.sign} onClick={() => { setChironSign(c.sign); setPreview(i); }} style={{
                                                padding: "0.3rem 0.7rem", borderRadius: "9999px", border: "1px solid rgba(124,58,237,0.2)",
                                                background: preview === i ? "rgba(124,58,237,0.15)" : "transparent",
                                                color: "rgba(248,248,255,0.6)", fontSize: "0.75rem", cursor: "pointer",
                                            }}>{c.sign}</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="glow-divider" />

                {/* CTA */}
                <section className="section-pad" style={{ textAlign: "center" }}>
                    <div className="container-sm">
                        <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
                            Tu herida no es tu debilidad.<br />
                            <span className="text-gradient-cosmic">Es tu mayor activo.</span>
                        </h2>
                        <p style={{ color: "rgba(248,248,255,0.45)", marginBottom: "2rem" }}>El análisis clínico completo de Quirón está en el Manual del Ser.</p>
                        <a href="/manual-del-ser" className="btn-gold">✦ Ver mi Manual del Ser completo</a>
                    </div>
                </section>

                <footer style={{ padding: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "rgba(248,248,255,0.25)" }}>© 2026 AstrologIA · <a href="/" style={{ color: "#7C3AED", textDecoration: "none" }}>Inicio</a></p>
                </footer>
            </main>
        </>
    );
}
