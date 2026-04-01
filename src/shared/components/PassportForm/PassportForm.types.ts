export type Country = "USA" | "Canada" | "UK" | ""

export interface PassportFormProps {
  onSubmit?: () => void
  title?: string
  className?: string
}
