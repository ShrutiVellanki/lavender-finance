import { Loader2 } from "lucide-react"
import { cn } from "@/shared/utils"
import type { LoadingProps } from "./Loading.types"

export function Loading({
  message = "Loading...",
  className,
  fullScreen = true,
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center bg-background",
        fullScreen && "min-h-screen",
        !fullScreen && "py-12",
        className,
      )}
    >
      <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
      <p className="mt-3 text-[14px] font-medium text-muted-foreground tracking-[-0.01em]">{message}</p>
    </div>
  )
}
