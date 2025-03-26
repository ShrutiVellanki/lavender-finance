"use client";
import type React from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { PiggyBank, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Accounts", href: "/accounts" },
    { name: "Transactions", href: "/transactions" },
    { name: "Cash Flow", href: "/cash-flow" },
    { name: "Reports", href: "/reports" },
    { name: "Budget", href: "/budget" },
  ];

  const handleNavClick = (href: string) => {
    if (href === "/accounts") {
      window.location.href = href;
    } else {
      alert("This feature is not implemented yet!");
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-lavenderMoon-overlay/80 backdrop-blur-sm border-b border-stone-200/50 dark:border-stone-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <PiggyBank className="w-5 h-5 text-lavenderDawn-iris/90 dark:text-lavenderMoon-iris/90" />
            <span className="text-base font-semibold tracking-tight text-stone-900 dark:text-white">
              Lavender
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`text-sm font-medium tracking-tight transition-colors ${
                  pathname === item.href
                    ? "text-black dark:text-white hover:text-stone-900 dark:hover:text-stone-50"
                    : "text-stone-500 dark:text-white hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}
            <ThemeSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 focus:outline-none transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 stroke-[1.5]" />
              ) : (
                <Menu className="h-5 w-5 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium tracking-tight transition-colors ${
                    pathname === item.href
                      ? "bg-stone-100 dark:bg-stone-800 text-lavenderDawn-iris dark:text-lavenderMoon-iris"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50 hover:text-stone-900 dark:hover:text-stone-50"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="px-3 py-2">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}; 