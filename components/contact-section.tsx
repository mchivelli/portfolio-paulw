"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

export function ContactSection() {
    const { t } = useLanguage()
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (!sectionRef.current || !headerRef.current || !formRef.current) return

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

            // Form fade up
            if (formRef.current) {
                gsap.from(formRef.current.children, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                })
            }
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("submitting")
        setErrorMessage("")

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to send message")
            }

            setStatus("success")
            setFormData({ name: "", email: "", subject: "", message: "" })

            // Reset success status after 5 seconds
            setTimeout(() => setStatus("idle"), 5000)
        } catch (err: any) {
            console.error(err)
            setStatus("error")
            setErrorMessage(err.message || "Something went wrong")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <section ref={sectionRef} id="contact" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 bg-background">
            {/* Section header */}
            <div ref={headerRef} className="mb-16">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{t("section.contact")}</span>
                <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">{t("section.get_in_touch")}</h2>
            </div>

            <div className="max-w-xl">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("form.name")}</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-transparent border-0 border-b border-border py-2 px-0 focus:border-accent focus:ring-0 transition-colors font-mono text-sm"
                                placeholder={t("form.placeholder.name")}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("form.email")}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-transparent border-0 border-b border-border py-2 px-0 focus:border-accent focus:ring-0 transition-colors font-mono text-sm"
                                placeholder={t("form.placeholder.email")}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="subject" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("form.subject")}</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full bg-transparent border-0 border-b border-border py-2 px-0 focus:border-accent focus:ring-0 transition-colors font-mono text-sm"
                            placeholder={t("form.placeholder.subject")}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("form.message")}</label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full bg-transparent border-0 border-b border-border py-2 px-0 focus:border-accent focus:ring-0 transition-colors font-mono text-sm resize-none"
                            placeholder={t("form.placeholder.message")}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={status === "submitting" || status === "success"}
                            className={cn(
                                "group relative inline-flex items-center gap-3 overflow-hidden px-8 py-3 bg-accent text-background font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors duration-300",
                                status === "success" && "bg-green-500 hover:bg-green-500 text-white"
                            )}
                        >
                            {status === "submitting" ? (
                                <span>{t("form.sending")}</span>
                            ) : status === "success" ? (
                                <span>{t("form.sent")}</span>
                            ) : (
                                <>
                                    <span>{t("form.send")}</span>
                                    <span className="w-4 h-[1px] bg-background group-hover:w-6 transition-all duration-300" />
                                </>
                            )}
                        </button>

                        {status === "error" && (
                            <p className="mt-4 font-mono text-xs text-red-500">{errorMessage}</p>
                        )}
                    </div>
                </form>
            </div>
        </section>
    )
}
