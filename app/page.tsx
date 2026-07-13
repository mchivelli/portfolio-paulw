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
            de: "Vom OTP-Login über KYC und E-Signatur bis zum Admin-Dashboard — aus einer produktiv bewährten Kanzlei-Plattform zum mandantenfähigen Produkt entkoppelt.",
            en: "From OTP login through KYC and e-signature to the admin dashboard — decoupled from a production-proven tax-firm platform into a multi-tenant product.",
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
