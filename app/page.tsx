import { HeroSection } from "@/components/hero-section"
import { WorkSection } from "@/components/work-section"
import { AiDemo } from "@/components/ai-demo"
import { IoShowcase } from "@/components/io-showcase"
import { CapabilityMap } from "@/components/capability-map"
import { DeviceShowcase } from "@/components/device-showcase"
import { PrinciplesSection } from "@/components/principles-section"
import { ProductivitySection } from "@/components/productivity-section"
import { ContactSection } from "@/components/contact-section"
import { ColophonSection } from "@/components/colophon-section"
import { SideNav } from "@/components/side-nav"
import { SkillsSection } from "@/components/skills-section"

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <SideNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <HeroSection />
        <SkillsSection />
        <WorkSection />
        <DeviceShowcase />
        <DeviceShowcase
          id="showcase-onboto"
          reverse
          label={{ de: "IN PRODUKTION · STEUERKANZLEI", en: "IN PRODUCTION · TAX FIRM" }}
          title={{ de: "ONBOARDING,\nLIVE BEIM KUNDEN", en: "ONBOARDING,\nLIVE IN PRODUCTION" }}
          sub={{
            de: "Der Mandant gibt seine Firma ein — Firmenbuch und wirtschaftliche Eigentümer holt die Plattform live über Compass, die KYC-Ampel prüft automatisch, signiert wird qualifiziert per Handy. Am Ende landet der fertige Klient samt Dokumenten per Knopfdruck direkt in BMD — kein Abtippen, kein Nacherfassen. Live für eine Wiener Steuerkanzlei.",
            en: "The client enters their company — the platform pulls the register and beneficial owners live via Compass, the KYC traffic light screens automatically, signing is qualified and done by phone. At the end the finished client and documents land straight in BMD — no typing, no re-entry. Live for a Vienna tax firm.",
          }}
          tech={["React 19", "Node / Express", "PostgreSQL", "MOXIS (QES)", "Compass / WiEReG", "BMD"]}
          href="/work/2"
          images={{ laptop: "/img/guw-01-kyc-start.jpg", phone: "/img/guw-login-mobile.jpg" }}
        />
        <AiDemo />
        <IoShowcase />
        <CapabilityMap />
        <PrinciplesSection />
        <ProductivitySection />
        <ContactSection />
        <ColophonSection />
      </div>
    </main>
  )
}
