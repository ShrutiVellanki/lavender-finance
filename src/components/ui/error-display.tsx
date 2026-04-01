import React from "react"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorDisplayProps {
  message: string
  title?: string
  onRetry?: () => void
  className?: string
  fullScreen?: boolean
}

export function ErrorDisplay({
  message,
  title = "Something went wrong",
  onRetry,
  className,
  fullScreen = true,
}: ErrorDisplayProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-background",
        fullScreen && "min-h-screen",
        !fullScreen && "py-12",
        className,
      )}
    >
      <div className="p-6 rounded-xl bg-card border border-border max-w-md w-full mx-4 shadow-sm">
        <div className="flex items-center justify-center mb-5">
          <div className="p-3 rounded-full bg-destructive/10">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
        </div>
        <h2 className="text-[15px] font-semibold text-card-foreground text-center mb-1.5 tracking-[-0.01em]">
          {title}
        </h2>
        <p className="text-[13px] text-muted-foreground text-center mb-5">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center w-full h-9 px-4 rounded-lg text-[13px] font-medium bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
          >
            <RefreshCcw className="w-3.5 h-3.5 mr-2" />
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
