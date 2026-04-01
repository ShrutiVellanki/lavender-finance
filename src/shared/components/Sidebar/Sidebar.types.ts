import type React from "react"

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  isActive?: boolean
}

export interface SidebarProps {
  brand?: React.ReactNode
  items: NavItem[]
  footer?: React.ReactNode
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  onNavigate?: (href: string) => void
  className?: string
}
