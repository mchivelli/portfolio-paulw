import { HeroSection } from "@/components/hero-section"
import { WorkSection } from "@/components/work-section"
import { AiDemo } from "@/components/ai-demo"
import { IoShowcase } from "@/components/io-showcase"
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
            de: "OTP-Login, KYC-Ampel, Compass-Firmenbuch, MOXIS-QES-Signatur und automatische Dokument-Generierung — der geführte Wizard macht aus stundenlanger Mandanten-Aufnahme Minuten. Gebaut und live betrieben für eine Wiener Steuerkanzlei unter onboarding.steuerservice.at.",
            en: "OTP login, KYC traffic light, Compass company lookup, MOXIS QES signature and automatic document generation — the guided wizard turns hours of client intake into minutes. Built and run in production for a Vienna tax firm at onboarding.steuerservice.at.",
          }}
          tech={["React 19", "Node / Express", "PostgreSQL", "MOXIS (QES)", "WiEReG", "BMD"]}
          href="/work/2"
          images={{ laptop: "/img/onboto-admin-desktop.jpg", tablet: "/img/onboto-login-desktop.jpg", phone: "/img/onboto-login-mobile.jpg" }}
        />
        <AiDemo />
        <IoShowcase />
        <PrinciplesSection />
        <ProductivitySection />
        <ContactSection />
        <ColophonSection />
      </div>
    </main>
  )
}
