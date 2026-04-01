import { cn } from "@/shared/utils"

export const inputCls = cn(
  "w-full bg-muted border border-input rounded-lg px-3 py-2.5 text-sm text-foreground",
  "placeholder:text-muted-foreground",
  "focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary",
  "transition-all duration-200 font-mono tracking-wide",
)
