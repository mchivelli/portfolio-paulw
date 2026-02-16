"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface GitHubRepo {
  name: string
  description: string | null
  language: string | null
  stars: number
  forks: number
  url: string
  updatedAt: string
  pushedAt: string
}

interface GitHubEvent {
  type: string
  repo: string
  createdAt: string
  payload: {
    commits?: number
    action?: string
    ref?: string
    refType?: string
  }
}

function formatEventDescription(event: GitHubEvent): string {
  switch (event.type) {
    case "PushEvent":
      return `Pushed ${event.payload.commits || 0} commit${(event.payload.commits || 0) !== 1 ? "s" : ""}`
    case "CreateEvent":
      return `Created ${event.payload.refType || "branch"} ${event.payload.ref || ""}`
    case "PullRequestEvent":
      return `${event.payload.action || "opened"} pull request`
    case "IssuesEvent":
      return `${event.payload.action || "opened"} issue`
    default:
      return event.type.replace("Event", "")
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

const LANG_COLOR_MAP: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Java: "#b07219",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
}

export function SignalsSection() {
  const { t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")

  const fetchGitHub = useCallback(async () => {
    try {
      const res = await fetch("/api/github")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setRepos(data.repos || [])
      setEvents(data.events || [])
      setUsername(data.username || "")
    } catch (err) {
      console.error("GitHub fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGitHub()
  }, [fetchGitHub])

  useEffect(() => {
    if (!sectionRef.current || !cursorRef.current) return

    const section = sectionRef.current
    const cursor = cursorRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.to(cursor, {
        x: x,
        y: y,
        duration: 0.5,
        ease: "power3.out",
      })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    section.addEventListener("mousemove", handleMouseMove)
    section.addEventListener("mouseenter", handleMouseEnter)
    section.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      section.removeEventListener("mousemove", handleMouseMove)
      section.removeEventListener("mouseenter", handleMouseEnter)
      section.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    if (loading || !sectionRef.current || !headerRef.current || !cardsRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = cardsRef.current?.querySelectorAll("article")
      if (cards) {
        gsap.fromTo(
          cards,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [loading])

  return (
    <section id="signals" ref={sectionRef} className="relative py-32 pl-6 md:pl-28">
      <div
        ref={cursorRef}
        className={cn(
          "pointer-events-none absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-50",
          "w-12 h-12 rounded-full border-2 border-accent bg-accent",
          "transition-opacity duration-300",
          isHovering ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Section header */}
      <div ref={headerRef} className="mb-16 pr-6 md:pr-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{t("section.recent")}</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">{t("section.latest_projects")}</h2>
        {username && (
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-mono text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            github.com/{username}
          </a>
        )}
      </div>

      {loading ? (
        <div className="flex gap-8 pr-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 h-56 border border-border/30 animate-pulse bg-card/50" />
          ))}
        </div>
      ) : (
        <>
          {/* Repos - horizontal scroll */}
          <div
            ref={(el) => {
              scrollRef.current = el
              cardsRef.current = el
            }}
            className="flex gap-8 overflow-x-auto pb-8 pr-12 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {repos.map((repo, index) => (
              <RepoCard key={repo.name} repo={repo} index={index} t={t} />
            ))}
          </div>

          {/* Recent activity feed */}
          {events.length > 0 && (
            <div className="mt-12 pr-6 md:pr-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                Recent Activity
              </span>
              <div className="flex flex-wrap gap-3">
                {events.slice(0, 8).map((event, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 border border-border/30 px-3 py-1.5 font-mono text-[10px] text-muted-foreground hover:border-accent/40 hover:text-foreground transition-all duration-200"
                  >
                    <span className="text-accent">{event.repo}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span>{formatEventDescription(event)}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-muted-foreground/60">{timeAgo(event.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function RepoCard({
  repo,
  index,
  t,
}: {
  repo: GitHubRepo
  index: number
  t: (key: string) => string
}) {
  const langColor = repo.language ? LANG_COLOR_MAP[repo.language] || "#888" : "#888"

  return (
    <article
      className={cn(
        "group relative flex-shrink-0 w-80",
        "transition-transform duration-500 ease-out",
        "hover:-translate-y-2",
      )}
    >
      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative bg-card border border-border/50 md:border-t md:border-l md:border-r-0 md:border-b-0 p-8 h-full">
          {/* Top torn edge effect */}
          <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

          {/* Repo number + date */}
          <div className="flex items-baseline justify-between mb-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {t("signals.no")} {String(index + 1).padStart(2, "0")}
            </span>
            <time className="font-mono text-[10px] text-muted-foreground/60">
              {timeAgo(repo.pushedAt || repo.updatedAt)}
            </time>
          </div>

          {/* Repo name */}
          <h3 className="font-[var(--font-bebas)] text-4xl tracking-tight mb-4 group-hover:text-accent transition-colors duration-300">
            {repo.name}
          </h3>

          {/* Divider line */}
          <div className="w-12 h-px bg-accent/60 mb-6 group-hover:w-full transition-all duration-500" />

          {/* Description */}
          <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-6 line-clamp-2">
            {repo.description || "No description"}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-4 font-mono text-[10px] text-muted-foreground/60">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
                {repo.language}
              </span>
            )}
            {repo.stars > 0 && <span>★ {repo.stars}</span>}
            {repo.forks > 0 && <span>⑂ {repo.forks}</span>}
          </div>

          {/* Bottom right corner fold effect */}
          <div className="absolute bottom-0 right-0 w-6 h-6 overflow-hidden">
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-background rotate-45 translate-x-4 translate-y-4 border-t border-l border-border/30" />
          </div>
        </div>
      </a>

      {/* Shadow/depth layer */}
      <div className="absolute inset-0 -z-10 translate-x-1 translate-y-1 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </article>
  )
}
