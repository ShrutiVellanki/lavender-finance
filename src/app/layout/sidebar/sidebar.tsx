import React from "react"
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
} from "lucide-react"
import { Sidebar as SidebarUI } from "@/shared/components/Sidebar"
import { ThemeSwitcher } from "@/shared/components/ThemeSwitcher"
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher"
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

export const AppSidebar = ({ isCollapsed, onCollapsedChange, onNavigate, isMobile }: AppSidebarProps) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

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

  const settingsLink = (
    <Link
      to="/settings"
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-lg transition-colors ${isCollapsed ? "justify-center py-2" : "px-3 py-2"} ${
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
      {!isCollapsed && (
        <Settings className={`w-3.5 h-3.5 shrink-0 ${
          pathname === "/settings"
            ? "text-lavenderDawn-iris dark:text-lavenderMoon-iris"
            : "text-lavenderDawn-muted dark:text-lavenderMoon-muted"
        }`} />
      )}
    </Link>
  )

  const footer = (
    <div className="space-y-1">
      {isCollapsed ? (
        <>
          <Tooltip content={t("nav.theme")} placement="right">
            <div><ThemeSwitcher collapsed /></div>
          </Tooltip>
          <Tooltip content={t("nav.language")} placement="right">
            <div><LanguageSwitcher collapsed currentLanguage={i18n.language} onLanguageChange={(code) => i18n.changeLanguage(code)} /></div>
          </Tooltip>
          <Tooltip content={t("nav.settings")} placement="right">
            {settingsLink}
          </Tooltip>
        </>
      ) : (
        <>
          <ThemeSwitcher collapsed={false} />
          <LanguageSwitcher collapsed={false} currentLanguage={i18n.language} onLanguageChange={(code) => i18n.changeLanguage(code)} />
          {settingsLink}
        </>
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
