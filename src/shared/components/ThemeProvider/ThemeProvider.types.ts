import { ReactNode } from "react"

export type Theme = "light" | "dark"

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}
