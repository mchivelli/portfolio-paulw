"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { IoPanel } from "@/components/io-showcase"
import type { Project } from "@/app/data/projects"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Lang = "de" | "en"
type Loc = Record<Lang, string>

const T = {
  back: { de: "Zurück zu den Projekten", en: "Back to projects" } as Loc,
  overview: { de: "ÜBERBLICK", en: "OVERVIEW" } as Loc,
  features: { de: "KERNFUNKTIONEN", en: "KEY FEATURES" } as Loc,
  gallery: { de: "EINBLICKE", en: "INSIDE THE PRODUCT" } as Loc,
  stack: { de: "STACK", en: "STACK" } as Loc,
  live: { de: "Live ansehen", en: "View live" } as Loc,
  repo: { de: "Repository", en: "Repository" } as Loc,
  onRequest: { de: "Screenshots auf Anfrage", en: "Screenshots on request" } as Loc,
  allProjects: { de: "Alle Projekte", en: "All projects" } as Loc,
}

/** a link is only rendered if it actually goes somewhere */
const isRealUrl = (u?: string) => !!u && /^https?:\/\//i.test(u)

export function CaseStudy({ project }: { project: Project }) {
  const { language } = useLanguage()
  const lang = (language === "en" ? "en" : "de") as Lang
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(".cs-reveal", {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 80%", toggleActions: "play none none reverse" },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const devices = project.devices
  const gallery = project.gallery ?? []
  const stats = project.stats ?? []
  const features = project.features?.[lang] ?? []
  const hasHeroImage = !!project.mockup && !!project.image
  const hasVisual = !!devices || hasHeroImage || project.visual === "io-panel"

  return (
    <div ref={rootRef} className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-32 md:pl-28 md:pr-12">
      {/* back */}
      <Link
        href="/#work"
        className="group mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
      >
        <BitmapChevron className="rotate-180 transition-transform group-hover:-translate-x-1" />
        {T.back[lang]}
      </Link>

      {/* header */}
      <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
        {project.medium[lang]}
      </span>
      <h1 className="mt-4 font-[var(--font-bebas)] text-5xl leading-[0.9] tracking-tight md:text-8xl">
        {project.title[lang]}
      </h1>

      <p className="mt-8 max-w-3xl border-l-2 border-accent/50 pl-6 font-mono text-sm leading-relaxed text-muted-foreground md:text-base">
        {project.longDescription[lang] || project.description[lang]}
      </p>

      {/* stat band */}
      {stats.length > 0 && (
        <div className={cn("mt-12 grid max-w-3xl gap-3", stats.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
          {stats.map((s, i) => (
            <div key={i} className="border border-border/50 bg-card/40 px-5 py-4">
              <div className="font-[var(--font-bebas)] text-3xl leading-none text-foreground md:text-4xl">{s.value}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {s.label[lang]}
              </div>
              <div className="mt-3 h-0.5 w-full bg-border/30">
                <div className="h-full w-full bg-accent" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* links — only when they actually go somewhere */}
      {(isRealUrl(project.liveUrl) || isRealUrl(project.url)) && (
        <div className="mt-10 flex flex-wrap gap-4">
          {isRealUrl(project.liveUrl) && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-accent/60 bg-accent/10 px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
            >
              {T.live[lang]}
              <BitmapChevron className="transition-transform group-hover:rotate-45" />
            </a>
          )}
          {isRealUrl(project.url) && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-all duration-200 hover:border-accent hover:text-accent"
            >
              {T.repo[lang]}
              <BitmapChevron className="transition-transform group-hover:rotate-45" />
            </a>
          )}
        </div>
      )}

      {/* ---- visual ---- */}
      {devices && (
        <div className="cs-reveal mt-20">
          <DeviceTrio images={devices} />
        </div>
      )}

      {!devices && hasHeroImage && (
        <div className="cs-reveal relative mt-20 overflow-hidden border border-border/40">
          <img src={project.image} alt={project.title[lang]} className="block h-auto w-full" />
          <div className="pointer-events-none absolute inset-0 m-2 border border-accent/10" />
        </div>
      )}

      {!devices && !hasHeroImage && project.visual === "io-panel" && (
        <div className="cs-reveal mt-20">
          <IoPanel />
        </div>
      )}

      {/* ---- features ---- */}
      {features.length > 0 && (
        <div className="cs-reveal mt-24">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="font-[var(--font-bebas)] text-3xl tracking-tight text-foreground/90 md:text-4xl">
              {T.features[lang]}
            </h2>
            <span className="h-px flex-1 bg-border/40" />
            {!hasVisual && (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                {T.onRequest[lang]}
              </span>
            )}
          </div>
          <ul className="grid gap-x-12 gap-y-4 md:grid-cols-2">
            {features.map((f, i) => (
              <li key={i} className="group flex items-start gap-3 border-b border-border/20 pb-4">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent/50 transition-colors group-hover:bg-accent" />
                <span className="font-mono text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground">
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- stack ---- */}
      <div className="cs-reveal mt-20">
        <div className="mb-6 flex items-center gap-4">
          <h2 className="font-[var(--font-bebas)] text-2xl tracking-tight text-foreground/70 md:text-3xl">
            {T.stack[lang]}
          </h2>
          <span className="h-px flex-1 bg-border/40" />
        </div>
        <div className="flex flex-wrap gap-3">
          {project.tech.map((t, i) => (
            <span
              key={i}
              className="border border-border/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ---- captioned gallery ---- */}
      {gallery.length > 0 && (
        <div className="cs-reveal mt-24">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="font-[var(--font-bebas)] text-3xl tracking-tight text-foreground/90 md:text-4xl">
              {T.gallery[lang]}
            </h2>
            <span className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {gallery.map((g, i) => (
              <figure key={i} className="group">
                <div className="relative overflow-hidden border border-border/40 bg-black/20">
                  <img
                    src={g.src}
                    alt={g.caption[lang]}
                    className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-0 m-2 border border-accent/10" />
                </div>
                <figcaption className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  {g.caption[lang]}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {/* ---- footer nav ---- */}
      <div className="mt-24 border-t border-border/30 pt-8">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
        >
          <BitmapChevron className="rotate-180 transition-transform group-hover:-translate-x-1" />
          {T.allProjects[lang]}
        </Link>
      </div>
    </div>
  )
}

/* ---------- device frames (sharp-cornered, matching the homepage) ---------- */

function DeviceTrio({ images }: { images: { laptop: string; tablet: string; phone: string } }) {
  return (
    <div className="relative mx-auto aspect-[16/9] w-full max-w-4xl">
      <div className="absolute left-0 top-[18%] w-[26%] -rotate-[6deg]">
        <Tablet src={images.tablet} />
      </div>
      <div className="absolute right-0 top-0 w-[74%]">
        <Laptop src={images.laptop} />
      </div>
      <div className="absolute -bottom-2 right-[6%] w-[14%] rotate-[4deg]">
        <Phone src={images.phone} />
      </div>
    </div>
  )
}

function Laptop({ src }: { src: string }) {
  return (
    <div className="relative drop-shadow-2xl">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl border-[9px] border-b-0 border-neutral-800 bg-neutral-900">
        <img src={src} alt="" className="h-full w-full object-cover object-top" />
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
      <img src={src} alt="" className="h-full w-full object-cover object-top" />
    </div>
  )
}

function Tablet({ src }: { src: string }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.1rem] border-[9px] border-neutral-800 bg-neutral-900 drop-shadow-2xl">
      <img src={src} alt="" className="h-full w-full object-cover object-top" />
    </div>
  )
}
