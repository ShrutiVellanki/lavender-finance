import React, { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Home,
  Layers,
  User,
  Calculator,
  CreditCard,
  ArrowLeftRight,
  Settings,
  PiggyBank,
  Sun,
  Moon,
  ExternalLink,
} from "lucide-react"
import { Sidebar as SidebarUI } from "@/shared/components/Sidebar"
import { useTheme } from "@/shared/components/ThemeProvider"
import { Tooltip } from "@/shared/components/Tooltip"
import { useTranslation } from "react-i18next"
import type { NavItem } from "@/shared/components/Sidebar"

interface AppSidebarProps {
  isCollapsed: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  onNavigate?: () => void
  isMobile?: boolean
}

const NAV_ITEMS: { nameKey: string; href: string; icon: React.ElementType }[] = [
  { nameKey: "nav.dashboard", href: "/", icon: Home },
  { nameKey: "nav.accounts", href: "/accounts", icon: Layers },
  { nameKey: "nav.transactions", href: "/transactions", icon: ArrowLeftRight },
  { nameKey: "nav.budget", href: "/budget", icon: Calculator },
  { nameKey: "nav.cards", href: "/cards", icon: CreditCard },
]

const GH_ICON = (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const popoverItemCls = "flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-[13px] text-lavenderDawn-text dark:text-lavenderMoon-text hover:bg-lavenderDawn-highlightLow/60 dark:hover:bg-lavenderMoon-highlightLow/60 transition-colors"

export const AppSidebar = ({ isCollapsed, onCollapsedChange, onNavigate, isMobile }: AppSidebarProps) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  const [popoverOpen, setPopoverOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current) }
  }, [])

  function handleMouseEnter() {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setPopoverOpen(true)
  }

  function handleMouseLeave() {
    hoverTimeoutRef.current = setTimeout(() => setPopoverOpen(false), 200)
  }

  const items: NavItem[] = NAV_ITEMS.map((item) => ({
    label: t(item.nameKey),
    href: item.href,
    icon: <item.icon />,
    isActive: pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)),
  }))

  const brand = (
    <Link to="/" className="flex items-center gap-2.5 min-w-0">
      <PiggyBank className="w-[22px] h-[22px] shrink-0 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
      {!isCollapsed && (
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text truncate">
          Lavender
        </span>
      )}
    </Link>
  )

  const userButton = (
    <div
      ref={popoverRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`flex items-center gap-3 rounded-lg transition-colors cursor-pointer ${isCollapsed ? "justify-center py-2" : "px-3 py-2"} ${
          pathname === "/settings"
            ? "bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10"
            : "hover:bg-lavenderDawn-highlightLow/60 dark:hover:bg-lavenderMoon-highlightLow/60"
        }`}
      >
        <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 ${
          pathname === "/settings"
            ? "bg-lavenderDawn-iris/20 dark:bg-lavenderMoon-iris/20 ring-1 ring-lavenderDawn-iris/30 dark:ring-lavenderMoon-iris/30"
            : "bg-lavenderDawn-iris/15 dark:bg-lavenderMoon-iris/15"
        }`}>
          <User className="w-3.5 h-3.5 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-lavenderDawn-text dark:text-lavenderMoon-text truncate tracking-[-0.01em]">Shruti Vellanki</p>
            <p className="text-[11px] text-lavenderDawn-muted dark:text-lavenderMoon-muted truncate">{t("common.personal")}</p>
          </div>
        )}
      </div>

      {popoverOpen && (
        <div
          className="absolute z-50 bottom-0 left-full ml-2 bg-lavenderDawn-surface dark:bg-lavenderMoon-surface border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow rounded-lg shadow-lg p-1.5 min-w-[180px]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to="/settings"
            onClick={() => { setPopoverOpen(false); onNavigate?.() }}
            className={popoverItemCls}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>{t("nav.settings")}</span>
          </Link>

          <div className="my-1 border-t border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow" />

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={popoverItemCls}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            <span>{theme === "dark" ? t("settings.themeLight") : t("settings.themeDark")}</span>
          </button>

          <div className="my-1 border-t border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow" />

          <a
            href="https://github.com/ShrutiVellanki/lavender-finance"
            target="_blank"
            rel="noopener noreferrer"
            className={popoverItemCls}
          >
            {GH_ICON}
            <span className="flex-1 truncate">lavender-finance</span>
            <ExternalLink className="w-3 h-3 opacity-40 shrink-0" />
          </a>
          <a
            href="https://github.com/ShrutiVellanki/lavendar-storybook"
            target="_blank"
            rel="noopener noreferrer"
            className={popoverItemCls}
          >
            {GH_ICON}
            <span className="flex-1 truncate">lavendar-storybook</span>
            <ExternalLink className="w-3 h-3 opacity-40 shrink-0" />
          </a>
        </div>
      )}
    </div>
  )

  const footer = (
    <div className="space-y-1">
      {isCollapsed && !isMobile ? (
        <Tooltip content={t("nav.settings")} placement="right">
          {userButton}
        </Tooltip>
      ) : (
        userButton
      )}
    </div>
  )

  return (
    <SidebarUI
      brand={brand}
      items={items}
      footer={footer}
      collapsed={isCollapsed}
      onCollapsedChange={isMobile ? undefined : onCollapsedChange}
      onNavigate={(href) => {
        navigate(href)
        onNavigate?.()
      }}
    />
  )
}
