"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ClickUpStats {
  totalTasks: number
  completedTotal: number
  completedThisWeek: number
  completedThisMonth: number
  inProgress: number
  totalTimeTrackedHours: number
  spaces: string[]
}

interface ClickUpTask {
  id: string
  name: string
  status: string
  statusColor: string | null
  priority: string | null
  list: string
  space: string
  dateUpdated: string
  tags: string[]
}

function timeAgo(timestampMs: string): string {
  const diff = Date.now() - parseInt(timestampMs)
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#f50057",
  high: "#ff7043",
  normal: "#ffb300",
  low: "#66bb6a",
}

export function ProductivitySection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const tasksRef = useRef<HTMLDivElement>(null)

  const [stats, setStats] = useState<ClickUpStats | null>(null)
  const [tasks, setTasks] = useState<ClickUpTask[]>([])
  const [workspaceName, setWorkspaceName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchClickUp = useCallback(async () => {
    try {
      const res = await fetch("/api/clickup")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        return
      }
      setStats(data.stats || null)
      setTasks(data.recentTasks || [])
      setWorkspaceName(data.workspaceName || "")
    } catch (err) {
      console.error("ClickUp fetch error:", err)
      setError("Failed to connect to ClickUp")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClickUp()
  }, [fetchClickUp])

  useEffect(() => {
    if (loading || !sectionRef.current || !headerRef.current) return

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

      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll(".stat-item")
        gsap.fromTo(
          statItems,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }

      if (tasksRef.current) {
        const taskItems = tasksRef.current.querySelectorAll(".task-item")
        gsap.fromTo(
          taskItems,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: tasksRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [loading])

  if (error && !stats) return null

  return (
    <section
      ref={sectionRef}
      id="productivity"
      className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          Productivity
        </span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          Task Tracking
        </h2>
        {workspaceName && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            via ClickUp · {workspaceName}
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 border border-border/30 animate-pulse bg-card/50" />
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Stats grid */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <StatCard
              label="Total Tasks"
              value={stats.totalTasks}
              className="stat-item"
            />
            <StatCard
              label="Completed"
              value={stats.completedTotal}
              accent
              className="stat-item"
            />
            <StatCard
              label="This Week"
              value={stats.completedThisWeek}
              className="stat-item"
            />
            <StatCard
              label="In Progress"
              value={stats.inProgress}
              className="stat-item"
            />
          </div>

          {/* Time tracked */}
          {stats.totalTimeTrackedHours > 0 && (
            <div className="mb-16">
              <div className="inline-block border border-border/40 px-6 py-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">
                  Time Tracked
                </span>
                <span className="font-[var(--font-bebas)] text-3xl text-accent">
                  {stats.totalTimeTrackedHours}h
                </span>
              </div>
            </div>
          )}

          {/* Recent tasks */}
          {tasks.length > 0 && (
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6 block">
                Recent Tasks
              </span>
              <div ref={tasksRef} className="grid gap-2 max-w-3xl">
                {tasks.slice(0, 10).map((task) => (
                  <div
                    key={task.id}
                    className="task-item flex items-center gap-4 border border-border/30 px-4 py-3 hover:border-accent/30 transition-colors duration-200"
                  >
                    {/* Status dot */}
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: task.statusColor || "#888" }}
                    />

                    {/* Task name */}
                    <span className="font-mono text-sm text-foreground/90 flex-1 truncate">
                      {task.name}
                    </span>

                    {/* Priority */}
                    {task.priority && (
                      <span
                        className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border flex-shrink-0"
                        style={{
                          color: PRIORITY_COLORS[task.priority] || "#888",
                          borderColor: (PRIORITY_COLORS[task.priority] || "#888") + "44",
                        }}
                      >
                        {task.priority}
                      </span>
                    )}

                    {/* Status */}
                    <span className="font-mono text-[10px] text-muted-foreground/60 flex-shrink-0 w-24 text-right">
                      {task.status}
                    </span>

                    {/* List/space */}
                    <span className="font-mono text-[10px] text-muted-foreground/40 flex-shrink-0 hidden md:block w-32 text-right truncate">
                      {task.list}
                    </span>

                    {/* Time */}
                    {task.dateUpdated && (
                      <span className="font-mono text-[10px] text-muted-foreground/40 flex-shrink-0 w-16 text-right">
                        {timeAgo(task.dateUpdated)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spaces */}
          {stats.spaces.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-3">
              {stats.spaces.map((space) => (
                <span
                  key={space}
                  className="px-3 py-1 border border-border/40 text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
                >
                  {space}
                </span>
              ))}
            </div>
          )}
        </>
      ) : null}
    </section>
  )
}

function StatCard({
  label,
  value,
  accent = false,
  className = "",
}: {
  label: string
  value: number
  accent?: boolean
  className?: string
}) {
  return (
    <div className={cn("border border-border/40 p-6", className)}>
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
        {label}
      </span>
      <span
        className={cn(
          "font-[var(--font-bebas)] text-5xl tracking-tight",
          accent ? "text-accent" : "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  )
}
