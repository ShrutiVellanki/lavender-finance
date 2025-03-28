"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Props for the Accordion component.
 */
interface AccordionProps {
  /** The content to be displayed in the accordion header. */
  header: React.ReactNode;
  /** The content to be displayed inside the accordion when it is expanded. */
  children: React.ReactNode;
  /** The variant of the accordion, which determines its styling. Default is "default". */
  variant?: 'default' | 'secondary' | 'destructive';
  /** Additional class names for the header. */
  headerClassName?: string;
  /** Additional class names for the content. */
  contentClassName?: string;
}

/**
 * Accordion component to display collapsible content sections.
 *
 * @param {AccordionProps} props - The props for the Accordion component.
 * @returns {JSX.Element} The rendered Accordion component.
 */
export const Accordion: React.FC<AccordionProps> = ({
  header,
  children,
  variant = 'default',
  headerClassName,
  contentClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const variantClasses = {
    default: 'border-lavenderDawn-overlay text-lavenderDawn-text dark:border-lavenderMoon-overlay dark:text-lavenderMoon-text',
    secondary: 'border-lavenderDawn-muted text-lavenderDawn-subtle dark:border-lavenderMoon-muted dark:text-lavenderMoon-subtle',
    destructive: 'border-lavenderDawn-love text-lavenderDawn-love dark:border-lavenderMoon-love dark:text-lavenderMoon-love',
  };

  return (
    <div className={`border rounded-xl overflow-hidden bg-lavenderDawn-overlay/50 dark:bg-[#636363]/50 backdrop-blur-sm ${variantClasses[variant]}`}>
      <div className={`flex justify-between items-center p-4 ${headerClassName}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 flex items-center justify-center transition-all duration-200 border border-transparent hover:border-lavenderDawn-iris/20 dark:hover:border-lavenderMoon-iris/20 rounded-full text-lavenderDawn-iris dark:text-lavenderMoon-iris mr-3"
        >
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <div className="flex-grow pointer-events-none">{header}</div>
      </div>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`p-4 bg-lavenderDawn-overlay/30 dark:bg-lavenderMoon-overlay/30 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
