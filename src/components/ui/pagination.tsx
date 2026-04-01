import React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  siblingCount?: number
}

function buildRange(start: number, end: number): number[] {
  const result: number[] = []
  for (let i = start; i <= end; i++) result.push(i)
  return result
}

function getPageNumbers(current: number, total: number, siblings: number): (number | "ellipsis")[] {
  const totalSlots = siblings * 2 + 5 // siblings + boundaries + current + 2 ellipses

  if (total <= totalSlots) return buildRange(1, total)

  const leftSibling = Math.max(current - siblings, 1)
  const rightSibling = Math.min(current + siblings, total)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < total - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = siblings * 2 + 3
    return [...buildRange(1, leftCount), "ellipsis", total]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = siblings * 2 + 3
    return [1, "ellipsis", ...buildRange(total - rightCount + 1, total)]
  }

  return [1, "ellipsis", ...buildRange(leftSibling, rightSibling), "ellipsis", total]
}

const btnBase = cn(
  "inline-flex items-center justify-center rounded-lg text-[13px] font-medium transition-all duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background",
)

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages, siblingCount)

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className={cn(
          btnBase,
          "w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-accent",
          "disabled:opacity-30 disabled:pointer-events-none",
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span key={`e${i}`} className="w-8 h-8 inline-flex items-center justify-center text-muted-foreground text-[13px] select-none">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              btnBase,
              "min-w-[32px] h-8 px-2",
              page === currentPage
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className={cn(
          btnBase,
          "w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-accent",
          "disabled:opacity-30 disabled:pointer-events-none",
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
