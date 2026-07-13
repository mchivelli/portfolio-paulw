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

export function IoShowcase() {
  const { language } = useLanguage()
  const lang = (language === "en" ? "en" : "de") as Lang

  const sectionRef = useRef<HTMLElement>(null)
  const [frame, setFrame] = useState(0)
  const inView = useRef(false)

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

  // self-running loop, only while in view + motion allowed
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) { setFrame(FRAMES.length - 1); return }

    let timer: ReturnType<typeof setInterval> | null = null
    const start = () => { if (!timer) timer = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 1700) }
    const stop = () => { if (timer) { clearInterval(timer); timer = null } }

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { inView.current = e.isIntersecting; e.isIntersecting ? start() : stop() }),
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => { stop(); io.disconnect() }
  }, [])

  const f = FRAMES[frame]

  return (
    <section
      ref={sectionRef}
      id="io"
      className="relative overflow-hidden border-t border-border/30 py-32 pl-6 pr-6 md:pl-28 md:pr-12"
    >
      <div className="pointer-events-none absolute -top-32 left-1/3 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-[130px]" />

      {/* header */}
      <div className="io-reveal mb-14 max-w-3xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{T.label[lang]}</span>
        <h2 className="mt-4 whitespace-pre-line font-[var(--font-bebas)] text-5xl leading-[0.85] tracking-tight md:text-7xl">
          {T.title[lang]}
        </h2>
        <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">{T.sub[lang]}</p>
      </div>

      {/* stat band */}
      <div className="io-reveal mb-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s, i) => <StatCard key={i} s={s} lang={lang} />)}
      </div>

      {/* command-centre panel */}
      <div className="io-reveal relative mx-auto max-w-4xl border border-border bg-card/60 backdrop-blur-sm">
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

        <div className="grid gap-px bg-border/40 md:grid-cols-[1.1fr_1fr]">
          {/* fleet */}
          <div className="bg-card/40 p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">{T.fleet[lang]}</span>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {AGENTS.map((a, i) => {
                const active = i === f.agent
                return (
                  <div
                    key={a.name}
                    className={cn(
                      "relative flex items-center gap-3 border p-3 transition-all duration-500",
                      active ? "border-accent/60 bg-accent/[0.07]" : "border-border/40 bg-transparent",
                    )}
                  >
                    <span className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-500",
                      active ? "bg-accent/20 text-accent" : "bg-muted-foreground/10 text-muted-foreground",
                    )}>
                      <a.Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className={cn(
                        "font-[var(--font-bebas)] text-xl leading-none tracking-tight transition-colors duration-500",
                        active ? "text-accent" : "text-foreground",
                      )}>
                        {a.name}
                      </div>
                      <div className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {a.role[lang]}
                      </div>
                    </div>
                    <span className={cn(
                      "absolute right-2 top-2 h-1.5 w-1.5 rounded-full transition-all duration-500",
                      active ? "bg-accent animate-pulse" : "bg-muted-foreground/25",
                    )} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* pipeline + gates */}
          <div className="bg-card/40 p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">{T.pipeline[lang]}</span>
            <div className="mt-4 flex items-center">
              {STAGES.map((st, i) => {
                const done = i < f.stage
                const active = i === f.stage
                return (
                  <div key={i} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-2">
                      <span className={cn(
                        "flex h-7 w-7 items-center justify-center border font-mono text-[10px] transition-all duration-500",
                        done ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                          : active ? "border-accent bg-accent/15 text-accent"
                          : "border-border/50 text-muted-foreground/50",
                      )}>
                        {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <span className={cn(
                        "font-mono text-[9px] uppercase tracking-wider transition-colors duration-500",
                        active ? "text-accent" : done ? "text-emerald-400/70" : "text-muted-foreground/50",
                      )}>
                        {st[lang]}
                      </span>
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className="mx-1 mb-5 h-px flex-1 overflow-hidden bg-border/40">
                        <div className={cn(
                          "h-full bg-accent transition-all duration-700 ease-out",
                          i < f.stage ? "w-full" : "w-0",
                        )} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <span className="mt-7 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">{T.gates[lang]}</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {GATES.map((g, i) => {
                const passed = i < f.gates
                return (
                  <span
                    key={i}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-all duration-500",
                      passed ? "border-emerald-500/40 bg-emerald-500/[0.07] text-emerald-300"
                        : "border-border/50 bg-transparent text-muted-foreground/60",
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

      {/* footer + cta */}
      <div className="io-reveal mx-auto mt-6 flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
