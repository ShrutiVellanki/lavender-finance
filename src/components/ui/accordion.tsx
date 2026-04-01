import React, {
  createContext,
  ReactNode,
  useContext,
  useId,
  useMemo,
  useState,
  KeyboardEvent,
} from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

type AccordionType = "single" | "multiple"

type AccordionContextValue = {
  type: AccordionType
  openValues: string[]
  toggleValue: (value: string) => void
  baseId: string
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordionContext() {
  const ctx = useContext(AccordionContext)
  if (!ctx) {
    throw new Error("Accordion components must be used within <Accordion>")
  }
  return ctx
}

type AccordionProps = {
  type?: AccordionType
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: ReactNode
  className?: string
}

export function Accordion({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: AccordionProps) {
  const isControlled = value !== undefined
  const baseId = useId()

  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue ?? (type === "single" ? "" : []),
  )

  const openValues = useMemo(() => {
    const rawValue = isControlled ? value : internalValue
    if (type === "single") {
      return rawValue && typeof rawValue === "string" ? [rawValue] : []
    }
    return Array.isArray(rawValue) ? rawValue : []
  }, [isControlled, value, internalValue, type])

  const setNextValue = (next: string | string[]) => {
    if (!isControlled) {
      setInternalValue(next)
    }
    onValueChange?.(next)
  }

  const toggleValue = (itemValue: string) => {
    if (type === "single") {
      const currentlyOpen = openValues[0]
      const next = currentlyOpen === itemValue ? "" : itemValue
      setNextValue(next)
      return
    }

    const nextSet = new Set(openValues)
    if (nextSet.has(itemValue)) {
      nextSet.delete(itemValue)
    } else {
      nextSet.add(itemValue)
    }
    setNextValue(Array.from(nextSet))
  }

  const contextValue = useMemo(
    () => ({ type, openValues, toggleValue, baseId }),
    [type, openValues, baseId],
  )

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={className} data-accordion-root>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

type AccordionItemProps = {
  value: string
  children: ReactNode
  className?: string
}

const AccordionItemContext = createContext<{
  value: string
  isOpen: boolean
} | null>(null)

function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext)
  if (!ctx) {
    throw new Error(
      "Accordion item components must be used within <AccordionItem>",
    )
  }
  return ctx
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  const { openValues } = useAccordionContext()
  const isOpen = openValues.includes(value)

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={cn("border-b border-border", className)}>{children}</div>
    </AccordionItemContext.Provider>
  )
}

type AccordionTriggerProps = {
  children: ReactNode
  className?: string
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const { toggleValue, baseId } = useAccordionContext()
  const { value, isOpen } = useAccordionItemContext()

  const triggerId = `${baseId}-trigger-${value}`
  const contentId = `${baseId}-content-${value}`

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const root = e.currentTarget.closest("[data-accordion-root]")
    if (!root) return

    const triggers = Array.from(
      root.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]"),
    )
    const currentIndex = triggers.indexOf(e.currentTarget)
    if (currentIndex === -1) return

    let nextIndex: number | null = null

    switch (e.key) {
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % triggers.length
        break
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length
        break
      case "Home":
        nextIndex = 0
        break
      case "End":
        nextIndex = triggers.length - 1
        break
      default:
        break
    }

    if (nextIndex !== null) {
      e.preventDefault()
      triggers[nextIndex].focus()
    }
  }

  return (
    <h3 className="m-0">
      <button
        id={triggerId}
        data-accordion-trigger
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => toggleValue(value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full text-left py-3 px-4 bg-transparent border-none cursor-pointer text-[13px] font-semibold tracking-[-0.01em]",
          "flex justify-between items-center text-foreground hover:bg-accent/50 transition-colors rounded-lg",
          className,
        )}
      >
        <span>{children}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
    </h3>
  )
}

type AccordionContentProps = {
  children: ReactNode
  forceMount?: boolean
  className?: string
}

export function AccordionContent({
  children,
  forceMount = false,
  className,
}: AccordionContentProps) {
  const { baseId } = useAccordionContext()
  const { value, isOpen } = useAccordionItemContext()

  const triggerId = `${baseId}-trigger-${value}`
  const contentId = `${baseId}-content-${value}`

  if (!isOpen && !forceMount) return null

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      hidden={!isOpen}
      className={cn("px-4 pb-4 text-foreground text-[13px]", className)}
    >
      {children}
    </div>
  )
}
