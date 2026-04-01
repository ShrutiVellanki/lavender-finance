export type AutocompleteProps<T> = {
  fetchSuggestions: (query: string) => Promise<T[]>
  getOptionLabel: (option: T) => string
  onSelect: (option: T) => void
  onClear?: () => void
  placeholder?: string
  debounceMs?: number
  minQueryLength?: number
  label?: string
  className?: string
}
