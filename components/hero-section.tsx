"use client"

import { useRef, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
import ProfileCard from "@/components/ui/ProfileCard"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Lang = "de" | "en"
type Loc = Record<Lang, string>

const C = {
  eyebrow: { de: "Paul Wallner — Studio · Wien → DACH", en: "Paul Wallner — Studio · Vienna → DACH" } as Loc,
  line1: { de: "SOFTWARE & KI-AGENTEN,", en: "SOFTWARE & AI AGENTS" } as Loc,
  line2: { de: "DIE ARBEIT ÜBERNEHMEN.", en: "THAT DO THE WORK." } as Loc,
  sub: {
    de: "Individualsoftware und Automatisierung für KMU — vom Kundenportal bis zum Agenten, der Angebote schreibt, Termine bucht und Berichte erstellt. Produktiv erprobt, in der halben Zeit.",
    en: "Custom software and automation for SMBs — from the customer portal to an agent that writes offers, books appointments and generates reports. Proven in production, in half the time.",
  } as Loc,
  view: { de: "Projekte ansehen", en: "View work" } as Loc,
  experience: { de: "Erfahrung", en: "Experience" } as Loc,
}

const CHIPS: Loc[] = [
  { de: "KI-CRM · 74 Aktionen", en: "AI CRM · 74 actions" },
  { de: "Onboarding → BMD", en: "Onboarding → BMD" },
  { de: "340k-Download Open-Source", en: "340k-download open source" },
  { de: "Live bei echten Kunden", en: "Live with real clients" },
]

const STATS: { v: string; l: Loc }[] = [
  { v: "4+", l: { de: "Produktiv-Systeme", en: "production systems" } },
  { v: "340k+", l: { de: "Downloads", en: "downloads" } },
  { v: "9", l: { de: "Domänen", en: "domains" } },
]

export function HeroSection() {
  const { language } = useLanguage()
  const lang = (language === "en" ? "en" : "de") as Lang
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return
    const ctx = gsap.context(() => {
      // premium staggered entrance
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.6 })
        .from(".hero-line", { yPercent: 115, duration: 0.9, stagger: 0.12 }, "-=0.2")
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-chip", { y: 16, opacity: 0, duration: 0.5, stagger: 0.07 }, "-=0.4")
        .from(".hero-stat", { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.3")
        .from(".hero-cta", { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3")
        .from(".hero-card", { opacity: 0, scale: 0.96, duration: 0.9 }, "-=0.9")

      // scroll parallax fade
      gsap.to(contentRef.current, {
        y: -80, opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative flex min-h-screen items-center overflow-hidden pl-6 pr-6 md:pl-28 md:pr-12">
      <AnimatedNoise opacity={0.03} />
      <div className="pointer-events-none absolute -top-20 left-1/3 h-[40rem] w-[40rem] rounded-full bg-accent/[0.09] blur-[150px]" />

      {/* left vertical label */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 md:left-6">
        <span className="block -rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground origin-left">
          Individualsoftware · KI-Agenten
        </span>
      </div>

      <div ref={contentRef} className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-8 py-24 lg:gap-16">
        {/* ---- pitch column ---- */}
        <div className="min-w-0 flex-1">
          <span className="hero-eyebrow block font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            {C.eyebrow[lang]}
          </span>

          <h1 className="mt-6 font-[var(--font-bebas)] text-[clamp(2.6rem,7vw,6.5rem)] font-medium leading-[0.9] tracking-tight text-foreground">
            <span className="block overflow-hidden py-[0.05em]"><span className="hero-line block">{C.line1[lang]}</span></span>
            <span className="block overflow-hidden py-[0.05em]"><span className="hero-line block text-muted-foreground">{C.line2[lang]}</span></span>
          </h1>

          <p className="hero-sub mt-7 max-w-xl font-mono text-sm leading-relaxed text-foreground/70 md:text-base">
            {C.sub[lang]}
          </p>

          {/* breadth chips */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {CHIPS.map((c, i) => (
              <span key={i} className="hero-chip inline-flex items-center gap-2 border border-border/50 bg-card/30 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                <span className="h-1 w-1 rounded-full bg-accent" />
                {c[lang]}
              </span>
            ))}
          </div>

          {/* proof stats */}
          <div className="mt-9 flex gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="hero-stat">
                <div className="font-[var(--font-bebas)] text-3xl leading-none text-foreground md:text-4xl">{s.v}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{s.l[lang]}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex items-center gap-8">
            <a
              href="#work"
              className="hero-cta group inline-flex items-center gap-3 border border-accent/60 bg-accent/10 px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
            >
              <ScrambleTextOnHover text={C.view[lang]} as="span" duration={0.6} />
              <BitmapChevron className="transition-transform duration-300 group-hover:rotate-45" />
            </a>
            <a href="#capabilities" className="hero-cta font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors duration-200 hover:text-foreground">
              {lang === "de" ? "Was ich kann" : "What I do"}
            </a>
            <a href="/cv" className="hero-cta font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors duration-200 hover:text-accent">
              CV
            </a>
          </div>
        </div>

        {/* ---- portrait card ---- */}
        <div className="hero-card hidden w-72 shrink-0 lg:block xl:w-80">
          <ProfileCard
            name="Paul M. Wallner"
            title={C.eyebrow[lang]}
            handle="paulwallner.me"
            status="Online"
            contactText="Contact"
            avatarUrl="/portrait2.webp"
            iconUrl="/icon.svg"
            showUserInfo={false}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => (window.location.href = "mailto:paul@paulwallner.me")}
            behindGlowEnabled={true}
            behindGlowColor="hsla(30, 100%, 60%, 0.5)"
            innerGradient="linear-gradient(145deg,hsla(30, 60%, 45%, 0.5) 0%,hsla(30, 40%, 30%, 0.25) 100%)"
          />
        </div>
      </div>
    </section>
  )
}
