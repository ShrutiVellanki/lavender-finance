"use client";
import type React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme-provider";

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-stone-900 dark:text-stone-50" />
      ) : (
        <Moon className="w-5 h-5 text-stone-900 dark:text-stone-50" />
      )}
    </button>
  );
};
