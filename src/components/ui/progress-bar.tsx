import React from "react"

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  valueFormatter?: (value: number, max: number) => string
  autoVariant?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  valueFormatter,
  autoVariant = false,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max)
  const pct = max > 0 ? (clamped / max) * 100 : 0

  const formatted = valueFormatter
    ? valueFormatter(clamped, max)
    : `${Math.round(pct)}%`

  let barColor = "bg-lavenderDawn-iris dark:bg-lavenderMoon-iris"
  if (autoVariant) {
    if (pct >= 90) barColor = "bg-lavenderDawn-love dark:bg-lavenderMoon-love"
    else if (pct >= 75) barColor = "bg-lavenderDawn-gold dark:bg-lavenderMoon-gold"
    else barColor = "bg-lavenderDawn-foam dark:bg-lavenderMoon-foam"
  }

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-xs tabular-nums text-lavenderDawn-muted dark:text-lavenderMoon-muted">
              {formatted}
            </span>
          )}
        </div>
      )}
      <div
        className="w-full h-2 rounded-full bg-lavenderDawn-highlightLow dark:bg-lavenderMoon-highlightLow overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
