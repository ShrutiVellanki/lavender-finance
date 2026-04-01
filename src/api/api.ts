import { AccountData, ChartData, Transaction, BudgetCategory, SpendingSummary, UserSettings, CardEntry } from "../types";
import { accountData, chartData, transactionData, budgetsByMonth, spendingSummary, userSettings } from "./test-data";

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateResponse<T>(data: unknown, checks: (d: T) => boolean, label: string): T {
  if (data === null || data === undefined) {
    throw new ValidationError(`${label}: received null/undefined`);
  }
  if (!checks(data as T)) {
    throw new ValidationError(`${label}: shape validation failed`);
  }
  return data as T;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  await delay(500);
  return validateResponse<AccountData>(
    accountData,
    (d) => typeof d === "object" && Object.values(d).every(a => "id" in a && "current_balance" in a && "name" in a),
    "AccountData",
  );
};

export const fetchChartData = async (): Promise<ChartData> => {
  await delay(500);
  return validateResponse<ChartData>(
    chartData,
    (d) => typeof d === "object" && Object.values(d).every(arr => Array.isArray(arr)),
    "ChartData",
  );
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  await delay(300);
  return validateResponse<Transaction[]>(
    transactionData,
    (d) => Array.isArray(d) && d.every(t => "id" in t && "amount" in t && "accountId" in t),
    "Transactions",
  );
};

export const fetchBudgets = async (month?: number): Promise<BudgetCategory[]> => {
  await delay(200);
  const m = month ?? new Date().getMonth();
  const data = budgetsByMonth[m] ?? budgetsByMonth[new Date().getMonth()];
  return validateResponse<BudgetCategory[]>(
    data,
    (d) => Array.isArray(d) && d.every(b => "category" in b && "limit" in b && "spent" in b),
    "BudgetCategories",
  );
};

export const fetchSpendingSummary = async (): Promise<SpendingSummary[]> => {
  await delay(200);
  return validateResponse<SpendingSummary[]>(
    spendingSummary,
    (d) => Array.isArray(d) && d.every(s => "category" in s && "amount" in s),
    "SpendingSummary",
  );
};

let _settings: UserSettings = { ...userSettings };

export const fetchSettings = async (): Promise<UserSettings> => {
  await delay(200);
  return validateResponse<UserSettings>(
    { ..._settings },
    (d) => typeof d === "object" && "name" in d && "email" in d && "phone" in d,
    "UserSettings",
  );
};

export const updateSettings = async (updates: Partial<UserSettings>): Promise<UserSettings> => {
  await delay(400);
  _settings = { ..._settings, ...updates };
  return { ..._settings };
};

export const submitCard = async (card: Omit<CardEntry, "id" | "syncing">): Promise<CardEntry> => {
  await delay(1500);
  if (Math.random() < 0.1) {
    throw new Error("Card verification failed. Please try again.");
  }
  return { ...card, id: `card-${Date.now()}` };
};
