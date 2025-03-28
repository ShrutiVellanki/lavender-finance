import React from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorProps {
  message: string;
  onRetry: () => void;
}

export function Error({ message, onRetry }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lavenderDawn-base dark:bg-lavenderMoon-base">
      <div className="p-8 rounded-xl bg-lavenderDawn-surface dark:bg-lavenderMoon-surface border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 rounded-full bg-rose-500/10 dark:bg-rose-400/10">
            <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-lavenderDawn-text dark:text-lavenderMoon-text text-center mb-2">
          Something went wrong
        </h2>
        <p className="text-lavenderDawn-text/70 dark:text-lavenderMoon-text/70 text-center mb-6">
          {message}
        </p>
        <button
          onClick={onRetry}
          className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-lavenderDawn-iris dark:bg-lavenderMoon-iris text-white hover:bg-lavenderDawn-iris/90 dark:hover:bg-lavenderMoon-iris/90 transition-colors"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Try again
        </button>
      </div>
    </div>
  );
} 