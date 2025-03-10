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
      className={`p-2 w-10 justify-center rounded-full bg-lavenderDawn-highlightLow hover:bg-lavenderDawn-highlightMed transition-colors`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className={`w-4 h-4 text-lavenderDawn-text`} />
      ) : (
        <Moon className={`w-4 h-4 text-lavenderDawn-text`} />
      )}
    </button>
  );
};
