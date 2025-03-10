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
  type:
    | "credit_card"
    | "bank"
    | "depository"
    | "vehicle"
    | "investment"
    | "other";
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

const AccountGroup: React.FC<AccountGroupProps> = ({ type }) => {
  return (
    <div className="flex gap-4">
      {getAccountGroupIcon(type)}
      <div>{accountTypes[type]}</div>
    </div>
  );
};

export default AccountGroup;
