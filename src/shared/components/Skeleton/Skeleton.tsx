import React from "react"
import { cn } from "@/shared/utils"
import { SkeletonProps } from "./Skeleton.types"
import { variantClasses } from "./Skeleton.styles"

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "text", width, height, lines, gap = "0.625rem", style, ...props }, ref) => {
    const baseClasses = cn(
      "animate-pulse bg-muted",
      variantClasses[variant],
      className,
    )

    const inlineStyle: React.CSSProperties = {
      ...style,
      ...(width != null ? { width: typeof width === "number" ? `${width}px` : width } : {}),
      ...(height != null ? { height: typeof height === "number" ? `${height}px` : height } : {}),
    }

    if (variant === "text" && lines && lines > 1) {
      return (
        <div ref={ref} className="flex flex-col" style={{ gap }} role="status" aria-label="Loading">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(baseClasses, i === lines - 1 && "w-3/4")}
              style={i === lines - 1 ? { ...inlineStyle, width: "75%" } : inlineStyle}
            />
          ))}
          <span className="sr-only">Loading…</span>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={baseClasses}
        style={inlineStyle}
        {...props}
      >
        <span className="sr-only">Loading…</span>
      </div>
    )
  },
)

Skeleton.displayName = "Skeleton"
