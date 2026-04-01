import type { ProgressBarVariant } from "./ProgressBar.types"

export const variantColors: Record<ProgressBarVariant, string> = {
  default: "bg-primary",
  success: "bg-[#56949f] dark:bg-[#9ccfd8]",
  warning: "bg-[#ea9d34] dark:bg-[#f6c177]",
  danger: "bg-destructive",
}

export const sizeClasses: Record<string, string> = {
  sm: "h-1.5",
  default: "h-1.5",
  lg: "h-4",
}
