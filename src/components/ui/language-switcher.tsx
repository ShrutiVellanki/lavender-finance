import React from "react"
import { Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
] as const

interface LanguageSwitcherProps {
  collapsed?: boolean
  className?: string
  currentLanguage?: string
  onLanguageChange?: (code: string) => void
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  collapsed = false,
  className,
  currentLanguage = "en",
  onLanguageChange,
}) => {
  const currentIdx = LANGUAGES.findIndex((l) => l.code === currentLanguage) ?? 0
  const next = LANGUAGES[(currentIdx + 1) % LANGUAGES.length]

  return (
    <button
      onClick={() => onLanguageChange?.(next.code)}
      className={cn(
        "flex items-center gap-3 rounded-lg transition-all duration-150",
        collapsed
          ? "justify-center py-2.5"
          : "w-full px-3 py-2 hover:bg-accent",
        "text-foreground/70 hover:text-foreground",
        className,
      )}
      aria-label={`Switch language to ${next.label}`}
    >
      <Globe className="w-[18px] h-[18px] shrink-0" />
      {!collapsed && (
        <span className="text-[13px] tracking-[-0.01em]">
          {LANGUAGES.find((l) => l.code === currentLanguage)?.label ?? "EN"} → {next.label}
        </span>
      )}
    </button>
  )
}
