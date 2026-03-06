import StarField from "@/components/StarField";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NatalChartSection from "@/components/NatalChartSection";
import DimensionsSection from "@/components/DimensionsSection";
import ContentSections from "@/components/ContentSections";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <>
      {/* Animated Star Field Background */}
      <StarField />

      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* S01 — HERO */}
        <HeroSection />

        {/* DIVIDER */}
        <div className="glow-divider" />

        {/* S02 — TRUST BAR */}
        <section className="section-pad-sm" style={{ background: "rgba(124,58,237,0.04)" }}>
          <div className="container-max">
            <div style={{
              display: "flex", gap: "2rem", justifyContent: "center",
              flexWrap: "wrap", alignItems: "center",
            }}>
              {[
                "✦ Swiss Ephemeris — Precisión Astronómica Real",
                "✦ Psicología Junguiana Clínica",
                "✦ 18 Módulos de Análisis",
                "✦ Kabbalah + Hellienger Integrados",
                "✦ 100% Personalizado",
              ].map(t => (
                <span key={t} style={{ fontSize: "0.8rem", color: "rgba(248,248,255,0.45)", letterSpacing: "0.03em" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-divider" />

        {/* S03-05 — PAIN + MODULES PREVIEW + COMPARISON + TESTIMONIALS + FINAL CTA */}
        <ContentSections />

        <div className="glow-divider" />

        {/* S06 — CARTA NATAL LIVE DEMO */}
        <NatalChartSection />

        <div className="glow-divider" />

        {/* S07 — 8 DIMENSIONS */}
        <DimensionsSection />

        <div className="glow-divider" />

        {/* S08 — PRICING */}
        <PricingSection />

        <div className="glow-divider" />

        {/* S09 — FAQ */}
        <FAQSection />
      </main>
    </>
  );
}
