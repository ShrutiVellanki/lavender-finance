import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export const Error: React.FC<ErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lavenderDawn-base dark:bg-lavenderMoon-base">
      <div className="flex flex-col items-center space-y-6 p-8 rounded-xl bg-lavenderDawn-overlay dark:bg-lavenderMoon-overlay border border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow shadow-lg max-w-md w-full mx-4">
        <div className="relative">
          <div className="w-16 h-16 bg-lavenderDawn-love/10 dark:bg-lavenderMoon-love/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-lavenderDawn-love dark:text-lavenderMoon-love animate-bounce" />
          </div>
        </div>
        <p className="text-lavenderDawn-text dark:text-lavenderMoon-text text-lg font-medium text-center">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-lavenderDawn-iris dark:bg-lavenderMoon-iris text-white rounded-lg hover:bg-lavenderDawn-iris/90 dark:hover:bg-lavenderMoon-iris/90 transition-all transform hover:scale-105 active:scale-95 font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}; 