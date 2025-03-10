import React from "react";

interface AccountBalanceProps {
  balance: number;
  balanceColor?: string;
}

const AccountBalance: React.FC<AccountBalanceProps> = ({
  balance,
  balanceColor,
}) => {
  const isNegative = balance < 0;
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(balance));

  return (
    <span
      className={`font-medium ${
        balanceColor ||
        (isNegative
          ? `text-lavenderDawn-love dark:text-lavenderMoon-love`
          : `text-lavenderDawn-pine dark:text-lavenderMoon-pine`)
      }`}
    >
      {isNegative && "-"}
      {formattedBalance}
    </span>
  );
};

export default AccountBalance;
