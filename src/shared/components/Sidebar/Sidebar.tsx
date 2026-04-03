import React from "react"
import { ChevronLeft, ChevronRight, PiggyBank } from "lucide-react"
import { cn } from "@/shared/utils"
import { Tooltip } from "@/shared/components/Tooltip"
import type { SidebarProps } from "./Sidebar.types"

export const Sidebar: React.FC<SidebarProps> = ({
  brand,
  items,
  footer,
  collapsed = false,
  onCollapsedChange,
  onNavigate,
  className,
}) => {
  return (
    <aside
      className={cn(
        "group/sidebar flex flex-col border-r transition-all duration-300 ease-in-out h-full",
        "bg-lavenderDawn-surface dark:bg-lavenderMoon-surface border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightMed",
        collapsed ? "w-[60px]" : "w-[240px]",
        className,
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "h-14 flex items-center shrink-0 border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightMed",
          collapsed ? "justify-center" : "justify-between px-5",
        )}
      >
        {brand ?? (
          <div className="flex items-center gap-2.5 min-w-0">
            <PiggyBank className="w-[22px] h-[22px] shrink-0 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
            {!collapsed && (
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text truncate">
                Lavender Finance
              </span>
            )}
          </div>
        )}
        {onCollapsedChange && !collapsed && (
          <button
            onClick={() => onCollapsedChange(true)}
            aria-label="Collapse sidebar"
            className="w-7 h-7 flex items-center justify-center rounded-md text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text hover:bg-lavenderDawn-highlightLow dark:hover:bg-lavenderMoon-highlightLow transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {onCollapsedChange && collapsed && (
          <button
            onClick={() => onCollapsedChange(false)}
            aria-label="Expand sidebar"
            className="absolute -right-3 top-4 w-6 h-6 flex items-center justify-center rounded-full bg-lavenderDawn-surface dark:bg-lavenderMoon-surface border border-lavenderDawn-highlightMed dark:border-lavenderMoon-highlightMed shadow-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-iris dark:hover:text-lavenderMoon-iris transition-all duration-200 opacity-0 group-hover/sidebar:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto py-3", collapsed ? "px-2" : "px-3")}>
        <div className="space-y-0.5">
          {items.map((item) => {
            const btn = (
              <button
                key={item.href}
                type="button"
                onClick={() => onNavigate?.(item.href)}
                aria-current={item.isActive ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                className={cn(
                  "group w-full flex items-center gap-3 rounded-lg transition-all duration-150",
                  collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2",
                  item.isActive
                    ? "bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 text-lavenderDawn-iris dark:text-lavenderMoon-iris font-medium"
                    : "text-lavenderDawn-subtle dark:text-lavenderMoon-subtle hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text hover:bg-lavenderDawn-highlightLow/60 dark:hover:bg-lavenderMoon-highlightLow/60",
                )}
              >
                {item.icon && (
                  <span className={cn("w-[18px] h-[18px] shrink-0 [&>svg]:w-full [&>svg]:h-full", !item.isActive && "opacity-70 group-hover:opacity-100 transition-opacity")}>
                    {item.icon}
                  </span>
                )}
                {!collapsed && <span className="text-[13px] tracking-[-0.01em]">{item.label}</span>}
              </button>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href} content={item.label} placement="right">
                  {btn}
                </Tooltip>
              )
            }
            return <React.Fragment key={item.href}>{btn}</React.Fragment>
          })}
        </div>
      </nav>

      {/* Footer */}
      {footer && (
        <div className={cn("border-t border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightMed", collapsed ? "p-2" : "p-3")}>
          {footer}
        </div>
      )}
    </aside>
  )
}
