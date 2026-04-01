import React from "react"

export type TrendDirection = "up" | "down" | "neutral"

export interface StatCardProps {
  label: string
  value: string
  trend?: { direction: TrendDirection; value: string }
  icon?: React.ReactNode
  className?: string
}
