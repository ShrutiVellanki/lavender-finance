import type React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "lavenderMoon" ? "lavenderDawn" : "lavenderMoon")
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full bg-${theme}-highlightLow hover:bg-${theme}-highlightMed transition-colors`}
      aria-label="Toggle theme"
    >
      {theme === "lavenderMoon" ? (
        <Sun className={`w-4 h-4 text-${theme}-text`} />
      ) : (
        <Moon className={`w-4 h-4 text-${theme}-text`} />
      )}
    </button>
  )
}

