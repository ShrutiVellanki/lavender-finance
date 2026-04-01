import React, {
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"

type Placement = "top" | "bottom" | "left" | "right"

type TooltipProps = {
  content: ReactNode
  children: ReactElement
  placement?: Placement
  offset?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

type Position = { top: number; left: number }

function getTooltipPosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: Placement,
  offset: number,
): Position {
  switch (placement) {
    case "top":
      return {
        top: triggerRect.top - tooltipRect.height - offset,
        left:
          triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      }
    case "bottom":
      return {
        top: triggerRect.bottom + offset,
        left:
          triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      }
    case "left":
      return {
        top:
          triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left - tooltipRect.width - offset,
      }
    case "right":
      return {
        top:
          triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + offset,
      }
    default:
      return { top: triggerRect.bottom + offset, left: triggerRect.left }
  }
}

function clampToViewport(position: Position, tooltipRect: DOMRect): Position {
  const padding = 8
  return {
    top: Math.max(
      padding,
      Math.min(
        position.top,
        window.innerHeight - tooltipRect.height - padding,
      ),
    ),
    left: Math.max(
      padding,
      Math.min(
        position.left,
        window.innerWidth - tooltipRect.width - padding,
      ),
    ),
  }
}

export function Tooltip({
  content,
  children,
  placement = "top",
  offset = 8,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
}: TooltipProps) {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [position, setPosition] = useState<Position | null>(null)

  const triggerRef = useRef<HTMLElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const tooltipId = useId()

  const isOpen = isControlled ? open : internalOpen

  function setOpen(nextOpen: boolean) {
    if (disabled) return
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  function updatePosition() {
    if (!triggerRef.current || !tooltipRef.current) return
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const nextPosition = getTooltipPosition(
      triggerRect,
      tooltipRect,
      placement,
      offset,
    )
    setPosition(clampToViewport(nextPosition, tooltipRect))
  }

  useLayoutEffect(() => {
    if (!isOpen) return
    updatePosition()
  }, [isOpen, content, placement, offset])

  useEffect(() => {
    if (!isOpen) return

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        triggerRef.current?.contains(target) ||
        tooltipRef.current?.contains(target)
      )
        return
      setOpen(false)
    }

    function handleWindowChange() {
      updatePosition()
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("resize", handleWindowChange)
    window.addEventListener("scroll", handleWindowChange, true)

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("resize", handleWindowChange)
      window.removeEventListener("scroll", handleWindowChange, true)
    }
  }, [isOpen])

  const childProps = (children as ReactElement<Record<string, unknown>>).props as Record<string, any>
  const child = cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node
      const originalRef = (children as any).ref
      if (typeof originalRef === "function") {
        originalRef(node)
      } else if (originalRef && typeof originalRef === "object") {
        originalRef.current = node
      }
    },
    "aria-describedby": isOpen ? tooltipId : undefined,
    onMouseEnter: (event: React.MouseEvent) => {
      childProps.onMouseEnter?.(event)
      setOpen(true)
    },
    onMouseLeave: (event: React.MouseEvent) => {
      childProps.onMouseLeave?.(event)
      setOpen(false)
    },
    onFocus: (event: React.FocusEvent) => {
      childProps.onFocus?.(event)
      setOpen(true)
    },
    onBlur: (event: React.FocusEvent) => {
      childProps.onBlur?.(event)
      setOpen(false)
    },
  })

  return (
    <>
      {child}
      {isOpen &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className="fixed z-[1000] rounded-lg bg-popover text-popover-foreground border border-border px-3 py-2 text-[12px] leading-snug max-w-[240px] shadow-md pointer-events-none"
            style={{
              top: position?.top ?? -9999,
              left: position?.left ?? -9999,
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}
