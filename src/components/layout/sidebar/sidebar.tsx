import React, { useState } from 'react';
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
  Moon
} from 'lucide-react';
import { useTheme } from '@/theme-provider';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Accounts', href: '/accounts', icon: Layers },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 flex flex-col bg-white dark:bg-lavenderMoon-surface border-r border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow text-lavenderDawn-text dark:text-lavenderMoon-text transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-60'}`}
      onMouseEnter={() => isCollapsed && setIsCollapsed(false)}
    >
      {/* Top section with logo and collapse button */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow">
        <div className={`flex items-center space-x-2 hover:opacity-80 transition-opacity ${isCollapsed ? 'w-full justify-center' : ''}`}>
          <PiggyBank className="w-5 h-5 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
          {!isCollapsed && (
            <span className="text-base font-semibold tracking-tight text-lavenderDawn-text dark:text-lavenderMoon-text">
              Lavender
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="hover:bg-lavenderDawn-highlightLow dark:hover:bg-lavenderMoon-highlightLow p-2 rounded-lg transition-colors"
          >
            <SidebarIcon className="w-5 h-5 text-lavenderDawn-muted dark:text-lavenderMoon-muted" />
          </button>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 text-lavenderDawn-iris dark:text-lavenderMoon-iris' 
                  : 'text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:bg-lavenderDawn-highlightLow dark:hover:bg-lavenderMoon-highlightLow hover:text-lavenderDawn-iris dark:hover:text-lavenderMoon-iris'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span className="text-[15px] font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 space-y-2 border-t border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:bg-lavenderDawn-highlightLow dark:hover:bg-lavenderMoon-highlightLow hover:text-lavenderDawn-iris dark:hover:text-lavenderMoon-iris ${isCollapsed ? 'justify-center' : 'w-full'}`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          {!isCollapsed && (
            <span className="text-[15px] font-medium">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
        
        {/* User Profile */}
        <button className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:bg-lavenderDawn-highlightLow dark:hover:bg-lavenderMoon-highlightLow hover:text-lavenderDawn-iris dark:hover:text-lavenderMoon-iris ${isCollapsed ? 'justify-center' : 'w-full'}`}>
          <User className="w-5 h-5" />
          {!isCollapsed && <span className="text-[15px] font-medium">Shruti Vellanki</span>}
        </button>
      </div>
    </aside>
  );
}; 