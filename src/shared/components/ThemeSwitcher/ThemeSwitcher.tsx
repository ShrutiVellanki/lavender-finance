import React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/shared/components/ThemeProvider"
import { cn } from "@/shared/utils"
import type { ThemeSwitcherProps } from "./ThemeSwitcher.types"

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className, collapsed = false }) => {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "flex items-center gap-3 rounded-lg transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        collapsed
          ? "justify-center p-2 w-8 h-8 bg-secondary hover:bg-accent"
          : "w-full px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-accent",
        className,
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-[18px] h-[18px] shrink-0 text-foreground" />
      ) : (
        <Moon className="w-[18px] h-[18px] shrink-0 text-foreground" />
      )}
      {!collapsed && (
        <span className="text-[13px] tracking-[-0.01em]">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  )
}
