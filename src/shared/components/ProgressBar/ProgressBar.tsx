import { cn } from "@/shared/utils"
import type { ProgressBarProps, ProgressBarVariant } from "./ProgressBar.types"
import { variantColors, sizeClasses } from "./ProgressBar.styles"

function resolveVariant(value: number, max: number): ProgressBarVariant {
  const pct = (value / max) * 100
  if (pct >= 90) return "danger"
  if (pct >= 75) return "warning"
  return "success"
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
