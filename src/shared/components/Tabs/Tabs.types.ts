import { ReactNode } from "react"

export type TabsContextValue = {
  value: string
  setValue: (value: string) => void
  baseId: string
  orientation: "horizontal" | "vertical"
}

export type TabsProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: "horizontal" | "vertical"
  children: ReactNode
  className?: string
}

export type TabsListProps = {
  children: ReactNode
  "aria-label"?: string
  className?: string
}

export type TabsTriggerProps = {
  value: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

export type TabsPanelProps = {
  value: string
  children: ReactNode
  forceMount?: boolean
  className?: string
}
