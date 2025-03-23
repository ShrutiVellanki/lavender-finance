"use client";
import type React from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-lavenderDawn-surface dark:bg-lavenderMoon-surface border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo/Brand */}
          <div className="flex-shrink-0">
            <span className="text-xl font-semibold text-lavenderDawn-text dark:text-lavenderMoon-text">
              Net Worth
            </span>
          </div>

          {/* Right side - Navigation items and theme switcher */}
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}; 