import { AccountData, ChartData, Transaction, BudgetCategory, SpendingSummary } from "../types";
import { accountData, chartData, transactionData, budgetData, spendingSummary } from "./test-data";

export const fetchWrapper = async (
  url: string | URL | Request,
  options?: RequestInit | undefined,
) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchAccountData = async (): Promise<AccountData> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return accountData;
};

export const fetchChartData = async (): Promise<ChartData> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return chartData;
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return transactionData;
};

export const fetchBudgets = async (): Promise<BudgetCategory[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return budgetData;
};

export const fetchSpendingSummary = async (): Promise<SpendingSummary[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return spendingSummary;
};
