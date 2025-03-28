import type React from "react";
import { AccountBalance } from "../account-balance/account-balance";
import { accountSubtypeLabels } from "@/constants/account-constants";
import Link from "next/link";

export interface AccountInfoProps {
  name: string;
  balance?: number;
  description?: string;
  className?: string;
  subtype?: string;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
  name,
  balance,
  description,
  subtype,
  className,
}) => {
  const formattedSubtype = subtype ? accountSubtypeLabels[subtype as keyof typeof accountSubtypeLabels] || subtype : undefined;
  
  return (
    <Link 
      href="/not-found"
      className={`w-full flex items-center justify-between p-4 cursor-pointer hover:bg-lavenderDawn-highlightLow dark:hover:bg-lavenderMoon-highlightMed transition-all duration-200 rounded-lg hover:translate-x-1 ${className || ''}`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-start">
          <span
            className={`text-base font-medium tracking-tight text-lavenderDawn-text dark:text-lavenderMoon-text`}
          >
            {name}
          </span>
          {(description || formattedSubtype) && (
            <span
              className={`text-sm font-medium tracking-tight text-lavenderDawn-text/50 dark:text-lavenderMoon-text/50 mt-0.5`}
            >
              {formattedSubtype || description}
            </span>
          )}
        </div>
      </div>
      {balance !== undefined && (
        <div className="flex items-center space-x-2">
          <AccountBalance balance={balance} bold={false} />
        </div>
      )}
    </Link>
  );
};
