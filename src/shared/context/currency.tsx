import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { CurrencyCode } from "@/types"

interface CurrencyContextValue {
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void
  formatCurrency: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

const LOCALE_MAP: Partial<Record<CurrencyCode, string>> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  CAD: "en-CA",
  AUD: "en-AU",
  JPY: "ja-JP",
  INR: "en-IN",
  CHF: "de-CH",
}

export function CurrencyProvider({ children, defaultCurrency = "USD" }: { children: ReactNode; defaultCurrency?: CurrencyCode }) {
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency)

  const formatCurrency = useCallback(
    (amount: number): string => {
      const isNegative = amount < 0
      const locale = LOCALE_MAP[currency] ?? "en-US"
      const formatted = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: currency === "JPY" ? 0 : 2,
        maximumFractionDigits: currency === "JPY" ? 0 : 2,
      }).format(Math.abs(amount))
      return isNegative ? `-${formatted}` : formatted
    },
    [currency],
  )

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider")
  return ctx
}
