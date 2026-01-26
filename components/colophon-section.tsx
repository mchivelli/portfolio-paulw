"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

import { timeline } from "@/app/data/timeline"
import { useLanguage } from "@/components/language-provider"

export function ColophonSection() {
  const { t, language } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null) // Declared gridRef variable

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Timeline items stagger in
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll(".timeline-item")
        gsap.from(items, {
          x: -60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Footer fade in
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{t("section.timeline")}</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">{t("section.experience")}</h2>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative max-w-5xl mx-auto">
        {/* Center vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/40 -translate-x-1/2" />

        <div className="space-y-24">
          {timeline.map((item, index) => {
            const isLeft = index % 2 === 0
            return (
              <article
                key={index}
                className="timeline-item relative w-full"
              >
                {/* Center marker with year */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-accent border-4 border-background" />
                  <span className="font-[var(--font-bebas)] text-3xl md:text-4xl text-accent tracking-tight font-bold">
                    {item.year}
                  </span>
                </div>

                {/* Content container */}
                <div className="flex items-stretch">
                  {/* Left side */}
                  <div className="w-1/2 pr-12">
                    {isLeft && (
                      <div className="border border-border/40 p-6 hover:border-accent/40 transition-all duration-300 group h-full text-right">
                        <h3 className="font-[var(--font-bebas)] text-2xl md:text-3xl tracking-tight group-hover:text-accent transition-colors duration-300">
                          {item.role[language]}
                        </h3>
                        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest block mt-2">
                          {item.company}
                        </span>

                        <p className="font-mono text-sm text-muted-foreground leading-relaxed mt-4 mb-4">
                          {item.description[language]}
                        </p>

                        <div className="flex flex-wrap gap-2 justify-end">
                          {item.tech.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 border border-border/40 text-muted-foreground hover:border-accent hover:text-accent transition-all duration-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right side */}
                  <div className="w-1/2 pl-12">
                    {!isLeft && (
                      <div className="border border-border/40 p-6 hover:border-accent/40 transition-all duration-300 group h-full">
                        <h3 className="font-[var(--font-bebas)] text-2xl md:text-3xl tracking-tight group-hover:text-accent transition-colors duration-300">
                          {item.role[language]}
                        </h3>
                        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest block mt-2">
                          {item.company}
                        </span>

                        <p className="font-mono text-sm text-muted-foreground leading-relaxed mt-4 mb-4">
                          {item.description[language]}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {item.tech.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 border border-border/40 text-muted-foreground hover:border-accent hover:text-accent transition-all duration-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Contact & Footer */}
      <div
        ref={footerRef}
        className="mt-32 pt-12 border-t border-border/20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
      >
        {/* Contact */}
        <div>
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">{t("footer.get_in_touch")}</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:paul@wallner.dev"
                className="font-mono text-sm text-foreground/80 hover:text-accent transition-colors duration-200"
              >
                paul@wallner.dev
              </a>
            </li>
            <li>
              <a
                href="https://github.com/paulwallner"
                className="font-mono text-sm text-foreground/80 hover:text-accent transition-colors duration-200"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/paulwallner"
                className="font-mono text-sm text-foreground/80 hover:text-accent transition-colors duration-200"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Skills */}
        <div>
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">{t("footer.core_stack")}</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">TypeScript / JavaScript</li>
            <li className="font-mono text-xs text-foreground/80">React / Next.js / Node.js</li>
            <li className="font-mono text-xs text-foreground/80">PostgreSQL / MongoDB</li>
            <li className="font-mono text-xs text-foreground/80">Docker / AWS / Vercel</li>
          </ul>
        </div>

        {/* Availability */}
        <div>
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">{t("footer.status")}</h4>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs text-foreground/80">{t("footer.available")}</span>
          </div>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed mt-4">
            {t("footer.open_to_work")}
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-8 border-t border-border/20">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest text-center">
          © 2025 Paul Wallner.
        </p>
      </div>
    </section>
  )
}
