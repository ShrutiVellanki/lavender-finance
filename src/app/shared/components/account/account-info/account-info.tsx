import { cn } from "@/lib/utils"
import type React from "react"

export interface AccountInfoProps {
  name: string
  logo: React.ReactNode
  balance: number
  description?: string
  className?: string
  balanceColor?: string
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
  name,
  logo,
  balance,
  description,
  balanceColor,
}) => {
  // const theme = "lavenderDawn";
  const isNegative = balance < 0
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(balance))

  return (
    <div className={`w-full flex items-center justify-between p-4`}>
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-lavenderDawn-overlay`}>{logo}</div>
        <div className="flex flex-col items-start">
          <span className={`font-medium text-lavenderDawn-text`}>{name}</span>
          {description && <span className={`text-sm text-lavenderDawn-muted`}>{description}</span>}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={cn("font-medium", balanceColor || (isNegative ? `text-lavenderDawn-love` : `text-lavenderDawn-pine`))}>
          {isNegative && "-"}
          {formattedBalance}
        </span>
      </div>
    </div>
  )
}

