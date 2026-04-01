import React, { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type ComboboxProps<T> = {
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

export function Combobox<T>({
  options,
  value,
  defaultValue = null,
  onChange,
  getOptionLabel,
  renderOption,
  placeholder = "Select an option",
  disabled = false,
  className,
}: ComboboxProps<T>) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<T | null>(defaultValue)
  const selectedValue = isControlled ? value! : internalValue

  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = "combobox-listbox"

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => getOptionLabel(o).toLowerCase().includes(q))
  }, [options, query, getOptionLabel])

  useEffect(() => {
    if (highlightedIndex >= filteredOptions.length) setHighlightedIndex(0)
  }, [filteredOptions.length, highlightedIndex])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) { setIsOpen(false); setQuery("") }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function updateValue(next: T | null) {
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
  }

  function selectOption(option: T) {
    updateValue(option)
    setQuery("")
    setIsOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (disabled) return
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        if (!isOpen) { setIsOpen(true); return }
        setHighlightedIndex((p) => Math.min(p + 1, filteredOptions.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        if (!isOpen) { setIsOpen(true); return }
        setHighlightedIndex((p) => Math.max(p - 1, 0))
        break
      case "Enter":
        e.preventDefault()
        if (!isOpen) { setIsOpen(true); return }
        if (filteredOptions[highlightedIndex]) selectOption(filteredOptions[highlightedIndex])
        break
      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        setQuery("")
        break
    }
  }

  const displayValue = isOpen ? query : selectedValue ? getOptionLabel(selectedValue) : ""

  return (
    <div ref={rootRef} className={cn("relative w-[280px]", className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={isOpen && filteredOptions[highlightedIndex] ? `option-${highlightedIndex}` : undefined}
          disabled={disabled}
          value={displayValue}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setHighlightedIndex(0) }}
          onKeyDown={handleKeyDown}
          className="w-full h-9 pl-3 pr-8 text-[13px] rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <ChevronDown className={cn("absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-md max-h-[220px] overflow-y-auto">
          <ul id={listboxId} role="listbox" className="p-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-[13px] text-muted-foreground">No results</li>
            ) : (
              filteredOptions.map((option, i) => {
                const isHighlighted = i === highlightedIndex
                const isSelected = selectedValue === option
                return (
                  <li
                    key={i}
                    id={`option-${i}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectOption(option)}
                    className={cn(
                      "px-3 py-2 rounded-md text-[13px] cursor-pointer transition-colors",
                      isHighlighted ? "bg-accent text-accent-foreground" : "text-foreground",
                      isSelected && "font-semibold",
                    )}
                  >
                    {renderOption ? renderOption(option, { isHighlighted, isSelected }) : getOptionLabel(option)}
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
