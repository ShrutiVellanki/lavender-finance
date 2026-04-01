import type { BadgeVariant } from "./Badge.types"

export const variantClasses: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary/10 text-primary",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-destructive/10 text-destructive",
  outline: "text-foreground border-input",
  success: "border-transparent bg-chart-2/10 text-chart-2",
  warning: "border-transparent bg-chart-4/10 text-chart-4",
  danger: "border-transparent bg-destructive/10 text-destructive",
}
