import React from "react"

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "danger"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
  icon?: React.ReactNode
}
