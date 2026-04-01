import type React from "react"

export type ComboboxProps<T> = {
  options: T[]
  value?: T | null
  defaultValue?: T | null
  onChange?: (value: T | null) => void
  getOptionLabel: (option: T) => string
  renderOption?: (option: T, state: { isHighlighted: boolean; isSelected: boolean }) => React.ReactNode
  placeholder?: string
  disabled?: boolean
  className?: string
}
