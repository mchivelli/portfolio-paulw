"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { timeline } from "@/app/data/timeline"
import { projects } from "@/app/data/projects"
import { Download, ArrowLeft, Mail, Github, Linkedin, Globe, MapPin } from "lucide-react"

type Lang = "de" | "en"
type Loc = Record<Lang, string>

const T: Record<string, Loc> = {
  back: { de: "Zurück zur Seite", en: "Back to site" },
  download: { de: "Als PDF herunterladen", en: "Download as PDF" },
  role: { de: "Individualsoftware & KI-Agenten für KMU", en: "Custom Software & AI Agents for SMBs" },
  summary: {
    de: "Entwickler mit produktiv laufenden Systemen: ein Werkstatt-CRM mit echtem Tool-callendem KI-Assistenten und eine live betriebene Mandanten-Plattform für eine Wiener Steuerkanzlei. Daneben ein Open-Source-Mod mit über 340.000 Downloads. Ich baue Individualsoftware und KI-Automatisierung, die im Dauerbetrieb hält.",
    en: "Developer with systems live in production: a workshop CRM with a real tool-calling AI assistant, and a client-onboarding platform running live for a Vienna tax firm. Alongside that, an open-source mod downloaded over 340,000 times. I build custom software and AI automation that holds up in daily operation.",
  },
  experience: { de: "Erfahrung", en: "Experience" },
  projects: { de: "Ausgewählte Projekte", en: "Selected Projects" },
  skills: { de: "Skills", en: "Skills" },
  education: { de: "Ausbildung", en: "Education" },
  languages: { de: "Sprachen", en: "Languages" },
  focus: { de: "Fokus", en: "Focus" },
  langlist: { de: "Deutsch (Muttersprache) · Englisch (fließend)", en: "German (native) · English (fluent)" },
  edu: { de: "Informatik & Software Engineering", en: "Computer Science & Software Engineering" },
  eduWhere: { de: "HTL Wien West · Abendschule", en: "HTL Wien West · Evening School" },
  focuslist: {
    de: "Agentic AI · Automatisierung · Full-Stack-Web · Individualplattformen",
    en: "Agentic AI · Automation · Full-Stack Web · Custom Platforms",
  },
}

const HIGHLIGHTS: { v: Loc; l: Loc }[] = [
  { v: { de: "4+", en: "4+" }, l: { de: "Produktiv-Systeme", en: "production systems" } },
  { v: { de: "800+", en: "800+" }, l: { de: "automatisierte Tests", en: "automated tests" } },
  { v: { de: "Agentic", en: "Agentic" }, l: { de: "KI mit Tool-Calling", en: "AI, tool-calling" } },
  { v: { de: "Wien → DACH", en: "Vienna → DACH" }, l: { de: "Zielmarkt", en: "target market" } },
]

const SKILL_GROUPS: { title: Loc; items: [string, number][] }[] = [
  {
    title: { de: "Sprachen & Frameworks", en: "Languages & Frameworks" },
    items: [["TypeScript", 95], ["Next.js / React 19", 92], ["Node.js / Express", 88], ["Python", 80]],
  },
  {
    title: { de: "KI & Daten", en: "AI & Data" },
    items: [["LLM Agents / Tool-Calling", 90], ["RAG / Qdrant", 78], ["PostgreSQL / Drizzle", 84]],
  },
  {
    title: { de: "Infra & Tooling", en: "Infra & Tooling" },
    items: [["Docker", 76], ["Azure / Hetzner", 72], ["GSAP / Tailwind", 86]],
  },
]

const PRINT_CSS = `
@media print {
  @page { margin: 12mm; }
  .cv-noprint { display: none !important; }
  html, body { background: #ffffff !important; }
  .cv-doc { background: #ffffff !important; color: #141410 !important; min-height: 0 !important; }
  .cv-doc .text-foreground, .cv-doc h1, .cv-doc h2, .cv-doc h3, .cv-doc h4 { color: #141410 !important; }
  .cv-doc [class*="text-muted-foreground"] { color: #565656 !important; }
  .cv-doc [class*="text-accent"] { color: #b4530a !important; }
  .cv-doc [class*="border-"] { border-color: #d8d8d8 !important; }
  .cv-doc [class*="bg-card"] { background: transparent !important; }
  .cv-doc [class*="bg-border"] { background-color: #e6e6e6 !important; }
  .cv-doc [class*="bg-accent"] { background-color: #b4530a !important; }
  .cv-block, .cv-doc section, .cv-doc header { break-inside: avoid; }
}
`

export default function CVPage() {
  const { language, setLanguage } = useLanguage()
  const lang = (language === "en" ? "en" : "de") as Lang

  return (
    <main className="cv-doc relative min-h-screen bg-background text-foreground">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      {/* Toolbar — screen only */}
      <div className="cv-noprint sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/80 px-6 py-4 backdrop-blur-sm md:px-12">
        <Link href="/" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {T.back[lang]}
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <button onClick={() => setLanguage("de")} className={lang === "de" ? "text-accent" : "text-muted-foreground hover:text-foreground"}>DE</button>
            <span className="text-muted-foreground/30">/</span>
            <button onClick={() => setLanguage("en")} className={lang === "en" ? "text-accent" : "text-muted-foreground hover:text-foreground"}>EN</button>
          </div>
          <button
            onClick={() => window.print()}
            className="group inline-flex items-center gap-2 border border-foreground/20 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-foreground transition-all hover:border-accent hover:text-accent"
          >
            <Download className="h-3.5 w-3.5" />
            {T.download[lang]}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-14 md:px-12">
        {/* Header */}
        <header className="mb-12">
          <div className="grid items-end gap-8 md:grid-cols-[auto_1fr]">
            <div className="relative h-40 w-40 shrink-0 overflow-hidden border border-border/50 md:h-48 md:w-48">
              <img src="/portrait2.webp" alt="Paul Wallner" className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 m-1.5 border border-accent/30" />
            </div>
            <div>
              <h1 className="font-[var(--font-bebas)] text-6xl leading-[0.9] tracking-tight md:text-8xl">PAUL<br />WALLNER</h1>
              <p className="mt-3 font-mono text-sm uppercase tracking-[0.2em] text-accent">{T.role[lang]}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
            <a href="mailto:paul@paulwallner.me" className="inline-flex items-center gap-1.5 hover:text-accent"><Mail className="h-3.5 w-3.5" />paul@paulwallner.me</a>
            <a href="https://github.com/mchivelli" className="inline-flex items-center gap-1.5 hover:text-accent"><Github className="h-3.5 w-3.5" />github.com/mchivelli</a>
            <a href="https://linkedin.com/in/paulwallner" className="inline-flex items-center gap-1.5 hover:text-accent"><Linkedin className="h-3.5 w-3.5" />linkedin.com/in/paulwallner</a>
            <a href="https://paulwallner.me" className="inline-flex items-center gap-1.5 hover:text-accent"><Globe className="h-3.5 w-3.5" />paulwallner.me</a>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Wien, AT</span>
          </div>
          <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">{T.summary[lang]}</p>

          {/* Highlights band */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="border border-border/50 bg-card/40 px-4 py-3">
                <div className="font-[var(--font-bebas)] text-2xl leading-none text-foreground md:text-3xl">{h.v[lang]}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{h.l[lang]}</div>
              </div>
            ))}
          </div>
        </header>

        <div className="grid gap-14 md:grid-cols-[1.7fr_1fr]">
          {/* Main column */}
          <div className="space-y-14">
            {/* Experience — visual timeline */}
            <section>
              <SectionTitle>{T.experience[lang]}</SectionTitle>
              <div className="relative space-y-9 border-l border-border/40 pl-8">
                {timeline.map((item, i) => (
                  <div key={i} className="cv-block relative">
                    <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
                    <span className="font-[var(--font-bebas)] text-xl text-accent">{item.year}</span>
                    <h3 className="font-[var(--font-bebas)] text-2xl leading-tight tracking-tight">{item.role[lang]}</h3>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{item.company}</p>
                    <p className="mt-2 font-mono text-sm leading-relaxed text-muted-foreground">{item.description[lang]}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tech.map((t, j) => (
                        <span key={j} className="border border-border/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Selected Projects */}
            <section>
              <SectionTitle>{T.projects[lang]}</SectionTitle>
              <div className="space-y-5">
                {projects.filter((p) => p.featured).map((p) => (
                  <div key={p.id} className="cv-block border border-border/40 p-4 transition-colors hover:border-accent/40">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-[var(--font-bebas)] text-2xl tracking-tight">{p.title[lang]}</h3>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{p.medium[lang]}</span>
                    </div>
                    <p className="mt-1 font-mono text-sm leading-relaxed text-muted-foreground">{p.description[lang]}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">{p.tech.slice(0, 6).join(" · ")}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Side column */}
          <aside className="space-y-12">
            <section>
              <SectionTitle>{T.skills[lang]}</SectionTitle>
              <div className="space-y-6">
                {SKILL_GROUPS.map((g, i) => (
                  <div key={i}>
                    <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">{g.title[lang]}</h4>
                    <div className="space-y-3">
                      {g.items.map(([name, pct]) => (
                        <SkillBar key={name} label={name} pct={pct} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>{T.focus[lang]}</SectionTitle>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">{T.focuslist[lang]}</p>
            </section>

            <section>
              <SectionTitle>{T.education[lang]}</SectionTitle>
              <h3 className="font-[var(--font-bebas)] text-xl tracking-tight">{T.edu[lang]}</h3>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{T.eduWhere[lang]}</p>
            </section>

            <section>
              <SectionTitle>{T.languages[lang]}</SectionTitle>
              <p className="font-mono text-sm text-muted-foreground">{T.langlist[lang]}</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}

function SkillBar({ label, pct }: { label: string; pct: number }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => setW(pct), 120)
    return () => clearTimeout(id)
  }, [pct])
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-[11px]">
        <span className="text-foreground/80">{label}</span>
        <span className="text-muted-foreground/40">{pct}</span>
      </div>
      <div className="mt-1.5 h-1 w-full bg-border/40">
        <div className="h-full bg-accent transition-[width] duration-[1200ms] ease-out" style={{ width: `${w}%` }} />
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
      <span className="mr-3 inline-block h-px w-6 -translate-y-1 bg-accent/60 align-middle" />
      {children}
    </h2>
  )
}
