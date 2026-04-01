import React, { useMemo, useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type StarRatingProps = {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  max?: number
  readOnly?: boolean
  disabled?: boolean
  label?: string
  className?: string
}

export function StarRating({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  readOnly = false,
  disabled = false,
  label = "Rating",
  className,
}: StarRatingProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const selectedValue = isControlled ? value! : internalValue
  const displayValue = hoverValue ?? selectedValue

  function updateValue(next: number) {
    if (readOnly || disabled) return
    if (!isControlled) {
      setInternalValue(next)
    }
    onChange?.(next)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (readOnly || disabled) return
    let nextValue = selectedValue
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault()
        nextValue = Math.min(max, selectedValue + 1)
        updateValue(nextValue)
        break
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault()
        nextValue = Math.max(1, selectedValue - 1)
        updateValue(nextValue)
        break
      case "Home":
        e.preventDefault()
        updateValue(1)
        break
      case "End":
        e.preventDefault()
        updateValue(max)
        break
    }
  }

  const stars = useMemo(() => {
    return Array.from({ length: max }, (_, i) => i + 1)
  }, [max])

  return (
    <div className={className}>
      <div
        role="radiogroup"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex gap-1",
          disabled && "opacity-50",
        )}
      >
        {stars.map((starValue) => {
          const checked = selectedValue === starValue
          const filled = starValue <= displayValue

          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${starValue} ${starValue === 1 ? "star" : "stars"}`}
              disabled={disabled}
              onMouseEnter={() => {
                if (!readOnly && !disabled) setHoverValue(starValue)
              }}
              onMouseLeave={() => {
                if (!readOnly && !disabled) setHoverValue(null)
              }}
              onClick={() => updateValue(starValue)}
              className={cn(
                "bg-transparent border-none p-0 leading-none transition-colors",
                readOnly || disabled ? "cursor-default" : "cursor-pointer",
              )}
            >
              <Star
                className={cn(
                  "h-5 w-5 transition-colors",
                  filled
                    ? "fill-primary text-primary"
                    : "fill-transparent text-muted-foreground/40",
                )}
              />
            </button>
          )
        })}
      </div>
      <div className="mt-2 text-[12px] text-muted-foreground">
        Selected rating: {selectedValue}
      </div>
    </div>
  )
}
