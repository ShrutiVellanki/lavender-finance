import React from "react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@/shared/components/ThemeProvider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  )
}
