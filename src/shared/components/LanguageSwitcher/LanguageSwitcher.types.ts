export interface LanguageSwitcherProps {
  collapsed?: boolean
  className?: string
  currentLanguage?: string
  onLanguageChange?: (code: string) => void
}
