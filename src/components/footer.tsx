"use client";
import type React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-lavenderDawn-background border-t border-lavenderDawn-highlightLow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-sm text-lavenderDawn-text">
            © {new Date().getFullYear()} Net Worth Display
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-lavenderDawn-text hover:text-lavenderDawn-highlightMed transition-colors"
            >
              GitHub
            </a>
            <a
              href="/privacy"
              className="text-sm text-lavenderDawn-text hover:text-lavenderDawn-highlightMed transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-sm text-lavenderDawn-text hover:text-lavenderDawn-highlightMed transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 