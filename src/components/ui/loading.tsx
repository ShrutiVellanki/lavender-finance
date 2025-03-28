"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lavenderDawn-base dark:bg-lavenderMoon-base">
      <Loader2 className="w-12 h-12 text-lavenderDawn-iris dark:text-lavenderMoon-iris animate-spin" />
      <p className="mt-4 text-lg font-medium text-lavenderDawn-text dark:text-lavenderMoon-text">
        Loading your financial data...
      </p>
    </div>
  );
} 