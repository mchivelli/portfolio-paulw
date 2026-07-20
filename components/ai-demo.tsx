"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Wrench, Check, Send, Lock, ShieldCheck, CornerDownLeft, CalendarClock, Euro, Sparkles } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Lang = "de" | "en"
type Loc = Record<Lang, string>

interface ToolResult {
  title: Loc
  rows: { k: Loc; v: string }[]
  foot?: Loc
}
interface Script {
  id: string
  chip: Loc
  tool: { name: string; args: string }
  pin?: boolean
  reply: Loc
  result?: ToolResult
  followup?: Loc
}

const SCRIPTS: Script[] = [
  {
    id: "parts",
    chip: { de: "Bremsbeläge für einen BMW i4?", en: "Brake pads for a BMW i4?" },
    tool: { name: "parts.search", args: "{ marke: \"BMW\", modell: \"i4\", teil: \"Bremsbeläge\" }" },
    reply: {
      de: "Passend für den i4, Vorderachse — ich hab die Position schon für den Kostenvoranschlag vorbereitet:",
      en: "For the i4, front axle — I've already prepped the line item for the quote:",
    },
    result: {
      title: { de: "Teil gefunden", en: "Part found" },
      rows: [
        { k: { de: "Teil", en: "Part" }, v: "ATE Bremsbelagsatz vorne" },
        { k: { de: "Fahrzeug", en: "Vehicle" }, v: "BMW i4 · 2022" },
        { k: { de: "Preis", en: "Price" }, v: "107,90 € netto" },
        { k: { de: "Quelle", en: "Source" }, v: "REPDOC · NATCODE" },
      ],
    },
    followup: { de: "Soll ich sie auf den KVA setzen?", en: "Add it to the quote?" },
  },
  {
    id: "booking",
    chip: { de: "Freien Termin nächste Woche?", en: "Any free slot next week?" },
    tool: { name: "calendar.findSlots", args: "{ range: \"next_week\", service: \"Service\" }" },
    reply: { de: "Drei freie Slots nächste Woche:", en: "Three open slots next week:" },
    result: {
      title: { de: "Verfügbar", en: "Available" },
      rows: [
        { k: { de: "Di 14.07", en: "Tue 14.07" }, v: "09:00" },
        { k: { de: "Mi 15.07", en: "Wed 15.07" }, v: "13:30" },
        { k: { de: "Fr 17.07", en: "Fri 17.07" }, v: "08:00" },
      ],
    },
    followup: { de: "Welchen soll ich für den Kunden reservieren?", en: "Which one should I hold?" },
  },
  {
    id: "revenue",
    chip: { de: "Umsatz diesen Monat?", en: "Revenue this month?" },
    tool: { name: "kassa.revenueReport", args: "{ period: \"month_to_date\" }" },
    pin: true,
    reply: { de: "Freigegeben. Monat bis heute:", en: "Approved. Month to date:" },
    result: {
      title: { de: "Kassa · Juli", en: "Cash · July" },
      rows: [
        { k: { de: "Umsatz netto", en: "Net revenue" }, v: "42.180 €" },
        { k: { de: "Offene KVA", en: "Open quotes" }, v: "7" },
        { k: { de: "Ø Bon", en: "Avg. ticket" }, v: "214 €" },
      ],
    },
  },
]

const CHIP_ICON: Record<string, typeof Wrench> = { parts: Wrench, booking: CalendarClock, revenue: Euro }

const STATS: { v: number; prefix?: string; suffix?: string; fill: number; label: Loc }[] = [
  { v: 26, prefix: "~", fill: 0.82, label: { de: "echte Tools", en: "real tools" } },
  { v: 793, fill: 0.96, label: { de: "Tests grün", en: "tests green" } },
  { v: 9, fill: 0.6, label: { de: "Sprachen", en: "languages" } },
]

type Msg =
  | { kind: "user"; text: string }
  | { kind: "tool"; name: string; args: string; done: boolean }
  | { kind: "pin"; approved: boolean }
  | { kind: "reply"; text: string }
  | { kind: "result"; result: ToolResult }
  | { kind: "followup"; text: string }

const T = {
  label: { de: "LIVE-DEMO", en: "LIVE DEMO" },
  title: { de: "RED MIT EINEM AGENTEN", en: "TALK TO AN AGENT" },
  sub: {
    de: "Der KFZ-Bozo-Assistent ruft echte Tools direkt auf die Werkstatt-Datenbank auf — mit Gedächtnis und PIN-Gates. Probier's aus:",
    en: "The KFZ-Bozo assistant calls real tools straight against the workshop database — with memory and PIN gates. Try it:",
  },
  agent: { de: "kfz-bozo · assistant", en: "kfz-bozo · assistant" },
  demo: { de: "DEMO", en: "DEMO" },
  placeholder: { de: "Frag nach Teilen, Terminen, Umsatz…", en: "Ask about parts, slots, revenue…" },
  calling: { de: "Tool wird ausgeführt", en: "Calling tool" },
  boot: { de: "Sitzung wird aufgebaut", en: "Opening session" },
  pinTitle: { de: "Sensible Aktion — PIN erforderlich", en: "Sensitive action — PIN required" },
  pinConfirm: { de: "Bestätigen", en: "Confirm" },
  pinApproved: { de: "PIN bestätigt", en: "PIN confirmed" },
  fallback: {
    de: "Das ist eine nachgestellte Demo. Der echte Assistent orchestriert ~26 Tools live. Frag mich nach Teilen, Terminen oder Umsatz — oder tipp einen der Vorschläge an.",
    en: "This is a scripted demo. The real assistant orchestrates ~26 tools live. Ask about parts, slots or revenue — or tap one of the suggestions.",
  },
  disclaimer: {
    de: "Interaktive Demo — dem echten Assistenten nachgebaut (~26 Tools · Memory · PIN-Gates · Prompt-Injection-Schutz).",
    en: "Interactive demo — modeled on the real assistant (~26 tools · memory · PIN gates · prompt-injection guard).",
  },
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function AiDemo() {
  const { language } = useLanguage()
  const lang = (language === "en" ? "en" : "de") as Lang
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [pinDigits, setPinDigits] = useState("")
  const running = useRef(false)
  const pendingRef = useRef<Script | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(".ai-reveal", {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const push = useCallback((m: Msg) => setMsgs((p) => [...p, m]), [])

  const finish = useCallback(async (s: Script) => {
    push({ kind: "reply", text: s.reply[lang] })
    await wait(Math.min(2200, s.reply[lang].length * 24 + 400))
    if (!alive.current) return
    if (s.result) { push({ kind: "result", result: s.result }); await wait(650) }
    if (!alive.current) return
    if (s.followup) push({ kind: "followup", text: s.followup[lang] })
    setBusy(false)
    running.current = false
  }, [lang, push])

  const run = useCallback(async (s: Script) => {
    if (running.current) return
    running.current = true
    setBusy(true)
    push({ kind: "user", text: s.chip[lang] })
    await wait(480)
    if (!alive.current) return
    push({ kind: "tool", name: s.tool.name, args: s.tool.args, done: false })
    await wait(1150)
    if (!alive.current) return
    setMsgs((p) => p.map((m) => (m.kind === "tool" && !m.done ? { ...m, done: true } : m)))
    await wait(300)
    if (s.pin) {
      pendingRef.current = s
      push({ kind: "pin", approved: false })
      // wait for user to confirm PIN; runner pauses here
      return
    }
    await finish(s)
  }, [lang, push, finish])

  const approvePin = useCallback(async () => {
    const s = pendingRef.current
    if (!s) return
    setMsgs((p) => p.map((m) => (m.kind === "pin" ? { ...m, approved: true } : m)))
    pendingRef.current = null
    setPinDigits("")
    await wait(500)
    if (!alive.current) return
    await finish(s)
  }, [finish])

  // Autoplay: on first scroll-in the agent starts working by itself, so a
  // passing visitor sees the point of the section without clicking anything.
  const autoPlayed = useRef(false)
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || autoPlayed.current) return
          autoPlayed.current = true
          io.disconnect()
          if (reduce) return
          setTimeout(() => {
            if (alive.current && !running.current) run(SCRIPTS[0])
          }, 850)
        })
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [run])

  const submitFree = useCallback((raw: string) => {
    const q = raw.trim().toLowerCase()
    if (!q || busy) return
    setInput("")
    const hit = SCRIPTS.find((s) =>
      s.id === "parts" ? /brems|pad|belag|teil|part/.test(q) :
      s.id === "booking" ? /termin|slot|book|kalender|calendar|frei/.test(q) :
      /umsatz|revenue|kassa|geld|money|verdien/.test(q)
    )
    if (hit) { run(hit); return }
    running.current = true
    setBusy(true)
    push({ kind: "user", text: raw.trim() })
    wait(500).then(() => {
      if (!alive.current) return
      push({ kind: "reply", text: T.fallback[lang] })
      setBusy(false); running.current = false
    })
  }, [busy, lang, push, run])

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="relative overflow-hidden border-t border-border/30 py-24 pl-6 pr-6 md:pl-28 md:pr-12"
    >
      {/* ambient accent glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-accent/10 blur-[120px]" />

      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,23rem)_1fr] lg:gap-16">
        {/* ---- left rail: the claim ---- */}
        <div>
          <span className="ai-reveal block font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{T.label[lang]}</span>
          <h2 className="ai-reveal mt-4 font-[var(--font-bebas)] text-5xl leading-[0.88] tracking-tight md:text-7xl">
            {T.title[lang]}
          </h2>
          <p className="ai-reveal mt-6 font-mono text-sm leading-relaxed text-muted-foreground">{T.sub[lang]}</p>

          <div className="ai-reveal mt-10 grid grid-cols-3 gap-3">
            {STATS.map((s, i) => (
              <StatCard key={i} s={s} lang={lang} />
            ))}
          </div>

          <p className="ai-reveal mt-8 font-mono text-[10px] leading-relaxed text-muted-foreground/50">
            {T.disclaimer[lang]}
          </p>
        </div>

        {/* ---- right: the live session ---- */}
        <div className="ai-reveal relative">
          {/* glow bleeding out from behind the panel */}
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-accent/[0.07] blur-3xl" />

          <div className="relative border border-border/80 bg-[#09090b] shadow-[0_50px_140px_-50px_rgba(0,0,0,0.95)]">
            {/* screen texture + top highlight so it reads as a display, not a div */}
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent" />
        {/* window chrome */}
        <div className="relative flex items-center gap-3 border-b border-border/60 px-5 py-3">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
          </span>
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground">{T.agent[lang]}</span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> {T.demo[lang]}
          </span>
        </div>

        {/* transcript */}
        <div ref={scrollRef} className="relative h-[380px] space-y-4 overflow-y-auto px-5 py-6 scrollbar-hide lg:h-[440px]" style={{ scrollbarWidth: "none" }}>
          <AnimatePresence initial={false}>
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {m.kind === "user" && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-md border border-accent/40 bg-accent/10 px-4 py-2.5 font-mono text-sm text-foreground">
                      {m.text}
                    </div>
                  </div>
                )}

                {m.kind === "tool" && (
                  <div className={cn(
                    "inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors duration-300",
                    m.done ? "border-emerald-500/40 bg-emerald-500/[0.06]" : "border-accent/40 bg-accent/[0.06]",
                  )}>
                    <span className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full transition-colors",
                      m.done ? "bg-emerald-500/20 text-emerald-400" : "bg-accent/20 text-accent",
                    )}>
                      {m.done ? <Check className="h-3 w-3" /> : <Wrench className="h-3 w-3 animate-spin" style={{ animationDuration: "1.5s" }} />}
                    </span>
                    <span className="text-accent">{m.name}</span>
                    <span className="text-muted-foreground/60">{m.args}</span>
                  </div>
                )}

                {m.kind === "pin" && (
                  <PinPrompt lang={lang} approved={m.approved} digits={pinDigits} setDigits={setPinDigits} onConfirm={approvePin} />
                )}

                {m.kind === "reply" && (
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/40 text-accent-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-border/50 bg-card/70 px-4 py-3">
                      <p className="font-mono text-sm leading-relaxed text-foreground/90">
                        <Typewriter text={m.text} />
                      </p>
                    </div>
                  </div>
                )}

                {m.kind === "result" && (
                  <div className="ml-10 overflow-hidden border border-border/60 bg-gradient-to-b from-card/70 to-card/20">
                    <div className="flex items-center gap-2 border-b border-border/40 bg-accent/[0.07] px-4 py-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{m.result.title[lang]}</span>
                    </div>
                    <div className="divide-y divide-border/30">
                      {m.result.rows.map((r, j) => (
                        <div key={j} className="flex items-center justify-between gap-4 px-4 py-2.5 font-mono text-xs">
                          <span className="text-muted-foreground">{r.k[lang]}</span>
                          <span className={cn("text-right text-foreground", /€/.test(r.v) && "font-semibold text-accent")}>{r.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {m.kind === "followup" && (
                  <div className="ml-10 border-l-2 border-accent/40 pl-3">
                    <p className="font-mono text-sm italic leading-relaxed text-muted-foreground">{m.text}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {msgs.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShieldCheck className="h-5 w-5 text-accent/40" />
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50">
                {T.boot[lang]}
                <span className="flex gap-1">
                  <span className="h-1 w-1 rounded-full bg-accent/70 animate-pulse" />
                  <span className="h-1 w-1 rounded-full bg-accent/70 animate-pulse [animation-delay:200ms]" />
                  <span className="h-1 w-1 rounded-full bg-accent/70 animate-pulse [animation-delay:400ms]" />
                </span>
              </p>
            </div>
          )}
        </div>

        {/* suggestion chips */}
        <div className="relative flex flex-wrap gap-2 border-t border-border/60 px-5 pt-4">
          {SCRIPTS.map((s) => {
            const Icon = CHIP_ICON[s.id]
            return (
              <button
                key={s.id}
                disabled={busy}
                onClick={() => run(s)}
                className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 py-1.5 pl-1.5 pr-3.5 font-mono text-[11px] text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-foreground hover:shadow-[0_0_24px_-8px] hover:shadow-accent/60 disabled:opacity-40"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {s.chip[lang]}
              </button>
            )
          })}
        </div>

        {/* input */}
        <form
          onSubmit={(e) => { e.preventDefault(); submitFree(input) }}
          className="relative flex items-center gap-3 px-5 py-4"
        >
          <CornerDownLeft className="h-4 w-4 shrink-0 text-muted-foreground/40" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={T.placeholder[lang]}
            disabled={busy}
            className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="flex h-8 w-8 items-center justify-center border border-border/50 text-muted-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function cn(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ")
}

function CountUp({ to, run, prefix = "", suffix = "" }: { to: number; run: boolean; prefix?: string; suffix?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  return <>{prefix}{n}{suffix}</>
}

function StatCard({ s, lang }: { s: { v: number; prefix?: string; suffix?: string; fill: number; label: Loc }; lang: Lang }) {
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
        <CountUp to={s.v} run={inView} prefix={s.prefix} suffix={s.suffix} />
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.label[lang]}</div>
      <div className="mt-3 h-0.5 w-full bg-border/30">
        <div className="h-full bg-accent transition-[width] duration-1000 ease-out" style={{ width: inView ? `${s.fill * 100}%` : "0%" }} />
      </div>
    </div>
  )
}

function Typewriter({ text, speed = 20 }: { text: string; speed?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    let i = 0
    const id = setInterval(() => {
      i++
      setN(i)
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return <>{text.slice(0, n)}<span className="ml-0.5 inline-block h-3.5 w-1.5 -mb-0.5 bg-accent/70 animate-pulse" /></>
}

function PinPrompt({
  lang, approved, digits, setDigits, onConfirm,
}: {
  lang: Lang
  approved: boolean
  digits: string
  setDigits: (d: string) => void
  onConfirm: () => void
}) {
  if (approved) {
    return (
      <div className="ml-0 flex items-center gap-2 font-mono text-xs text-accent">
        <ShieldCheck className="h-4 w-4" /> {T.pinApproved[lang]}
      </div>
    )
  }
  return (
    <div className="border border-accent/30 bg-accent/[0.04] p-4">
      <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent">
        <Lock className="h-3.5 w-3.5" /> {T.pinTitle[lang]}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={cn("h-3 w-3 rounded-full border border-accent/50", i < digits.length && "bg-accent")} />
          ))}
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((d) => (
            <button
              key={d}
              onClick={() => setDigits((digits + d).slice(0, 4))}
              className="h-7 w-7 border border-border/50 font-mono text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              •
            </button>
          ))}
        </div>
        <button
          onClick={onConfirm}
          disabled={digits.length < 4}
          className="ml-auto border border-accent/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-30"
        >
          {T.pinConfirm[lang]}
        </button>
      </div>
    </div>
  )
}
