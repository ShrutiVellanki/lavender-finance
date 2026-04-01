import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/shared/utils"
import type { SelectProps } from "./Dropdown.types"

export function Select<T>({
  options,
  value,
  defaultValue,
  onChange,
  getOptionLabel,
  getOptionKey,
  placeholder = "Select an option",
  disabled = false,
  label,
  renderOption,
  renderValue,
  hideLabel = false,
  className,
}: SelectProps<T>) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const listboxId = useId()

  const selectedValue = isControlled ? value : internalValue

  const selectedIndex = useMemo(() => {
    if (selectedValue === undefined) return -1
    return options.findIndex((option) => option === selectedValue)
  }, [options, selectedValue])

  const selectedLabel =
    selectedIndex >= 0 ? getOptionLabel(options[selectedIndex]) : placeholder

  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }
    document.addEventListener("mousedown", handleDocumentMouseDown)
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown)
    }
  }, [])

  function openDropdown() {
    if (disabled) return
    setIsOpen(true)
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }

  function closeDropdown() {
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  function selectOption(option: T) {
    if (!isControlled) {
      setInternalValue(option)
    }
    onChange?.(option)
    closeDropdown()
    buttonRef.current?.focus()
  }

  function handleButtonClick() {
    if (disabled) return
    if (isOpen) closeDropdown()
    else openDropdown()
  }

  function handleButtonKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault()
        if (!isOpen) {
          openDropdown()
        } else {
          setHighlightedIndex((prev) => {
            if (e.key === "ArrowDown")
              return Math.min(prev + 1, options.length - 1)
            return Math.max(prev - 1, 0)
          })
        }
        break
      case "Enter":
      case " ":
        e.preventDefault()
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < options.length)
            selectOption(options[highlightedIndex])
        } else {
          openDropdown()
        }
        break
      case "Escape":
        if (isOpen) {
          e.preventDefault()
          closeDropdown()
        }
        break
      default:
        break
    }
  }

  const activeDescendant =
    isOpen && highlightedIndex >= 0
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined

  return (
    <div ref={rootRef} className={cn("relative w-[280px]", className)}>
      {label && (
        <label
          htmlFor={`${listboxId}-button`}
          className={cn(
            "block mb-1.5 text-[12px] font-medium text-lavenderDawn-muted dark:text-lavenderMoon-muted",
            hideLabel && "sr-only",
          )}
        >
          {label}
        </label>
      )}

      <button
        id={`${listboxId}-button`}
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-activedescendant={activeDescendant}
        className={cn(
          "w-full h-9 px-3 text-left text-[13px] rounded-lg",
          "border border-lavenderDawn-highlightMed/60 dark:border-lavenderMoon-highlightMed/60",
          "bg-lavenderDawn-surface dark:bg-lavenderMoon-surface",
          "text-lavenderDawn-text dark:text-lavenderMoon-text",
          "flex justify-between items-center",
          "focus:outline-none focus:ring-2 focus:ring-lavenderDawn-iris/40 dark:focus:ring-lavenderMoon-iris/40",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          !selectedValue && "text-lavenderDawn-muted dark:text-lavenderMoon-muted",
        )}
      >
        <span className="truncate">
          {renderValue && selectedIndex >= 0
            ? renderValue(options[selectedIndex])
            : selectedLabel}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-lavenderDawn-muted dark:text-lavenderMoon-muted transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 p-1 rounded-lg border border-lavenderDawn-highlightMed/60 dark:border-lavenderMoon-highlightMed/60 bg-lavenderDawn-surface dark:bg-lavenderMoon-surface shadow-md max-h-60 overflow-y-auto z-[1000]"
        >
          {options.length === 0 && (
            <li className="px-3 py-2 text-[13px] text-lavenderDawn-muted dark:text-lavenderMoon-muted">
              No options available.
            </li>
          )}
          {options.map((option, index) => {
            const isSelected = index === selectedIndex
            const isHighlighted = index === highlightedIndex
            const optionLabel = getOptionLabel(option)
            const key = getOptionKey
              ? getOptionKey(option)
              : `${optionLabel}-${index}`

            return (
              <li
                key={key}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  selectOption(option)
                }}
                className={cn(
                  "px-3 py-2 text-[13px] rounded-md cursor-pointer transition-colors",
                  isHighlighted && "bg-lavenderDawn-highlightLow dark:bg-lavenderMoon-highlightLow text-lavenderDawn-text dark:text-lavenderMoon-text",
                  isSelected && "font-semibold",
                  !isHighlighted && "text-lavenderDawn-text dark:text-lavenderMoon-text",
                )}
              >
                {renderOption
                  ? renderOption(option, { isSelected, isHighlighted })
                  : optionLabel}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
