export interface CreditCardData {
  number: string
  name: string
  expiry: string
  cvv: string
}

export interface CreditCardDisplayProps {
  data: CreditCardData
  flipped: boolean
  className?: string
}

export interface CreditCardFormProps {
  onSubmit?: (data: CreditCardData) => void
  className?: string
}

export interface CardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}
