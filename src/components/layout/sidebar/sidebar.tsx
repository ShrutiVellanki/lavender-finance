import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Layers,
  Search,
  Bell,
  Settings,
  Sidebar as SidebarIcon,
  LucideIcon,
  PiggyBank,
  User,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { useTheme } from '@/theme-provider';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Accounts', href: '/accounts', icon: Layers },
];

export const Sidebar = ({ isCollapsed, onCollapsedChange }: SidebarProps) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 flex flex-col bg-white dark:bg-lavenderMoon-surface border-r border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow text-lavenderDawn-text dark:text-lavenderMoon-text transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-60'}`}
    >
      <div className={`h-14 flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'} border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow`}>
        <div className={`relative group flex items-center ${isCollapsed ? 'w-10' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className={`relative flex items-center justify-center ${isCollapsed ? 'w-10 h-10' : ''}`}>
              <PiggyBank className={`w-5 h-5 text-lavenderDawn-iris dark:text-lavenderMoon-iris transition-opacity duration-200 ${isCollapsed ? 'group-hover:opacity-0' : ''}`} />
              {isCollapsed && (
                <button 
                  onClick={() => onCollapsedChange(!isCollapsed)}
                  className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 border border-transparent group-hover:border-lavenderDawn-iris/20 dark:group-hover:border-lavenderMoon-iris/20 transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
                </button>
              )}
            </div>
            {!isCollapsed && (
              <span className="text-base font-semibold tracking-tight text-lavenderDawn-text dark:text-lavenderMoon-text ml-2">
                Lavender
              </span>
            )}
          </div>
        </div>
        {!isCollapsed && (
          <button 
            onClick={() => onCollapsedChange(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 border border-transparent hover:border-lavenderDawn-iris/20 dark:hover:border-lavenderMoon-iris/20"
          >
            <ChevronLeft className="w-4 h-4 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
          </button>
        )}
      </div>

      <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-3' : 'px-2'} py-4 space-y-1`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center transition-all duration-200 ${
                isCollapsed 
                  ? 'justify-center' 
                  : 'px-3 py-2 rounded-lg hover:bg-lavenderDawn-iris/10 dark:hover:bg-lavenderMoon-iris/10'
              } ${
                isActive 
                  ? isCollapsed 
                    ? 'text-lavenderDawn-iris dark:text-lavenderMoon-iris' 
                    : 'bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 text-lavenderDawn-iris dark:text-lavenderMoon-iris rounded-lg'
                  : 'text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-iris dark:hover:text-lavenderMoon-iris'
              }`}
            >
              <div className={`flex items-center justify-center ${
                isCollapsed 
                  ? 'w-10 h-10 rounded-full border border-transparent hover:border-lavenderDawn-iris/20 dark:hover:border-lavenderMoon-iris/20' 
                  : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="text-[15px] font-medium ml-3">{item.name}</span>}
            </Link>
          );
        })}

        {/* Budgeting (Coming Soon) */}
        <div
          className={`flex items-center transition-all duration-200 cursor-not-allowed opacity-60 ${
            isCollapsed 
              ? 'justify-center' 
              : 'px-3 py-2 rounded-lg'
          } text-lavenderDawn-muted dark:text-lavenderMoon-muted`}
        >
          <div className={`flex items-center justify-center ${
            isCollapsed 
              ? 'w-10 h-10 rounded-full border border-transparent' 
              : ''
          }`}>
            <Calculator className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1">
              <span className="text-[15px] font-medium ml-3">Budgeting</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 text-lavenderDawn-iris dark:text-lavenderMoon-iris">
                Coming Soon
              </span>
            </div>
          )}
        </div>
      </nav>

      <div className={`border-t border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow ${isCollapsed ? 'p-3' : 'p-4'} space-y-2`}>
        <button 
          onClick={toggleTheme}
          className={`flex items-center transition-all duration-200 ${
            isCollapsed 
              ? 'justify-center' 
              : 'w-full px-3 py-2 rounded-lg hover:bg-lavenderDawn-iris/10 dark:hover:bg-lavenderMoon-iris/10'
          } text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-iris dark:hover:text-lavenderMoon-iris`}
        >
          <div className={`flex items-center justify-center ${
            isCollapsed 
              ? 'w-10 h-10 rounded-full border border-transparent hover:border-lavenderDawn-iris/20 dark:hover:border-lavenderMoon-iris/20' 
              : ''
          }`}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          {!isCollapsed && (
            <span className="text-[15px] font-medium ml-3">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
        
        <button className={`flex items-center transition-all duration-200 ${
          isCollapsed 
            ? 'justify-center' 
            : 'w-full px-3 py-2 rounded-lg hover:bg-lavenderDawn-iris/10 dark:hover:bg-lavenderMoon-iris/10'
        } text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-iris dark:hover:text-lavenderMoon-iris`}>
          <div className={`flex items-center justify-center ${
            isCollapsed 
              ? 'w-10 h-10 rounded-full border border-transparent hover:border-lavenderDawn-iris/20 dark:hover:border-lavenderMoon-iris/20' 
              : ''
          }`}>
            <User className="w-5 h-5" />
          </div>
          {!isCollapsed && <span className="text-[15px] font-medium ml-3">Shruti Vellanki</span>}
        </button>
      </div>
    </aside>
  );
};