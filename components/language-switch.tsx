"use client"

import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

export function LanguageSwitch({ className }: { className?: string }) {
    const { language, setLanguage } = useLanguage()

    return (
        <div className={cn("flex flex-col gap-2 items-center", className)}>
            <button
                onClick={() => setLanguage("en")}
                className={cn(
                    "font-mono text-[10px] font-bold transition-colors duration-300",
                    language === "en" ? "text-accent" : "text-muted-foreground hover:text-foreground"
                )}
            >
                EN
            </button>
            <div className="w-[1px] h-3 bg-border/40" />
            <button
                onClick={() => setLanguage("de")}
                className={cn(
                    "font-mono text-[10px] font-bold transition-colors duration-300",
                    language === "de" ? "text-accent" : "text-muted-foreground hover:text-foreground"
                )}
            >
                DE
            </button>
        </div>
    )
}
