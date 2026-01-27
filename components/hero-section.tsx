"use client"

import { useRef, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12">
      <AnimatedNoise opacity={0.03} />

      {/* Left vertical labels */}
      <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          {t("hero.label")}
        </span>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full flex items-center justify-between gap-8 lg:gap-16 max-w-7xl">
        <div className="flex-1 min-w-0">
          <SplitFlapAudioProvider>
            <div className="relative">
              <div style={{ transform: 'scale(0.6)', transformOrigin: 'left top' }}>
                <SplitFlapText text="PAUL WALLNER" speed={80} />
              </div>
              <div className="mt-4">
                <SplitFlapMuteToggle />
              </div>
            </div>
          </SplitFlapAudioProvider>

          <h2 className="font-[var(--font-bebas)] text-muted-foreground/60 text-[clamp(1rem,2vw,1.5rem)] mt-4 tracking-wide">
            {t("hero.role")}
          </h2>

          <p className="mt-12 max-w-md font-mono text-sm text-muted-foreground leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="mt-16 flex items-center gap-8">
            <a
              href="#work"
              className="group inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
            >
              <ScrambleTextOnHover text={t("hero.view_projects")} as="span" duration={0.6} />
              <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
            </a>
            <a
              href="#timeline"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {t("hero.experience")}
            </a>
          </div>

          <div className="mt-12">
            <div className="inline-block border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {t("hero.edition")}
            </div>
          </div>
        </div>
      </div>

      {/* Portrait Image (Corner Position) */}
      <div className="hidden lg:block absolute bottom-12 right-12 w-96 h-96 z-20">
        <div className="absolute inset-0 border border-accent/40" />
        <div className="absolute inset-0 border border-border/40 translate-x-3 translate-y-3" />
        <img
          src="/img/portrait1.png"
          alt="Paul Wallner"
          className="relative w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute -bottom-4 -right-4 bg-background border border-border px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("hero.available")}
          </span>
        </div>
      </div>
    </section >
  )
}
