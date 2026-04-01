import React from "react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@/shared/components/ThemeProvider"
import { CurrencyProvider } from "@/shared/context/currency"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
