import React, { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/shared/utils"
import type { PinInputProps } from "./PinCode.types"

export default function PinInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  autoFocus = true,
  masked = false,
  disabled = false,
  className,
  label = "Verification code",
}: PinInputProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<string[]>(
    Array.from({ length }, (_, i) => defaultValue[i] ?? ""),
  )
  const digits = isControlled ? Array.from({ length }, (_, i) => value?.[i] ?? "") : internalValue
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const joinedValue = useMemo(() => digits.join(""), [digits])

  useEffect(() => {
    if (autoFocus && !disabled) inputRefs.current[0]?.focus()
  }, [autoFocus, disabled])

  useEffect(() => {
    onChange?.(joinedValue)
    if (joinedValue.length === length && !digits.includes("")) onComplete?.(joinedValue)
  }, [joinedValue, length, onChange, onComplete, digits])

  function updateDigits(next: string[]) {
    if (!isControlled) setInternalValue(next)
  }

  function handleChange(i: number, raw: string) {
    const numeric = raw.replace(/\D/g, "")
    if (!numeric) {
      const n = [...digits]; n[i] = ""; updateDigits(n); return
    }
    const n = [...digits]; let c = i
    for (const ch of numeric) { if (c >= length) break; n[c] = ch; c++ }
    updateDigits(n)
    const next = Math.min(i + numeric.length, length - 1)
    inputRefs.current[next]?.focus()
    inputRefs.current[next]?.select()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Backspace": {
        e.preventDefault()
        const n = [...digits]
        if (n[i]) { n[i] = ""; updateDigits(n); return }
        if (i > 0) { n[i - 1] = ""; updateDigits(n); inputRefs.current[i - 1]?.focus(); inputRefs.current[i - 1]?.select() }
        return
      }
      case "ArrowLeft":
        e.preventDefault()
        if (i > 0) { inputRefs.current[i - 1]?.focus(); inputRefs.current[i - 1]?.select() }
        return
      case "ArrowRight":
        e.preventDefault()
        if (i < length - 1) { inputRefs.current[i + 1]?.focus(); inputRefs.current[i + 1]?.select() }
        return
      case " ": e.preventDefault(); return
    }
  }

  function handlePaste(i: number, e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "")
    if (!pasted) return
    const n = [...digits]; let c = i
    for (const ch of pasted) { if (c >= length) break; n[c] = ch; c++ }
    updateDigits(n)
    const focus = Math.min(c, length - 1)
    inputRefs.current[focus]?.focus()
    inputRefs.current[focus]?.select()
  }

  return (
    <fieldset className={cn("border-none p-0 m-0", className)} disabled={disabled}>
      <legend className="mb-2 text-[13px] font-medium text-foreground">{label}</legend>
      <div role="group" aria-label={`${length}-digit verification code`} className="flex gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            type={masked ? "password" : "text"}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? "one-time-code" : undefined}
            maxLength={length}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${i + 1} of ${length}`}
            className="w-11 h-12 text-center text-lg rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 ring-offset-background transition-colors disabled:opacity-50"
          />
        ))}
      </div>
    </fieldset>
  )
}
