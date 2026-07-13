"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "de"

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("de")

    // Simple translation dictionary for static text
    const translations: Record<string, Record<Language, string>> = {
        // Nav
        "nav.home": { en: "Home", de: "Start" },
        "nav.recent": { en: "Recent", de: "Aktuell" },
        "nav.projects": { en: "Projects", de: "Projekte" },
        "nav.showcase": { en: "Devices", de: "Geräte" },
        "nav.demo": { en: "AI Demo", de: "KI-Demo" },
        "nav.io": { en: "IO", de: "IO" },
        "nav.philosophy": { en: "Philosophy", de: "Philosophie" },
        "nav.productivity": { en: "Productivity", de: "Produktivität" },
        "nav.timeline": { en: "Timeline", de: "Zeitlinie" },
        "nav.contact": { en: "Contact", de: "Kontakt" }, // Added for completeness if needed in mobile menu

        // Headers
        "section.portfolio": { en: "01 / Portfolio", de: "01 / Portfolio" },
        "section.selected_work": { en: "SELECTED WORK", de: "AUSGEWÄHLTE ARBEITEN" },
        "section.work_desc": { en: "Production systems for real businesses — agentic AI, custom platforms, automation.", de: "Produktive Systeme für echte Unternehmen — Agentic AI, Individualplattformen, Automatisierung." },

        "section.timeline": { en: "04 / Timeline", de: "04 / Werdegang" },
        "section.experience": { en: "EXPERIENCE", de: "ERFAHRUNG" },

        "section.contact": { en: "03 / Contact", de: "03 / Kontakt" },
        "section.get_in_touch": { en: "GET IN TOUCH", de: "KONTAKT AUFNEHMEN" },

        // Hero
        "hero.label": { en: "PORTFOLIO", de: "PORTFOLIO" },
        "hero.role": { en: "Custom Software & AI Agents for SMBs", de: "Individualsoftware & KI-Agenten für KMU" },
        "hero.description": {
            en: "I build custom software and AI agents that take real work off your team — proven in production, shipped in half the time, built to keep running.",
            de: "Ich baue Individualsoftware und KI-Agenten, die deinem Team echte Arbeit abnehmen — produktiv erprobt, in der halben Zeit, für den Dauerbetrieb gemacht."
        },
        "hero.view_projects": { en: "View Projects", de: "Projekte Ansehen" },
        "hero.experience": { en: "Experience", de: "Erfahrung" },
        "hero.edition": { en: "2026 / Studio Edition", de: "2026 / Studio Edition" },
        "hero.available": { en: "Available for Projects", de: "Verfügbar für Projekte" },

        // Signals
        "section.recent": { en: "01 / Recent Work", de: "01 / Aktuelle Arbeit" },
        "section.latest_projects": { en: "LATEST PROJECTS", de: "NEUESTE PROJEKTE" },
        "signals.no": { en: "No.", de: "Nr." },

        // Principles
        "section.philosophy": { en: "02 / Philosophy", de: "02 / Philosophie" },
        "section.how_i_work": { en: "HOW I WORK", de: "ARBEITSWEISE" },

        // Contact Form
        "form.name": { en: "Name", de: "Name" },
        "form.email": { en: "Email", de: "E-Mail" },
        "form.subject": { en: "Subject", de: "Betreff" },
        "form.message": { en: "Message", de: "Nachricht" },
        "form.placeholder.name": { en: "Your Name", de: "Ihr Name" },
        "form.placeholder.email": { en: "email@example.com", de: "email@beispiel.com" },
        "form.placeholder.subject": { en: "Project Inquiry", de: "Projektanfrage" },
        "form.placeholder.message": { en: "Tell me about your project...", de: "Erzählen Sie mir von Ihrem Projekt..." },
        "form.send": { en: "Send Message", de: "Nachricht Senden" },
        "form.sending": { en: "Sending...", de: "Wird gesendet..." },
        "form.sent": { en: "Message Sent!", de: "Nachricht Gesendet!" },

        // Footer
        "footer.get_in_touch": { en: "Get in Touch", de: "Kontakt" },
        "footer.core_stack": { en: "Core Stack", de: "Tech Stack" },
        "footer.status": { en: "Status", de: "Status" },
        "footer.available": { en: "Available for Projects", de: "Verfügbar für Projekte" },
        "footer.open_to_work": { en: "Available for new projects with SMBs and startups in Vienna and the wider DACH region.", de: "Verfügbar für neue Projekte mit KMU und Startups in Wien und im DACH-Raum." },
    }

    const t = (key: string) => {
        return translations[key]?.[language] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
