import React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "danger"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
  icon?: React.ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary/10 text-primary",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-destructive/10 text-destructive",
  outline: "text-foreground border-input",
  success: "border-transparent bg-chart-2/10 text-chart-2",
  warning: "border-transparent bg-chart-4/10 text-chart-4",
  danger: "border-transparent bg-destructive/10 text-destructive",
}

export function Badge({ className, variant = "default", icon, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium leading-tight tracking-wide transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0 [&>svg]:w-3 [&>svg]:h-3">{icon}</span>}
      {children}
    </div>
  )
}
