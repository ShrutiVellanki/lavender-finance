import { cn } from "@/shared/utils"
import type { StatCardProps } from "./StatCard.types"
import { trendConfig } from "./StatCard.styles"

export function StatCard({ label, value, trend, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 flex flex-col gap-3 transition-all duration-200",
        "hover:shadow-sm hover:border-border/80",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.06em]">
          {label}
        </span>
        {icon && (
          <span className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
            {icon}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold tracking-[-0.025em] text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </p>
      {trend && (
        <span className={cn("text-[12px] font-medium", trendConfig[trend.direction].color)}>
          {trendConfig[trend.direction].arrow} {trend.value}
        </span>
      )}
    </div>
  )
}
