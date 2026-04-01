export type PinInputProps = {
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  autoFocus?: boolean
  masked?: boolean
  disabled?: boolean
  className?: string
  label?: string
}
