import React, { useEffect, useRef, useState, useId } from "react"
import { Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type AutocompleteProps<T> = {
  fetchSuggestions: (query: string) => Promise<T[]>
  getOptionLabel: (option: T) => string
  onSelect: (option: T) => void
  placeholder?: string
  debounceMs?: number
  minQueryLength?: number
  label?: string
  className?: string
}

export function Autocomplete<T>({
  fetchSuggestions,
  getOptionLabel,
  onSelect,
  placeholder = "Search...",
  debounceMs = 300,
  minQueryLength = 1,
  label = "Search",
  className,
}: AutocompleteProps<T>) {
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<T[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const rootRef = useRef<HTMLDivElement | null>(null)
  const requestIdRef = useRef(0)
  const listboxId = useId()

  const hasResults = options.length > 0
  const showDropdown = isOpen && (loading || hasResults || !!error)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < minQueryLength) {
      setOptions([])
      setLoading(false)
      setError("")
      setHighlightedIndex(-1)
      return
    }
    const id = ++requestIdRef.current
    setLoading(true)
    setError("")
    const t = window.setTimeout(async () => {
      try {
        const results = await fetchSuggestions(trimmed)
        if (requestIdRef.current !== id) return
        setOptions(results)
        setIsOpen(true)
        setHighlightedIndex(results.length > 0 ? 0 : -1)
      } catch {
        if (requestIdRef.current !== id) return
        setOptions([])
        setError("Could not load suggestions.")
        setHighlightedIndex(-1)
        setIsOpen(true)
      } finally {
        if (requestIdRef.current === id) setLoading(false)
      }
    }, debounceMs)
    return () => window.clearTimeout(t)
  }, [query, debounceMs, minQueryLength, fetchSuggestions])

  function selectOption(option: T) {
    setQuery(getOptionLabel(option))
    setOptions([])
    setIsOpen(false)
    setHighlightedIndex(-1)
    setError("")
    onSelect(option)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => Math.max(prev - 1, 0))
        break
      case "Enter":
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          e.preventDefault()
          selectOption(options[highlightedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const activeDescendant =
    highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined

  return (
    <div ref={rootRef} className={cn("relative w-80", className)}>
      {label && (
        <label htmlFor={`${listboxId}-input`} className="block text-[12px] font-medium text-muted-foreground mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          id={`${listboxId}-input`}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => { if (options.length > 0 || loading || error) setIsOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendant}
          className="w-full h-9 pl-8 pr-3 text-[13px] rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 ring-offset-background transition-colors"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground animate-spin" />}
      </div>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 top-full left-0 right-0 mt-1 py-1 rounded-lg border border-border bg-popover shadow-md max-h-60 overflow-y-auto"
        >
          {loading && !hasResults && (
            <li className="px-3 py-2 text-[13px] text-muted-foreground">Loading...</li>
          )}
          {!loading && error && (
            <li role="alert" className="px-3 py-2 text-[13px] text-destructive">{error}</li>
          )}
          {!loading && !error && options.length === 0 && query.trim().length >= minQueryLength && (
            <li className="px-3 py-2 text-[13px] text-muted-foreground">No results found.</li>
          )}
          {!loading && !error && options.map((option, i) => (
            <li
              key={`${getOptionLabel(option)}-${i}`}
              id={`${listboxId}-option-${i}`}
              role="option"
              aria-selected={i === highlightedIndex}
              onMouseDown={(e) => { e.preventDefault(); selectOption(option) }}
              className={cn(
                "px-3 py-2 text-[13px] cursor-pointer transition-colors",
                i === highlightedIndex
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent/50",
              )}
            >
              {getOptionLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
