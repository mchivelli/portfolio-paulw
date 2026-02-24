"use client"

import { useRef, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TechStack3D } from "@/src/components/TechStack3D"

gsap.registerPlugin(ScrollTrigger)

export function SkillsSection() {
    const { t } = useLanguage()
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!sectionRef.current || !headerRef.current || !contentRef.current) return

        const ctx = gsap.context(() => {
            // Header slide in
            gsap.from(headerRef.current, {
                x: -60,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            })

            // Tech Stack Scale in
            gsap.from(contentRef.current, {
                scale: 0.95,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="skills" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12">
            {/* Section header */}
            <div ref={headerRef} className="mb-16">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">TECH STACK</span>
                <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">Interactive Workspace</h2>
                <p className="mt-6 max-w-md font-mono text-sm text-muted-foreground leading-relaxed">
                    Hover or tap the keycaps to explore the technologies I use to build scalable and modern web applications.
                </p>
            </div>

            {/* 3D Spline Content */}
            <div ref={contentRef} className="w-full">
                <TechStack3D />
            </div>

        </section>
    )
}
