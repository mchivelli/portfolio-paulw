"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { BitmapChevron } from "@/components/bitmap-chevron"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Lang = "de" | "en"
type Loc = Record<Lang, string>

interface ShowcaseProps {
  id?: string
  label?: Loc
  title?: Loc
  sub?: Loc
  tech?: string[]
  href?: string
  images?: { laptop: string; tablet?: string; phone?: string }
  reverse?: boolean
}

const DEFAULTS = {
  label: { de: "IM EINSATZ · RESPONSIVE", en: "IN PRODUCTION · RESPONSIVE" } as Loc,
  title: { de: "EINE PLATTFORM,\nJEDES GERÄT", en: "ONE PLATFORM,\nEVERY DEVICE" } as Loc,
  sub: {
    de: "Vom Online-Buchungs-Wizard über die transparente Preisliste bis zum Werkstatt-CRM — dieselbe Codebase, auf jedem Gerät poliert.",
    en: "From the online booking wizard to the transparent price list to the workshop CRM — one codebase, polished on every device.",
  } as Loc,
  tech: ["Next.js 15", "Drizzle / SQLite", "RKSV-Kassa", "9 Sprachen", "Web-Push", "next-intl"],
  href: "/work/1",
  images: { laptop: "/img/kfz-admin-desktop.jpg", tablet: "/img/kfz-preise-tablet.jpg", phone: "/img/kfz-book-mobile.jpg" },
}

const CTA: Loc = { de: "Case Study ansehen", en: "View case study" }

export function DeviceShowcase(props: ShowcaseProps = {}) {
  const { language } = useLanguage()
  const lang = (language === "en" ? "en" : "de") as Lang

  const id = props.id ?? "showcase"
  const label = props.label ?? DEFAULTS.label
  const title = props.title ?? DEFAULTS.title
  const sub = props.sub ?? DEFAULTS.sub
  const tech = props.tech ?? DEFAULTS.tech
  const href = props.href ?? DEFAULTS.href
  const images = props.images ?? DEFAULTS.images
  const reverse = props.reverse ?? false

  const sectionRef = useRef<HTMLElement>(null)
  const laptopRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const tabletRef = useRef<HTMLDivElement>(null)
  const clusterRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(".ds-reveal", {
        y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
      })
      const parallax = (el: HTMLElement | null, dist: number) => {
        if (!el) return
        gsap.to(el, {
          yPercent: dist, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
        })
      }
      parallax(tabletRef.current, 16)
      parallax(laptopRef.current, -6)
      parallax(phoneRef.current, -20)
    }, sectionRef)

    const cluster = clusterRef.current
    const tilt = tiltRef.current
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let onMove: ((e: MouseEvent) => void) | null = null
    let onLeave: (() => void) | null = null
    if (cluster && tilt && !reduce) {
      const rotX = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3.out" })
      const rotY = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3.out" })
      onMove = (e: MouseEvent) => {
        const r = cluster.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        rotY(px * 10)
        rotX(-py * 8)
      }
      onLeave = () => { rotX(0); rotY(0) }
      cluster.addEventListener("mousemove", onMove)
      cluster.addEventListener("mouseleave", onLeave)
    }

    return () => {
      ctx.revert()
      if (cluster && onMove) cluster.removeEventListener("mousemove", onMove)
      if (cluster && onLeave) cluster.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative overflow-hidden border-t border-border/30 py-32 pl-6 pr-6 md:pl-28 md:pr-12"
    >
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[130px]" />

      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        {/* Copy */}
        <div className={cn("max-w-lg", reverse && "lg:order-2")}>
          <span className="ds-reveal font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{label[lang]}</span>
          <h2 className="ds-reveal mt-4 whitespace-pre-line font-[var(--font-bebas)] text-5xl leading-[0.85] tracking-tight md:text-7xl">
            {title[lang]}
          </h2>
          <p className="ds-reveal mt-6 max-w-md font-mono text-sm leading-relaxed text-muted-foreground">{sub[lang]}</p>
          <div className="ds-reveal mt-8 flex flex-wrap gap-2">
            {tech.map((t) => (
              <span key={t} className="border border-border/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t}</span>
            ))}
          </div>
          <Link
            href={href}
            className="ds-reveal group mt-10 inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-all duration-200 hover:border-accent hover:text-accent"
          >
            {CTA[lang]}
            <BitmapChevron className="transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>

        {/* Device cluster */}
        <div ref={clusterRef} className={cn("ds-reveal relative mx-auto aspect-[5/4] w-full max-w-2xl [perspective:1200px]", reverse && "lg:order-1")}>
          <div ref={tiltRef} className="relative h-full w-full [transform-style:preserve-3d]">
            {images.tablet && (
              <div ref={tabletRef} className="absolute left-0 top-[16%] w-[38%] -rotate-[7deg]">
                <Tablet src={images.tablet} />
              </div>
            )}
            <div
              ref={laptopRef}
              className={cn("absolute top-0", images.tablet ? "right-0 w-[82%]" : "left-1/2 w-[90%] -translate-x-1/2")}
            >
              <Laptop src={images.laptop} />
            </div>
            {images.phone && (
              <div className={cn("absolute -bottom-4 w-[20%] rotate-[4deg]", images.tablet ? "right-8" : "right-0")} ref={phoneRef}>
                <Phone src={images.phone} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Laptop({ src }: { src: string }) {
  return (
    <div className="relative drop-shadow-2xl">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl border-[9px] border-b-0 border-neutral-800 bg-neutral-900">
        <img src={src} alt="Desktop" className="h-full w-full object-cover object-top" />
      </div>
      <div className="relative h-3 rounded-b-md bg-gradient-to-b from-neutral-700 to-neutral-900">
        <div className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-md bg-neutral-950" />
      </div>
      <div className="mx-auto -mt-px ml-[-7%] h-1.5 w-[114%] rounded-b-xl bg-neutral-800/90" />
    </div>
  )
}

function Phone({ src }: { src: string }) {
  return (
    <div className="relative aspect-[9/19] overflow-hidden rounded-[1.7rem] border-[6px] border-neutral-800 bg-neutral-900 drop-shadow-2xl">
      <div className="absolute left-1/2 top-2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-neutral-950/80" />
      <img src={src} alt="Mobile" className="h-full w-full object-cover object-top" />
    </div>
  )
}

function Tablet({ src }: { src: string }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.1rem] border-[9px] border-neutral-800 bg-neutral-900 drop-shadow-2xl">
      <img src={src} alt="Tablet" className="h-full w-full object-cover object-top" />
    </div>
  )
}
