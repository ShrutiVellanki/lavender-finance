"use client";

import type React from "react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useModal } from "./modal-context";

interface ModalShellProps {
  title: string;
  children: React.ReactNode;
}

export const ModalShell: React.FC<ModalShellProps> = ({ title, children }) => {
  const { closeModal } = useModal();

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeModal]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl border border-lavenderDawn-overlay dark:border-lavenderMoon-overlay bg-lavenderDawn-base dark:bg-lavenderMoon-base shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-lavenderDawn-highlightLow dark:border-lavenderMoon-highlightLow">
          <h2 className="text-base font-semibold text-lavenderDawn-text dark:text-lavenderMoon-text">
            {title}
          </h2>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full text-lavenderDawn-muted dark:text-lavenderMoon-muted hover:text-lavenderDawn-text dark:hover:text-lavenderMoon-text hover:bg-lavenderDawn-overlay dark:hover:bg-lavenderMoon-overlay transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
