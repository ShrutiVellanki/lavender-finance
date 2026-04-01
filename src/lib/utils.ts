import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Account, AccountData, ChartData, NetWorthData } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number): string => {
  const isNegative = amount < 0;
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return isNegative ? `-${formattedAmount}` : formattedAmount;
};

export const accountTypes = {
  credit: "Credit",
  depository: "Bank",
  investment: "Investment",
  loan: "Loan",
  mortgage: "Mortgage",
  vehicle: "Vehicle",
  real_estate: "Real Estate",
  brokerage: "Brokerage",
  other: "Other",
} as Record<string, string>;

export const groupAccountsByType = (accounts: AccountData): { [key: string]: Account[] } => {
  return Object.values(accounts).reduce((acc: { [key: string]: Account[] }, account) => {
    const type = account.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(account);
    return acc;
  }, {});
};

export const aggregateBalancesByDate = (chartData: ChartData): NetWorthData[] => {
  const dates = new Set<string>();
  Object.values(chartData).forEach(accountData => {
    accountData.forEach(point => dates.add(point.date));
  });

  return Array.from(dates).map(date => {
    const totalBalance = Object.values(chartData).reduce((sum, accountData) => {
      const point = accountData.find(p => p.date === date);
      return sum + (point?.balance || 0);
    }, 0);

    return { date, balance: totalBalance };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};