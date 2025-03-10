import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * Props for the Card component.
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional class names for the card. */
  className?: string;
  /** The content to be displayed inside the card. */
  children: React.ReactNode;
}

/**
 * Card component to display content in a card layout.
 *
 * @param {CardProps} props - The props for the Card component.
 * @returns {JSX.Element} The rendered Card component.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

/**
 * Props for the CardHeader component.
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional class names for the card header. */
  className?: string;
  /** The content to be displayed inside the card header. */
  children: React.ReactNode;
}

/**
 * CardHeader component to display the header of the card.
 *
 * @param {CardHeaderProps} props - The props for the CardHeader component.
 * @returns {JSX.Element} The rendered CardHeader component.
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

/**
 * Props for the CardContent component.
 */
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional class names for the card content. */
  className?: string;
  /** The content to be displayed inside the card content. */
  children: React.ReactNode;
}

/**
 * CardContent component to display the content of the card.
 *
 * @param {CardContentProps} props - The props for the CardContent component.
 * @returns {JSX.Element} The rendered CardContent component.
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";


export { Card, CardHeader, CardContent };