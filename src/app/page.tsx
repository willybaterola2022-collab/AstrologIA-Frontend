import StarField from "@/components/StarField";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NatalChartSection from "@/components/NatalChartSection";
import DimensionsSection from "@/components/DimensionsSection";
import ContentSections from "@/components/ContentSections";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import BinauralSection from "@/components/BinauralSection";
import BreathingSection from "@/components/BreathingSection";
import CosmicToday from "@/components/CosmicToday";
import GlobalFooter from "@/components/GlobalFooter";
import {
  ProblemSection,
  NodoNorteTeaser,
  PatronesTeaser,
  WealthTimerTeaser,
  MalkaTeaser,
  TestimonialsSection,
  ComparisonSection,
  FinalCTASection,
} from "@/components/SuperLandingSections";

export default function Home() {
  return (
    <>
      <StarField />
      <Navbar />
      <main>

        {/* S01 — HERO — Gancho emocional + CTA inmediato */}
        <HeroSection />
        <div className="glow-divider" />

        {/* S02 — CLIMA CÓSMICO HOY — Motor de retención diaria (live) */}
        <CosmicToday />
        <div className="glow-divider" />

        {/* S03 — EL PROBLEMA — Por qué el horóscopo falla + native ad */}
        <ProblemSection />
        <div className="glow-divider" />

        {/* S04 — CARTA NATAL LIVE — Calculadora Big 3 interactiva */}
        <NatalChartSection />
        <div className="glow-divider" />

        {/* S05 — LAS 8 DIMENSIONES — Manual del Ser preview */}
        <DimensionsSection />
        <div className="glow-divider" />

        {/* S06 — TRUST BAR — Credenciales científicas + psicológicas */}
        <section className="section-pad-sm" style={{ background: "rgba(124,58,237,0.04)" }}>
          <div className="container-max">
            <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
              {[
                "✦ Swiss Ephemeris · Precisión Astronómica NASA-grade",
                "✦ Psicología Junguiana Clínica",
                "✦ Kabbalah + Hellinger + Transpersonal",
                "✦ 18 Módulos · 144 Combinaciones",
                "✦ 12,000+ usuarios activos",
              ].map(t => (
                <span key={t} style={{ fontSize: "0.78rem", color: "rgba(248,248,255,0.4)", letterSpacing: "0.03em" }}>{t}</span>
              ))}
            </div>
          </div>
        </section>
        <div className="glow-divider" />

        {/* S07 — NODO NORTE — "Para qué vine al mundo" (alma/misión) */}
        <NodoNorteTeaser />
        <div className="glow-divider" />

        {/* S08 — PATRONES RELACIONALES — 8 arquetipos viral + native ad */}
        <PatronesTeaser />
        <div className="glow-divider" />

        {/* S09 — SINASTRÍA — Compatibilidad de pareja */}
        <ContentSections />
        <div className="glow-divider" />

        {/* S10 — SINTONÍA PLANETARIA — Binaural beats + audio cósmico */}
        <BinauralSection />
        <div className="glow-divider" />

        {/* S11 — PACING SOMÁTICO — Respiración astrológica */}
        <BreathingSection />
        <div className="glow-divider" />

        {/* S12 — WEALTH TIMER™ ⭐ ROCKSTAR — Ventanas de dinero */}
        <WealthTimerTeaser />
        <div className="glow-divider" />

        {/* S13 — Malka ⭐ ROCKSTAR — Astróloga IA de voz */}
        <MalkaTeaser />
        <div className="glow-divider" />

        {/* S14 — TESTIMONIALES — Social proof + historias */}
        <TestimonialsSection />
        <div className="glow-divider" />

        {/* S15 — COMPARATIVA — AstrologIA vs horóscopo genérico */}
        <ComparisonSection />
        <div className="glow-divider" />

        {/* S16 — PRECIOS — 3 planes con toggle anual */}
        <PricingSection />
        <div className="glow-divider" />

        {/* S17 — FAQ — Objeciones y preguntas clave */}
        <FAQSection />
        <div className="glow-divider" />

        {/* S18 — CTA FINAL — Cierre emocional + dos CTAs */}
        <FinalCTASection />

      </main>

      {/* FOOTER — 4 columnas + newsletter + trust bar */}
      <GlobalFooter />
    </>
  );
}
