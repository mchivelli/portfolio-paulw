"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { BitmapChevron } from "@/components/bitmap-chevron"
import {
  Compass, Hammer, BookOpen, Shield,
  ShieldCheck, ScanSearch, FlaskConical, FileCheck2, Check,
} from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Lang = "de" | "en"
type Loc = Record<Lang, string>

const T = {
  label: { de: "EIGENLABOR · AGENTEN-INFRA", en: "OWN LAB · AGENT INFRA" } as Loc,
  title: { de: "DAS SYSTEM,\nMIT DEM ICH BAUE", en: "THE SYSTEM\nI BUILD WITH" } as Loc,
  sub: {
    de: "IO ist meine eigene Multi-Agenten-Umgebung. Ein Koordinator dirigiert spezialisierte Agenten durch eine echte Auslieferungslinie — mit isolierten Git-Worktrees, adversarialen Reviews und code-erzwungenen Quality-Gates, die den Build scheitern lassen statt ihn durchzuwinken.",
    en: "IO is my own multi-agent environment. A coordinator directs specialised agents down a real delivery line — with isolated git worktrees, adversarial reviews and code-enforced quality gates that fail the build instead of waving it through.",
  } as Loc,
  chrome: { de: "io · command centre", en: "io · command centre" } as Loc,
  live: { de: "LIVE", en: "LIVE" } as Loc,
  fleet: { de: "AGENTEN-FLOTTE", en: "AGENT FLEET" } as Loc,
  pipeline: { de: "AUSLIEFERUNGSLINIE", en: "DELIVERY LINE" } as Loc,
  gates: { de: "QUALITY-GATES", en: "QUALITY GATES" } as Loc,
  cta: { de: "Zur Architektur", en: "View architecture" } as Loc,
  foot: {
    de: "Eigenentwicklung — das interne System, mit dem ich Kundenprojekte plane, baue, prüfe und ausliefere.",
    en: "Own build — the internal system I use to plan, build, review and ship client work.",
  } as Loc,
}

const AGENTS: { name: string; role: Loc; Icon: typeof Compass }[] = [
  { name: "Flow", role: { de: "Koordinator", en: "Coordinator" }, Icon: Compass },
  { name: "Forge", role: { de: "Builder", en: "Builder" }, Icon: Hammer },
  { name: "Echo", role: { de: "Scholar", en: "Research" }, Icon: BookOpen },
  { name: "Ward", role: { de: "Guardian", en: "Guardian" }, Icon: Shield },
]

const STAGES: Loc[] = [
  { de: "Plan", en: "Plan" },
  { de: "Build", en: "Build" },
  { de: "Review", en: "Review" },
  { de: "Ship", en: "Ship" },
]

const GATES: { label: Loc; Icon: typeof ShieldCheck }[] = [
  { label: { de: "Secrets", en: "Secrets" }, Icon: ShieldCheck },
  { label: { de: "SAST", en: "SAST" }, Icon: ScanSearch },
  { label: { de: "Tests", en: "Tests" }, Icon: FlaskConical },
  { label: { de: "Traceability", en: "Traceability" }, Icon: FileCheck2 },
]

// self-running loop: stage = active pipeline step, agent = highlighted node,
// gates = number of gates already passed, log = console line
type Frame = { stage: number; agent: number; gates: number; log: Loc }
const FRAMES: Frame[] = [
  { stage: 0, agent: 0, gates: 0, log: { de: "planner → PRD + 3 Stories", en: "planner → PRD + 3 stories" } },
  { stage: 0, agent: 2, gates: 0, log: { de: "research → Prior Art geprüft", en: "research → prior art checked" } },
  { stage: 1, agent: 1, gates: 0, log: { de: "builder → worktree feat/onboarding", en: "builder → worktree feat/onboarding" } },
  { stage: 2, agent: 3, gates: 1, log: { de: "reviewer → 3-Linsen-Skeptiker-Panel", en: "reviewer → 3-lens skeptic panel" } },
  { stage: 2, agent: 3, gates: 3, log: { de: "gate → secrets ✓  sast ✓  tests ✓", en: "gate → secrets ✓  sast ✓  tests ✓" } },
  { stage: 3, agent: 0, gates: 4, log: { de: "ship → traceability ✓  merged", en: "ship → traceability ✓  merged" } },
]

const STATS: { v: number; suffix?: string; fill: number; label: Loc }[] = [
  { v: 4, fill: 1, label: { de: "Agenten im Team", en: "agents in the team" } },
  { v: 4, fill: 1, label: { de: "Gates pro Build", en: "gates per build" } },
  { v: 0, fill: 1, label: { de: "Secrets committed", en: "secrets committed" } },
  { v: 100, suffix: "%", fill: 1, label: { de: "code-erzwungen", en: "code-enforced" } },
]

/** The live command-centre panel — reused on the homepage section and the IO case study. */
export function IoPanel() {
  const { language } = useLanguage()
  const lang = (language === "en" ? "en" : "de") as Lang

  const panelRef = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState(0)

  // self-running loop, only while in view + motion allowed
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) { setFrame(FRAMES.length - 1); return }

    let timer: ReturnType<typeof setInterval> | null = null
    const start = () => { if (!timer) timer = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 1700) }
    const stop = () => { if (timer) { clearInterval(timer); timer = null } }

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { e.isIntersecting ? start() : stop() }),
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => { stop(); io.disconnect() }
  }, [])

  const f = FRAMES[frame]

  return (
    <div ref={panelRef} className="relative border border-border bg-card/60 backdrop-blur-sm">
      {/* chrome */}
      <div className="flex items-center gap-3 border-b border-border/60 px-5 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        </span>
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground">{T.chrome[lang]}</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> {T.live[lang]}
        </span>
      </div>

      {/* ---- schematic: fleet -> routed trace -> delivery rail -> gates ---- */}
      <div className="relative bg-[#0a0a0c] px-5 pb-7 pt-6 md:px-8">
        {/* blueprint texture */}
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-[0.10]" aria-hidden="true" />

        {/* agent fleet */}
        <span className="relative block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
          {T.fleet[lang]}
        </span>
        <div className="relative mt-4 grid grid-cols-4 gap-2 md:gap-4">
          {AGENTS.map((a, i) => {
            const active = i === f.agent
            return (
              <div
                key={a.name}
                className={cn(
                  "flex flex-col items-center gap-2 border px-2 py-3 transition-all duration-500",
                  active ? "border-accent/60 bg-accent/[0.08] shadow-[0_0_30px_-12px] shadow-accent/70" : "border-border/40",
                )}
              >
                <span className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500",
                  active ? "bg-accent/20 text-accent" : "bg-muted-foreground/10 text-muted-foreground",
                )}>
                  <a.Icon className="h-4 w-4" />
                </span>
                <div className="text-center">
                  <div className={cn(
                    "font-[var(--font-bebas)] text-lg leading-none tracking-tight transition-colors duration-500 md:text-xl",
                    active ? "text-accent" : "text-foreground",
                  )}>
                    {a.name}
                  </div>
                  <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    {a.role[lang]}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* routed trace: which agent is currently driving which stage */}
        <svg
          className="relative mt-1 h-12 w-full overflow-visible text-accent"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={`M ${12.5 + f.agent * 25} 0 L ${12.5 + f.agent * 25} 34 L ${12.5 + f.stage * 25} 66 L ${12.5 + f.stage * 25} 100`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.25}
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
            className="opacity-70 transition-all duration-700 ease-out"
          />
        </svg>

        {/* delivery rail */}
        <span className="relative block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
          {T.pipeline[lang]}
        </span>
        <div className="relative mt-4">
          {/* base rail + progress + travelling pulse */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[15px] h-px bg-border/60" />
          <div
            className="absolute top-[15px] h-px bg-accent transition-all duration-700 ease-out"
            style={{ left: "12.5%", width: `${f.stage * 25}%` }}
          />
          <div
            className="absolute top-[11px] h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_14px_3px] shadow-accent/60 transition-all duration-700 ease-out"
            style={{ left: `${12.5 + f.stage * 25}%` }}
          />

          <div className="relative grid grid-cols-4">
            {STAGES.map((st, i) => {
              const done = i < f.stage
              const active = i === f.stage
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center border bg-[#0a0a0c] font-mono text-[11px] transition-all duration-500",
                    done ? "border-emerald-500/60 text-emerald-400"
                      : active ? "border-accent text-accent shadow-[0_0_24px_-6px] shadow-accent/80"
                      : "border-border/50 text-muted-foreground/50",
                  )}>
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={cn(
                    "font-mono text-[9px] uppercase tracking-wider transition-colors duration-500",
                    active ? "text-accent" : done ? "text-emerald-400/70" : "text-muted-foreground/50",
                  )}>
                    {st[lang]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* quality gates */}
        <span className="relative mt-8 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
          {T.gates[lang]}
        </span>
        <div className="relative mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {GATES.map((g, i) => {
            const passed = i < f.gates
            return (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[11px] transition-all duration-500",
                  passed ? "border-emerald-500/40 bg-emerald-500/[0.08] text-emerald-300"
                    : "border-border/50 text-muted-foreground/50",
                )}
              >
                <span className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-500",
                  passed ? "bg-emerald-500/20 text-emerald-400" : "bg-muted-foreground/10 text-muted-foreground/50",
                )}>
                  {passed ? <Check className="h-2.5 w-2.5" /> : <g.Icon className="h-2.5 w-2.5" />}
                </span>
                {g.label[lang]}
              </span>
            )
          })}
        </div>
      </div>

      {/* console log line */}
      <div className="flex items-center gap-2 border-t border-border/60 px-5 py-3">
        <span className="font-mono text-xs text-accent">›</span>
        <span key={frame} className="animate-[fadeIn_0.4s_ease] font-mono text-xs text-muted-foreground">
          {f.log[lang]}
        </span>
        <span className="ml-0.5 inline-block h-3 w-1.5 bg-accent/70 animate-pulse" />
      </div>
    </div>
  )
}

export function IoShowcase() {
  const { language } = useLanguage()
  const lang = (language === "en" ? "en" : "de") as Lang

  const sectionRef = useRef<HTMLElement>(null)

  // GSAP reveal
  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(".io-reveal", {
        y: 42, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="io"
      className="relative overflow-hidden border-t border-border/30 py-24 pl-6 pr-6 md:pl-28 md:pr-12"
    >
      <div className="pointer-events-none absolute -top-32 left-1/3 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-[130px]" />

      {/* header row: claim left, numbers right — a control-room masthead */}
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <span className="io-reveal block font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{T.label[lang]}</span>
          <h2 className="io-reveal mt-4 whitespace-pre-line font-[var(--font-bebas)] text-5xl leading-[0.85] tracking-tight md:text-7xl">
            {T.title[lang]}
          </h2>
          <p className="io-reveal mt-6 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">{T.sub[lang]}</p>
        </div>

        <div className="io-reveal grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[36rem]">
          {STATS.map((s, i) => <StatCard key={i} s={s} lang={lang} />)}
        </div>
      </div>

      {/* full-width schematic */}
      <div className="io-reveal mt-12">
        <IoPanel />
      </div>

      {/* footer + cta */}
      <div className="io-reveal mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl font-mono text-[10px] leading-relaxed text-muted-foreground/50">{T.foot[lang]}</p>
        <Link
          href="/work/6"
          className="group inline-flex shrink-0 items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-all duration-200 hover:border-accent hover:text-accent"
        >
          {T.cta[lang]}
          <BitmapChevron className="transition-transform duration-300 group-hover:rotate-45" />
        </Link>
      </div>
    </section>
  )
}

function CountUp({ to, run, suffix = "" }: { to: number; run: boolean; suffix?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const start = performance.now()
    const dur = 1300
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  return <>{n}{suffix}</>
}

function StatCard({ s, lang }: { s: { v: number; suffix?: string; fill: number; label: Loc }; lang: Lang }) {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setInView(true) }), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="relative overflow-hidden border border-border/50 bg-card/40 px-5 py-4">
      <div className="font-[var(--font-bebas)] text-4xl leading-none text-foreground md:text-5xl">
        <CountUp to={s.v} run={inView} suffix={s.suffix} />
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.label[lang]}</div>
      <div className="mt-3 h-0.5 w-full bg-border/30">
        <div className="h-full bg-accent transition-[width] duration-1000 ease-out" style={{ width: inView ? `${s.fill * 100}%` : "0%" }} />
      </div>
    </div>
  )
}
