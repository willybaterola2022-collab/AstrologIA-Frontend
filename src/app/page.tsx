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

export default function Home() {
  return (
    <>
      <StarField />
      <Navbar />
      <main>
        {/* S01 — HERO */}
        <HeroSection />
        <div className="glow-divider" />

        {/* S02 — TRUST BAR */}
        <section className="section-pad-sm" style={{ background: "rgba(124,58,237,0.04)" }}>
          <div className="container-max">
            <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
              {[
                "✦ Swiss Ephemeris — Precisión Astronómica Real",
                "✦ Psicología Junguiana Clínica",
                "✦ 18 Módulos de Análisis",
                "✦ Kabbalah + Hellienger Integrados",
                "✦ 100% Personalizado",
              ].map(t => (
                <span key={t} style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.45)", letterSpacing: "0.03em" }}>{t}</span>
              ))}
            </div>
          </div>
        </section>
        <div className="glow-divider" />

        {/* S03-05 — PAIN + MODULES + COMPARISON + TESTIMONIALS + CTA */}
        <ContentSections />
        <div className="glow-divider" />

        {/* S06 — CARTA NATAL LIVE DEMO */}
        <NatalChartSection />
        <div className="glow-divider" />

        {/* S07 — 8 DIMENSIONS */}
        <DimensionsSection />
        <div className="glow-divider" />

        {/* S08 — SINTONÍA PLANETARIA */}
        <BinauralSection />
        <div className="glow-divider" />

        {/* S09 — PACING SOMÁTICO */}
        <BreathingSection />
        <div className="glow-divider" />

        {/* S10 — PRICING */}
        <PricingSection />
        <div className="glow-divider" />

        {/* S11 — FAQ */}
        <FAQSection />
      </main>
    </>
  );
}
