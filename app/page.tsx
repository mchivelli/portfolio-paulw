import { HeroSection } from "@/components/hero-section"
import { WorkSection } from "@/components/work-section"
import { AiDemo } from "@/components/ai-demo"
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
          label={{ de: "IM EINSATZ · SaaS", en: "IN PRODUCTION · SaaS" }}
          title={{ de: "ONBOARDING,\nWHITE-LABEL", en: "ONBOARDING,\nWHITE-LABEL" }}
          sub={{
            de: "OTP-Login, KYC-Ampel, Compass-Firmenbuch, MOXIS-QES-Signatur und automatische Dokument-Generierung — der geführte Wizard macht aus stundenlanger Mandanten-Aufnahme Minuten. Produktiv bewährt, zum White-Label-Produkt entkoppelt.",
            en: "OTP login, KYC traffic light, Compass company lookup, MOXIS QES signature and automatic document generation — the guided wizard turns hours of client intake into minutes. Production-proven, decoupled into a white-label product.",
          }}
          tech={["React 19", "Node / Express", "PostgreSQL", "MOXIS (QES)", "WiEReG", "BMD"]}
          href="/work/2"
          images={{ laptop: "/img/onboto-admin-desktop.jpg", tablet: "/img/onboto-login-desktop.jpg", phone: "/img/onboto-login-mobile.jpg" }}
        />
        <AiDemo />
        <PrinciplesSection />
        <ProductivitySection />
        <ContactSection />
        <ColophonSection />
      </div>
    </main>
  )
}
