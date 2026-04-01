import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Layers,
  PiggyBank,
  User,
  ChevronLeft,
  ChevronRight,
  Calculator,
  CreditCard,
  ArrowLeftRight,
  Settings,
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useTranslation } from 'react-i18next';

interface NavItem {
  nameKey: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onNavigate?: () => void;
}

const navItems: NavItem[] = [
  { nameKey: 'nav.dashboard', href: '/', icon: Home },
  { nameKey: 'nav.accounts', href: '/accounts', icon: Layers },
  { nameKey: 'nav.transactions', href: '/transactions', icon: ArrowLeftRight },
  { nameKey: 'nav.budget', href: '/budget', icon: Calculator },
  { nameKey: 'nav.cards', href: '/cards', icon: CreditCard },
];

export const Sidebar = ({ isCollapsed, onCollapsedChange, onNavigate }: SidebarProps) => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r transition-all duration-300 ease-in-out
        bg-lavenderDawn-surface dark:bg-lavenderMoon-surface
        border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightMed
        ${isCollapsed ? 'w-[60px]' : 'w-[240px]'}`}
    >
      {/* Brand */}
      <div className={`h-[56px] flex items-center shrink-0 border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightMed ${isCollapsed ? 'justify-center' : 'justify-between px-5'}`}>
        <Link to="/" className="flex items-center gap-2.5 min-w-0">
          <PiggyBank className="w-[22px] h-[22px] shrink-0 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
          {!isCollapsed && (
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-lavenderDawn-text dark:text-lavenderMoon-text truncate">
              Lavender
            </span>
          )}
        </Link>
        {!isCollapsed && (
          <button
            onClick={() => onCollapsedChange(true)}
            className="w-7 h-7 flex items-center justify-center rounded-md text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text hover:bg-lavenderDawn-highlightLow dark:hover:bg-lavenderMoon-highlightLow transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={() => onCollapsedChange(false)}
            className="absolute -right-3 top-4 w-6 h-6 flex items-center justify-center rounded-full bg-lavenderDawn-surface dark:bg-lavenderMoon-surface border border-lavenderDawn-highlightMed dark:border-lavenderMoon-highlightMed shadow-sm text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-iris dark:hover:text-lavenderMoon-iris transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100"
            style={{ opacity: undefined }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-3 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                title={isCollapsed ? t(item.nameKey) : undefined}
                onClick={onNavigate}
                className={`group flex items-center gap-3 rounded-lg transition-all duration-150
                  ${isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'}
                  ${isActive
                    ? 'bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 text-lavenderDawn-iris dark:text-lavenderMoon-iris font-medium'
                    : 'text-lavenderDawn-subtle dark:text-lavenderMoon-subtle hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text hover:bg-lavenderDawn-highlightLow/60 dark:hover:bg-lavenderMoon-highlightLow/60'
                  }`}
              >
                <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? '' : 'opacity-70 group-hover:opacity-100'} transition-opacity`} />
                {!isCollapsed && <span className="text-[13px] tracking-[-0.01em]">{t(item.nameKey)}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className={`border-t border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightMed ${isCollapsed ? 'p-2' : 'p-3'} space-y-1`}>
        <ThemeSwitcher collapsed={isCollapsed} />
        <LanguageSwitcher collapsed={isCollapsed} currentLanguage={i18n.language} onLanguageChange={(code) => i18n.changeLanguage(code)} />
        <Link
          to="/settings"
          onClick={onNavigate}
          title={isCollapsed ? t("nav.settings") : undefined}
          className={`flex items-center gap-3 rounded-lg transition-colors ${isCollapsed ? 'justify-center py-2' : 'px-3 py-2'} ${
            pathname === '/settings'
              ? 'bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10'
              : 'hover:bg-lavenderDawn-highlightLow/60 dark:hover:bg-lavenderMoon-highlightLow/60'
          }`}
        >
          <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 ${
            pathname === '/settings'
              ? 'bg-lavenderDawn-iris/20 dark:bg-lavenderMoon-iris/20 ring-1 ring-lavenderDawn-iris/30 dark:ring-lavenderMoon-iris/30'
              : 'bg-lavenderDawn-iris/15 dark:bg-lavenderMoon-iris/15'
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
              pathname === '/settings'
                ? 'text-lavenderDawn-iris dark:text-lavenderMoon-iris'
                : 'text-lavenderDawn-muted dark:text-lavenderMoon-muted'
            }`} />
          )}
        </Link>
      </div>
    </aside>
  );
};
