export interface ErrorDisplayProps {
  message: string
  title?: string
  onRetry?: () => void
  className?: string
  fullScreen?: boolean
}
