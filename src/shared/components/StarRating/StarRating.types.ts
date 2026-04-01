export type StarRatingProps = {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  max?: number
  readOnly?: boolean
  disabled?: boolean
  label?: string
  className?: string
}
