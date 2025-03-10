"use client";

import type React from "react";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "../theme-provider";

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
  const theme = useTheme().theme;

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
    default: `border-${theme}-overlay text-${theme}-text`,
    secondary: `border-${theme}-muted text-${theme}-subtle`,
    destructive: `border-${theme}-love text-${theme}-love`,
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${variantClasses[variant]}`}>
      <button
        className={`w-full text-left p-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-${theme}-pine focus:ring-opacity-50 ${headerClassName}`}
        onClick={handleToggle}
      >
        <div className="flex-grow">{header}</div>
        {icon ? (
          <div className="flex-shrink-0 ml-2">{icon}</div>
        ) : isOpen ? (
          <ChevronUp className="w-5 h-5 flex-shrink-0 ml-2" />
        ) : (
          <ChevronDown className="w-5 h-5 flex-shrink-0 ml-2" />
        )}
      </button>
      <div
        className={`transition-max-height duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-screen" : "max-h-0"} ${contentClassName ?? ""}`}
      >
        <div className={`p-4 bg-${theme}-overlay`}>{children}</div>
      </div>
    </div>
  );
};
