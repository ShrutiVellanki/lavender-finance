import { ReactNode } from "react"

export type SelectProps<T> = {
  options: T[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  getOptionLabel: (option: T) => string
  getOptionKey?: (option: T) => string
  placeholder?: string
  disabled?: boolean
  label?: string
  renderOption?: (
    option: T,
    state: { isSelected: boolean; isHighlighted: boolean },
  ) => ReactNode
  className?: string
}
