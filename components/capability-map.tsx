"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import {
  Bot, FileCheck2, Database, Building2, BookOpenCheck, Workflow, Cpu, Smartphone, CreditCard,
} from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Lang = "de" | "en"
type Loc = Record<Lang, string>
type Status = "live" | "wip"

const T = {
  label: { de: "SPANNWEITE", en: "RANGE" } as Loc,
  title: { de: "WAS ICH\nAUTOMATISIERE", en: "WHAT I\nAUTOMATE" } as Loc,
  sub: {
    de: "Nicht ein Trick, sondern eine Spannweite. Dieselbe Denkweise — Abläufe verstehen, sie in Software gießen, KI die Arbeit übernehmen lassen — quer durch sehr verschiedene Domänen.",
    en: "Not one trick, but a range. The same approach — understand a workflow, turn it into software, let AI do the work — applied across very different domains.",
  } as Loc,
  live: { de: "live", en: "live" } as Loc,
  wip: { de: "Prototyp / Konzept", en: "prototype / concept" } as Loc,
}

type Project = { name: string; status: Status }
type Domain = { icon: typeof Bot; title: Loc; line: Loc; projects: Project[] }

const DOMAINS: Domain[] = [
  {
    icon: Bot,
    title: { de: "Agentische KI & Tool-Calling", en: "Agentic AI & tool-calling" },
    line: { de: "KI, die echte Aktionen ausführt — nicht nur chattet.", en: "AI that performs real actions — not just chats." },
    projects: [
      { name: "KFZ-CRM · 74 Aktionen", status: "live" },
      { name: "AIChatMod · KI-NPCs m. Gedächtnis", status: "live" },
      { name: "keeper-of-the-lore · RAG-Bot", status: "live" },
    ],
  },
  {
    icon: FileCheck2,
    title: { de: "Dokumenten- & Compliance-Automatisierung", en: "Document & compliance automation" },
    line: { de: "Von Datenabruf bis fertiges, signiertes Dokument — ohne Nacherfassen.", en: "From data fetch to a finished, signed document — no re-entry." },
    projects: [
      { name: "Onboarding-Plattform · KYC → BMD", status: "live" },
      { name: "STEP-IN · auto-benotete Tests", status: "live" },
    ],
  },
  {
    icon: Database,
    title: { de: "Datenaggregation & Preis-Intelligence", en: "Data aggregation & price intelligence" },
    line: { de: "Verstreute Quellen zu einer durchsuchbaren, bewerteten Datenbasis.", en: "Scattered sources into one searchable, scored dataset." },
    projects: [
      { name: "WillBellen · Tierheim-Aggregator", status: "live" },
      { name: "WillKlima.at · Preisvergleich", status: "wip" },
      { name: "g-w-seo · SEO/GEO-Audit-Engine", status: "live" },
    ],
  },
  {
    icon: Building2,
    title: { de: "Enterprise & Microsoft 365", en: "Enterprise & Microsoft 365" },
    line: { de: "Innerhalb bestehender Konzern-Identität: Entra, Graph, Copilot.", en: "Inside existing corporate identity: Entra, Graph, Copilot." },
    projects: [
      { name: "Corporate Dashboard · Entra SSO + Graph", status: "live" },
    ],
  },
  {
    icon: BookOpenCheck,
    title: { de: "Grounded AI & RAG", en: "Grounded AI & RAG" },
    line: { de: "Belegte Antworten mit Quellen — oder eine ehrliche Absage.", en: "Cited answers with sources — or an honest refusal." },
    projects: [
      { name: "GuW-Wissensdatenbank · 11/11 Evals", status: "wip" },
      { name: "Steuermentor · AT/DE/EU", status: "wip" },
    ],
  },
  {
    icon: Workflow,
    title: { de: "Prozess- & Medien-Automatisierung", en: "Process & media automation" },
    line: { de: "Wiederkehrende Abläufe laufen von selbst — mit Kontrolle an den richtigen Stellen.", en: "Recurring workflows run themselves — with control where it matters." },
    projects: [
      { name: "Shorts-Bot · Reddit → YouTube", status: "live" },
      { name: "n8n-Flows · Buchung & Chat", status: "live" },
      { name: "Bewerbungs-Pipeline", status: "live" },
    ],
  },
  {
    icon: Cpu,
    title: { de: "Systems & Low-Level", en: "Systems & low-level" },
    line: { de: "Bis in die Interna: Java, eingebetteter Server im Spiel, 340k Downloads.", en: "Down to the internals: Java, an embedded in-game server, 340k downloads." },
    projects: [
      { name: "War 'N Taxes · 152 Java-Dateien", status: "live" },
      { name: "RCON-Test-Harness", status: "live" },
    ],
  },
  {
    icon: Smartphone,
    title: { de: "Mobile, 3D & Web", en: "Mobile, 3D & web" },
    line: { de: "Native Apps, WebGL-3D und installierbare PWAs.", en: "Native apps, WebGL 3D and installable PWAs." },
    projects: [
      { name: "KIGA-App · Flutter", status: "live" },
      { name: "neon-arcade · Three.js/WebGL", status: "live" },
      { name: "WillBellen · iOS + Android", status: "live" },
    ],
  },
  {
    icon: CreditCard,
    title: { de: "Payments & digitale Identität", en: "Payments & digital identity" },
    line: { de: "Stripe-Checkout, Voice-Commerce und signierte Wallet-Pässe.", en: "Stripe checkout, voice commerce and signed wallet passes." },
    projects: [
      { name: "craave · Stripe + Voice", status: "wip" },
      { name: "wallet-card · signierte .pkpass", status: "live" },
      { name: "cwolf · PWA-Visitenkarte", status: "live" },
    ],
  },
]

export function CapabilityMap() {
  const { language } = useLanguage()
  const lang = (language === "en" ? "en" : "de") as Lang
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(".cm-head", {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" },
      })
      gsap.from(".cm-tile", {
        y: 44, opacity: 0, duration: 0.7, stagger: 0.06, ease: "power3.out",
        scrollTrigger: { trigger: ".cm-grid", start: "top 85%", toggleActions: "play none none reverse" },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative overflow-hidden border-t border-border/30 py-24 pl-6 pr-6 md:pl-28 md:pr-12"
    >
      <div className="pointer-events-none absolute -top-24 right-1/4 h-[32rem] w-[32rem] rounded-full bg-accent/[0.08] blur-[130px]" />

      {/* header */}
      <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <span className="cm-head block font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{T.label[lang]}</span>
          <h2 className="cm-head mt-4 whitespace-pre-line font-[var(--font-bebas)] text-5xl leading-[0.85] tracking-tight md:text-7xl">
            {T.title[lang]}
          </h2>
        </div>
        <p className="cm-head max-w-md font-mono text-sm leading-relaxed text-muted-foreground">{T.sub[lang]}</p>
      </div>

      {/* domain grid */}
      <div className="cm-grid grid gap-px overflow-hidden border border-border/40 bg-border/40 md:grid-cols-2 lg:grid-cols-3">
        {DOMAINS.map((d, i) => (
          <div key={i} className="cm-tile group relative flex flex-col gap-4 bg-[#09090b] p-6 transition-colors duration-300 hover:bg-accent/[0.04]">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                <d.icon className="h-4 w-4" />
              </span>
              <h3 className="font-[var(--font-bebas)] text-xl leading-none tracking-tight text-foreground md:text-2xl">
                {d.title[lang]}
              </h3>
            </div>

            <p className="font-mono text-xs leading-relaxed text-muted-foreground">{d.line[lang]}</p>

            <ul className="mt-auto flex flex-col gap-2 border-t border-border/30 pt-4">
              {d.projects.map((p, j) => (
                <li key={j} className="flex items-center gap-2.5 font-mono text-[11px] text-muted-foreground/90">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      p.status === "live" ? "bg-accent" : "border border-muted-foreground/50 bg-transparent",
                    )}
                    title={p.status === "live" ? T.live[lang] : T.wip[lang]}
                  />
                  {p.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* legend */}
      <div className="mt-6 flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> {T.live[lang]}</span>
        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full border border-muted-foreground/50" /> {T.wip[lang]}</span>
      </div>
    </section>
  )
}
