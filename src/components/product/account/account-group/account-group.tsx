import type React from "react";
import { accountTypeLabels } from "@/constants/account-constants";
import {
  CreditCard,
  Banknote as Bank,
  Car,
  Coins,
  House,
  DollarSign,
} from "lucide-react";
import { Account } from "@/types";
import { AccountBalance } from "../account-balance/account-balance";

interface AccountGroupProps {
  type: string;
  accounts: Account[];
}

const getAccountGroupIcon = (type: string) => {
  const className = `w-5 h-5 text-lavenderDawn-iris/90 dark:text-lavenderMoon-iris/90 stroke-[1.5]`;
  switch (type) {
    case "credit":
      return <CreditCard className={className} />;
    case "real_estate":
      return <House className={className} />;
    case "depository":
      return <Bank className={className} />;
    case "vehicle":
      return <Car className={className} />;
    case "brokerage":
      return <Coins className={className} />;
    case "loan":
      return <DollarSign className={className} />;
  }
};

export const AccountGroup: React.FC<AccountGroupProps> = ({ type, accounts }) => {
  const totalBalance = accounts.reduce((sum, account) => sum + account.current_balance, 0);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {getAccountGroupIcon(type)}
        <span className="text-sm font-medium tracking-tight text-stone-900 dark:text-stone-50">
          {accountTypeLabels[type as keyof typeof accountTypeLabels] || type}
        </span>
      </div>
      <AccountBalance balance={totalBalance} bold={true} />
    </div>
  );
};
