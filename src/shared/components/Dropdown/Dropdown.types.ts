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
  /** Visually hide the label (still accessible via aria-label) */
  hideLabel?: boolean
  renderOption?: (
    option: T,
    state: { isSelected: boolean; isHighlighted: boolean },
  ) => ReactNode
  renderValue?: (option: T) => ReactNode
  className?: string
}
