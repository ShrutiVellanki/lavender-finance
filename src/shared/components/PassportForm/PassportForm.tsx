import React, { useMemo, useState } from "react"
import { cn } from "@/shared/utils"
import type { Country, PassportFormProps } from "./PassportForm.types"
import { inputCls } from "./PassportForm.styles"

const PASSPORT_RULES: Record<Exclude<Country, "">, RegExp> = {
  USA: /^\d{9}$/,
  Canada: /^[A-Z]{2}\d{6}$/,
  UK: /^[A-Z0-9]{9}$/,
}

function validatePassport(country: Country, value: string): string {
  if (!country) return "Please select a country."
  if (!value.trim()) return "Passport number is required."
  if (country === "Canada" || country === "UK") value = value.toUpperCase()
  const rule = PASSPORT_RULES[country as Exclude<Country, "">]
  if (!rule.test(value)) {
    switch (country) {
      case "USA": return "USA passport must be exactly 9 digits."
      case "Canada": return "Canada passport must be 2 letters followed by 6 digits."
      case "UK": return "UK passport must be exactly 9 alphanumeric characters."
      default: return "Invalid passport number."
    }
  }
  return ""
}

export default function PassportForm({ onSubmit, title = "Identity Verification", className }: PassportFormProps) {
  const [country, setCountry] = useState<Country>("")
  const [passport, setPassport] = useState("")
  const [touched, setTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const error = useMemo(() => validatePassport(country, passport), [country, passport])
  const showError = (touched || submitted) && !!error
  const isValid = country !== "" && passport.trim() !== "" && !error

  function handleCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCountry(e.target.value as Country)
    setPassport("")
    setTouched(false)
    setSubmitted(false)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched(true)
    setSubmitted(true)
    if (!isValid) return
    onSubmit?.()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("max-w-[400px] space-y-5", className)}>
      <h3 className="text-base font-medium text-foreground">{title}</h3>

      <div className="space-y-1.5">
        <label htmlFor="country" className="block text-[13px] font-medium text-foreground">Country</label>
        <select
          id="country"
          value={country}
          onChange={handleCountryChange}
          aria-invalid={showError && !country ? "true" : "false"}
          className={inputCls}
        >
          <option value="">Select a country</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="UK">UK</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="passport" className="block text-[13px] font-medium text-foreground">Government ID Number</label>
        <input
          id="passport"
          type="text"
          value={passport}
          onChange={(e) => setPassport(country === "Canada" || country === "UK" ? e.target.value.toUpperCase() : e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={showError ? "true" : "false"}
          aria-describedby={showError ? "passport-error" : undefined}
          placeholder={country === "USA" ? "123456789" : country === "Canada" ? "AB123456" : country === "UK" ? "A12BC34DE" : "Enter ID number"}
          className={cn(inputCls, showError && "border-destructive focus:ring-destructive")}
        />
        {showError && (
          <p id="passport-error" role="alert" className="text-[12px] text-destructive mt-1">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={cn(
          "h-9 px-4 text-[13px] font-medium rounded-lg transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "active:scale-[0.98]",
          isValid
            ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed",
        )}
      >
        Verify Identity
      </button>
    </form>
  )
}
