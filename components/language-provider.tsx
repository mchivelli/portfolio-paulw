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
    const [language, setLanguage] = useState<Language>("en")

    // Simple translation dictionary for static text
    const translations: Record<string, Record<Language, string>> = {
        // Nav
        "nav.home": { en: "Home", de: "Start" },
        "nav.recent": { en: "Recent", de: "Aktuell" },
        "nav.projects": { en: "Projects", de: "Projekte" },
        "nav.philosophy": { en: "Philosophy", de: "Philosophie" },
        "nav.timeline": { en: "Timeline", de: "Zeitlinie" },
        "nav.contact": { en: "Contact", de: "Kontakt" }, // Added for completeness if needed in mobile menu

        // Headers
        "section.portfolio": { en: "02 / Portfolio", de: "02 / Portfolio" },
        "section.selected_work": { en: "SELECTED WORK", de: "AUSGEWÄHLTE ARBEITEN" },
        "section.work_desc": { en: "Full-stack projects spanning frontend, backend, databases, and deployment infrastructure.", de: "Full-Stack Projekte von Frontend über Backend bis zur Infrastruktur." },

        "section.timeline": { en: "04 / Timeline", de: "04 / Werdegang" },
        "section.experience": { en: "EXPERIENCE", de: "ERFAHRUNG" },

        "section.contact": { en: "03 / Contact", de: "03 / Kontakt" },
        "section.get_in_touch": { en: "GET IN TOUCH", de: "KONTAKT AUFNEHMEN" },

        // Hero
        "hero.label": { en: "PORTFOLIO", de: "PORTFOLIO" },
        "hero.role": { en: "Full Stack Developer", de: "Full Stack Entwickler" },
        "hero.description": {
            en: "Building scalable systems from concept to deployment. Crafting elegant solutions where frontend meets backend, where design meets code.",
            de: "Entwicklung skalierbarer Systeme von Konzept bis Deployment. Elegante Lösungen, wo Frontend auf Backend und Design auf Code trifft."
        },
        "hero.view_projects": { en: "View Projects", de: "Projekte Ansehen" },
        "hero.experience": { en: "Experience", de: "Erfahrung" },
        "hero.edition": { en: "2025 / Portfolio Edition", de: "2025 / Portfolio Edition" },
        "hero.available": { en: "Available for Work", de: "Verfügbar für Arbeit" },

        // Signals
        "section.recent": { en: "01 / Recent Work", de: "01 / Aktuelle Arbeit" },
        "section.latest_projects": { en: "LATEST PROJECTS", de: "NEUESTE PROJEKTE" },
        "signals.no": { en: "No.", de: "Nr." },

        // Principles
        "section.philosophy": { en: "03 / Philosophy", de: "03 / Philosophie" },
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
        "footer.open_to_work": { en: "Open to full-stack development opportunities, consulting, and interesting challenges.", de: "Offen für Full-Stack Entwicklungsmöglichkeiten, Beratung und interessante Herausforderungen." },
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
