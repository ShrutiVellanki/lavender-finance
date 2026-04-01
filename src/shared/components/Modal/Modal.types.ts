import { ReactNode } from "react"

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  descriptionId?: string
  children: ReactNode
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  className?: string
  contentClassName?: string
}
