import React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps {
  message?: string
  className?: string
  fullScreen?: boolean
}

export function Loading({
  message = "Loading...",
  className,
  fullScreen = true,
}: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-background",
        fullScreen && "min-h-screen",
        !fullScreen && "py-12",
        className,
      )}
    >
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="mt-3 text-[14px] font-medium text-muted-foreground tracking-[-0.01em]">{message}</p>
    </div>
  )
}
