import { cn } from "@/shared/utils"
import type { BadgeProps } from "./Badge.types"
import { variantClasses } from "./Badge.styles"

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
