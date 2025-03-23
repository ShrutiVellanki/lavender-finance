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
      className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-lavenderDawn-highlightLow hover:bg-lavenderDawn-highlightMed transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lavenderDawn-highlightMed"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-lavenderDawn-text" />
      ) : (
        <Moon className="w-5 h-5 text-lavenderDawn-text" />
      )}
    </button>
  );
};
