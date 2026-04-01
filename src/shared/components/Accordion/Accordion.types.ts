import { ReactNode } from "react"

export type AccordionType = "single" | "multiple"

export type AccordionContextValue = {
  type: AccordionType
  openValues: string[]
  toggleValue: (value: string) => void
  baseId: string
}

export type AccordionProps = {
  type?: AccordionType
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: ReactNode
  className?: string
}

export type AccordionItemProps = {
  value: string
  children: ReactNode
  className?: string
}

export type AccordionTriggerProps = {
  children: ReactNode
  className?: string
}

export type AccordionContentProps = {
  children: ReactNode
  forceMount?: boolean
  className?: string
}
