import { ReactElement, ReactNode } from "react"

export type Placement = "top" | "bottom" | "left" | "right"

export type TooltipProps = {
  content: ReactNode
  children: ReactElement
  placement?: Placement
  offset?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

export type Position = { top: number; left: number }
