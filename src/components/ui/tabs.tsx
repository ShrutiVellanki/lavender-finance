import React, {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  ReactNode,
  KeyboardEvent,
} from "react"
import { cn } from "@/lib/utils"

type TabsContextValue = {
  value: string
  setValue: (value: string) => void
  baseId: string
  orientation: "horizontal" | "vertical"
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) {
    throw new Error("Tabs components must be used within <Tabs>")
  }
  return ctx
}

type TabsProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: "horizontal" | "vertical"
  children: ReactNode
  className?: string
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  children,
  className,
}: TabsProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? "")
  const selectedValue = isControlled ? value! : internalValue
  const baseId = useId()

  const setValue = (next: string) => {
    if (!isControlled) {
      setInternalValue(next)
    }
    onValueChange?.(next)
  }

  const contextValue = useMemo(
    () => ({ value: selectedValue, setValue, baseId, orientation }),
    [selectedValue, baseId, orientation],
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

type TabsListProps = {
  children: ReactNode
  "aria-label"?: string
  className?: string
}

export function TabsList({
  children,
  "aria-label": ariaLabel,
  className,
}: TabsListProps) {
  const { orientation } = useTabsContext()

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-muted/50 p-1 text-muted-foreground",
        orientation === "vertical" && "flex-col",
        className,
      )}
    >
      {children}
    </div>
  )
}

type TabsTriggerProps = {
  value: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  className,
}: TabsTriggerProps) {
  const { value: activeValue, setValue, baseId, orientation } = useTabsContext()
  const selected = activeValue === value

  const tabId = `${baseId}-tab-${value}`
  const panelId = `${baseId}-panel-${value}`

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const list = e.currentTarget.parentElement
    if (!list) return

    const tabs = Array.from(
      list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'),
    )
    const currentIndex = tabs.indexOf(e.currentTarget)
    if (currentIndex === -1) return

    const isHorizontal = orientation === "horizontal"
    let nextIndex: number | null = null

    switch (e.key) {
      case "ArrowRight":
        if (isHorizontal) nextIndex = (currentIndex + 1) % tabs.length
        break
      case "ArrowLeft":
        if (isHorizontal)
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
        break
      case "ArrowDown":
        if (!isHorizontal) nextIndex = (currentIndex + 1) % tabs.length
        break
      case "ArrowUp":
        if (!isHorizontal)
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
        break
      case "Home":
        nextIndex = 0
        break
      case "End":
        nextIndex = tabs.length - 1
        break
      default:
        break
    }

    if (nextIndex !== null) {
      e.preventDefault()
      const nextTab = tabs[nextIndex]
      nextTab.focus()
      nextTab.click()
    }
  }

  return (
    <button
      id={tabId}
      role="tab"
      type="button"
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={() => setValue(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5",
        "text-[13px] font-medium ring-offset-background transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  )
}

type TabsPanelProps = {
  value: string
  children: ReactNode
  forceMount?: boolean
  className?: string
}

export function TabsPanel({
  value,
  children,
  forceMount = false,
  className,
}: TabsPanelProps) {
  const { value: activeValue, baseId } = useTabsContext()
  const selected = activeValue === value

  const tabId = `${baseId}-tab-${value}`
  const panelId = `${baseId}-panel-${value}`

  if (!selected && !forceMount) return null

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      hidden={!selected}
      tabIndex={0}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      {children}
    </div>
  )
}
