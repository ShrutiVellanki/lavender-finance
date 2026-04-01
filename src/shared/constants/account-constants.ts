import { AccountType, AccountSubtype } from "@/types";

export const accountTypeLabels: Record<AccountType, string> = {
  [AccountType.DEPOSITORY]: "Bank Accounts",
  [AccountType.CREDIT]: "Credit Cards",
  [AccountType.INVESTMENT]: "Investments",
  [AccountType.BROKERAGE]: "Investment Accounts",
  [AccountType.LOAN]: "Loans",
  [AccountType.REAL_ESTATE]: "Real Estate",
  [AccountType.VEHICLE]: "Vehicles",
  [AccountType.OTHER]: "Other Accounts"
};

export const accountSubtypeLabels: Record<AccountSubtype, string> = {
  [AccountSubtype.CHECKING]: "Checking",
  [AccountSubtype.SAVINGS]: "Savings",
  [AccountSubtype.CREDIT_CARD]: "Credit Card",
  [AccountSubtype.ST_401K]: "401(k)",
  [AccountSubtype.IRA]: "IRA",
  [AccountSubtype.BROKERAGE]: "Brokerage",
  [AccountSubtype.MORTGAGE]: "Mortgage",
  [AccountSubtype.CAR]: "Car",
  [AccountSubtype.PRIMARY_HOME]: "Primary Home",
  [AccountSubtype.OTHER]: "Other"
}; 