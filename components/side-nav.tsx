"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { LanguageSwitch } from "@/components/language-switch"
import { useLanguage } from "@/components/language-provider"
import { StaggeredMenu } from "@/components/ui/staggered-menu"

const navItems = [
  { id: "hero", label: "nav.home" },
  { id: "signals", label: "nav.recent" },
  { id: "work", label: "nav.projects" },
  { id: "principles", label: "nav.philosophy" },
  { id: "productivity", label: "nav.productivity" },
  { id: "timeline", label: "nav.timeline" },
]

export function SideNav() {
  const [activeSection, setActiveSection] = useState("hero")
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 },
    )

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const staggeredItems = navItems.map(item => ({
    id: item.id,
    label: t(item.label),
    ariaLabel: t(item.label)
  }))

  return (
    <nav className="fixed left-0 top-0 z-50 h-screen w-16 md:w-20 hidden md:flex flex-col items-center border-r border-border/30 bg-background/80 backdrop-blur-sm">
      {/* Logo */}
      <a
        href="#hero"
        className="absolute top-8 h-8 w-8 rounded-full border border-accent/50 flex items-center justify-center group hover:scale-110 transition-transform duration-300"
      >
        <span className="font-[var(--font-bebas)] text-accent text-sm leading-none pt-0.5">N</span>
      </a>

      {/* Centered Navigation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        <StaggeredMenu
          items={staggeredItems}
          onItemClick={scrollToSection}
          position="left"
        />
      </div>

      {/* Language Switch */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <LanguageSwitch />
      </div>
    </nav>
  )
}
