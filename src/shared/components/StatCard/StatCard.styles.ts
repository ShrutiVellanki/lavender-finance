import type { TrendDirection } from "./StatCard.types"

export const trendConfig: Record<TrendDirection, { color: string; arrow: string }> = {
  up: { color: "text-chart-2", arrow: "↑" },
  down: { color: "text-destructive", arrow: "↓" },
  neutral: { color: "text-muted-foreground", arrow: "→" },
}
