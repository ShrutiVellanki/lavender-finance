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
      className={`text-sm tracking-tight ${
        bold ? "font-semibold" : "font-normal"
      } ${isNegative ? "text-rose-600 dark:text-rose-400" : "text-stone-900 dark:text-stone-50"}`}
    >
      {formattedBalance}
    </span>
  );
};
