import React from "react"

export type ButtonVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
export type ButtonSize = "sm" | "default" | "lg" | "icon"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}
