import type { ButtonVariant, ButtonSize } from "./Button.types"

export const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
}

export const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 rounded-lg px-3 text-[12px] font-medium",
  default: "h-9 px-4 py-2 text-[13px] font-medium",
  lg: "h-10 rounded-lg px-5 text-[13px] font-medium",
  icon: "h-8 w-8",
}
