import React from "react";
import { formatCurrency } from "@/lib/utils";

interface AccountBalanceProps {
  balance: number;
  bold?: boolean;
}

export const AccountBalance: React.FC<AccountBalanceProps> = ({ balance, bold = false }) => {
  const formattedBalance = formatCurrency(balance);
  const isNegative = balance < 0;

  return (
    <span
      className={`text-base tracking-tight ${
        bold ? "font-semibold" : "font-medium"
      } ${isNegative ? "text-rose-600 dark:text-rose-400" : "text-lavenderDawn-iris dark:text-lavenderMoon-iris"}`}
    >
      {formattedBalance}
    </span>
  );
};
