import { accountTypes } from "@/utils/utils";
import {
  CreditCard,
  Banknote as Bank,
  Car,
  Coins,
  House,
  DollarSign,
} from "lucide-react";
import React from "react";

interface AccountGroupProps {
  type: string;
}

const getAccountGroupIcon = (type: string) => {
  const className = `w-6 h-6 text-lavenderDawn-iris dark:text-lavenderMoon-iris`;
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

export const AccountGroup: React.FC<AccountGroupProps> = ({ type }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg font-semibold">{type}</span>
    </div>
  );
};
