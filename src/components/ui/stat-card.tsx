import React from "react"

type TrendDirection = "up" | "down" | "neutral"

interface StatCardProps {
  label: string
  value: string
  trend?: { direction: TrendDirection; value: string }
  icon?: React.ReactNode
}

const trendConfig: Record<TrendDirection, { color: string; arrow: string }> = {
  up: { color: "text-lavenderDawn-foam dark:text-lavenderMoon-foam", arrow: "↑" },
  down: { color: "text-lavenderDawn-love dark:text-lavenderMoon-love", arrow: "↓" },
  neutral: { color: "text-lavenderDawn-muted dark:text-lavenderMoon-muted", arrow: "→" },
}

export function StatCard({ label, value, trend, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm p-5 flex flex-col gap-2 transition-colors hover:bg-lavenderDawn-highlightLow/30 dark:hover:bg-[#636363]/70">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted uppercase tracking-wider">
          {label}
        </span>
        {icon && <span className="text-lavenderDawn-iris dark:text-lavenderMoon-iris">{icon}</span>}
      </div>
      <p className="text-xl font-semibold tracking-tight text-lavenderDawn-text dark:text-lavenderMoon-text">
        {value}
      </p>
      {trend && (
        <span className={`text-xs font-medium ${trendConfig[trend.direction].color}`}>
          {trendConfig[trend.direction].arrow} {trend.value}
        </span>
      )}
    </div>
  )
}
