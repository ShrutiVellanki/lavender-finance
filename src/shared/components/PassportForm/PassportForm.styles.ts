import { cn } from "@/shared/utils"

export const inputCls = cn(
  "w-full h-9 px-3 text-[13px] rounded-lg border border-input bg-background text-foreground",
  "placeholder:text-muted-foreground",
  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 ring-offset-background",
  "transition-colors",
)
