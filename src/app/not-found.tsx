"use client";

import { useTheme } from "@/theme-provider";
import { PiggyBank } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-lavenderDawn-base dark:bg-lavenderMoon-base">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="animate-bounce">
            <div className="relative animate-wiggle">
              <PiggyBank className="w-24 h-24 text-lavenderDawn-iris dark:text-lavenderMoon-iris" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-lavenderDawn-iris dark:bg-lavenderMoon-iris rounded-full animate-blink" />
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-3 bg-lavenderDawn-iris/20 dark:bg-lavenderMoon-iris/20 rounded-full blur-sm animate-shadow" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-lavenderDawn-text dark:text-lavenderMoon-text">
            Oops! Page Not Found
          </h1>
          <p className="text-lavenderDawn-text/70 dark:text-lavenderMoon-text/70">
            Looks like this piggy bank is empty! Let's head back home.
          </p>
        </div>

        <Link 
          href="/"
          className="inline-block px-6 py-3 text-sm font-medium text-lavenderDawn-text dark:text-lavenderMoon-text bg-lavenderDawn-iris/10 dark:bg-lavenderMoon-iris/10 hover:bg-lavenderDawn-iris/20 dark:hover:bg-lavenderMoon-iris/20 rounded-lg transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 