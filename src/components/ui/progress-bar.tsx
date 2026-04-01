import React from "react"
import { cn } from "@/lib/utils"

type ProgressBarVariant = "default" | "success" | "warning" | "danger"

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  valueFormatter?: (value: number, max: number) => string
  variant?: ProgressBarVariant
  autoVariant?: boolean
  size?: "sm" | "default" | "lg"
  className?: string
}

const variantColors: Record<ProgressBarVariant, string> = {
  default: "bg-primary",
  success: "bg-[#56949f] dark:bg-[#9ccfd8]",
  warning: "bg-[#ea9d34] dark:bg-[#f6c177]",
  danger: "bg-destructive",
}

function resolveVariant(value: number, max: number): ProgressBarVariant {
  const pct = (value / max) * 100
  if (pct >= 90) return "danger"
  if (pct >= 75) return "warning"
  return "success"
}

const sizeClasses: Record<string, string> = {
  sm: "h-1.5",
  default: "h-1.5",
  lg: "h-4",
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  valueFormatter,
  variant = "default",
  autoVariant = false,
  size = "default",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max)
  const pct = max > 0 ? (clamped / max) * 100 : 0
  const resolvedVariant = autoVariant ? resolveVariant(clamped, max) : variant

  const formatted = valueFormatter
    ? valueFormatter(clamped, max)
    : `${Math.round(pct)}%`

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-[13px] font-medium text-foreground tracking-[-0.01em]">{label}</span>
          )}
          {showValue && (
            <span className="text-[12px] tabular-nums text-muted-foreground">
              {formatted}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-muted overflow-hidden",
          sizeClasses[size],
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantColors[resolvedVariant],
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
