import type React from "react";
import AccountBalance from "../account-balance/account-balance";

export interface AccountInfoProps {
  name: string;
  balance: number;
  description?: string;
  className?: string;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
  name,
  balance,
  description,
}) => {
  return (
    <button className={`w-full flex items-center justify-between p-4`}>
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-start">
          <span
            className={`font-medium text-lavenderDawn-text dark:text-lavenderMoon-text`}
          >
            {name}
          </span>
          {description && (
            <span
              className={`text-sm text-lavenderDawn-muted dark:text-lavenderMoon-iris`}
            >
              {description}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <AccountBalance balance={balance} />
      </div>
    </button>
  );
};
