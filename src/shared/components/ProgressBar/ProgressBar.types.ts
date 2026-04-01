export type ProgressBarVariant = "default" | "success" | "warning" | "danger"

export interface ProgressBarProps {
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
