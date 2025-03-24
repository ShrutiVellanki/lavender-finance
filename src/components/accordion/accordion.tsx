"use client";

import type React from "react";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * Props for the Accordion component.
 */
interface AccordionProps {
  /** The content to be displayed in the accordion header. */
  header: React.ReactNode;
  /** The content to be displayed inside the accordion when it is expanded. */
  children: React.ReactNode;
  /** An optional icon to be displayed in the accordion header. */
  icon?: React.ReactNode;
  /** A boolean to control the open/close state of the accordion. If provided, the component operates in controlled mode. */
  isOpen?: boolean;
  /** A callback function to be called when the accordion is toggled. */
  onToggle?: () => void;
  /** The variant of the accordion, which determines its styling. Default is "default". */
  variant?: "default" | "secondary" | "destructive";
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
  icon,
  isOpen: controlledIsOpen,
  onToggle,
  variant = "default",
  headerClassName,
  contentClassName,
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setUncontrolledIsOpen(!uncontrolledIsOpen);
    }
  };

  const variantClasses = {
    default: `border-lavenderDawn-overlay text-lavenderDawn-text dark:border-lavenderMoon-overlay dark:text-lavenderMoon-text`,
    secondary: `border-lavenderDawn-muted text-lavenderDawn-subtle dark:border-lavenderMoon-muted dark:text-lavenderMoon-subtle`,
    destructive: `border-lavenderDawn-love text-lavenderDawn-love dark:border-lavenderMoon-love dark:text-lavenderMoon-love`,
  };

  return (
    <div
      className={`border rounded-xl overflow-hidden bg-lavenderDawn-overlay/50 dark:bg-lavenderMoon-overlay/50 backdrop-blur-sm ${variantClasses[variant]}`}
    >
      <button
        className={`w-full text-left p-4 flex justify-between items-center focus:outline-none ring-1 ring-lavenderDawn-pine/20 focus:ring-opacity-50 transition-all duration-200 ${headerClassName}`}
        onClick={handleToggle}
      >
        <div className="flex-grow">{header}</div>
        {icon ? (
          <div className="flex-shrink-0 ml-2">{icon}</div>
        ) : isOpen ? (
          <ChevronUp className="w-5 h-5 flex-shrink-0 ml-2 text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50" />
        ) : (
          <ChevronDown className="w-5 h-5 flex-shrink-0 ml-2 text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50" />
        )}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } ${contentClassName ?? ""}`}
      >
        <div className={`p-4 bg-lavenderDawn-overlay/30 dark:bg-lavenderMoon-overlay/30`}>
          {children}
        </div>
      </div>
    </div>
  );
};
