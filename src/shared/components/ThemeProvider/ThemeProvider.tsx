import React, { createContext, useContext, useState, useEffect } from "react"
import type { Theme, ThemeContextType, ThemeProviderProps } from "./ThemeProvider.types"

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "light",
  storageKey = "lavender-theme",
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey) as Theme
      if (saved) return saved
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }
    return defaultTheme
  })

  useEffect(() => {
    const root = document.documentElement
    localStorage.setItem(storageKey, theme)
    if (theme === "dark") {
      root.classList.add("dark")
      root.setAttribute("data-theme", "dark")
    } else {
      root.classList.remove("dark")
      root.setAttribute("data-theme", "light")
    }
  }, [theme, storageKey])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
