"use client";

import React from "react";

export const Loading: React.FC = () => {
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-lavenderDawn-base dark:bg-lavenderMoon-base">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-lavenderDawn-iris/20 dark:border-lavenderMoon-iris/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-lavenderDawn-iris dark:border-lavenderMoon-iris border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-lavenderDawn-text dark:text-lavenderMoon-text text-lg font-medium animate-pulse">Loading your net worth data...</p>
      </div>
    </div>
  );
}; 