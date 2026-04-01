import { AccountData, ChartData, Transaction, BudgetCategory, SpendingSummary, UserSettings, CardEntry } from "../types";
import { accountData as defaultAccountData, chartData as defaultChartData, transactionData as defaultTransactionData, budgetsByMonth as defaultBudgetsByMonth, spendingSummary as defaultSpendingSummary, userSettings } from "./test-data";

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

// ──── Data override layer ────

interface DataOverrides {
  accounts?: AccountData;
  chart?: ChartData;
  transactions?: Transaction[];
  budgets?: Record<string, BudgetCategory[]>;
  spending?: SpendingSummary[];
}

let _overrides: DataOverrides = {};

export function setDataOverrides(overrides: DataOverrides) {
  _overrides = overrides;
}

export function clearDataOverrides() {
  _overrides = {};
}

export function hasDataOverrides(): boolean {
  return Object.keys(_overrides).length > 0;
}

export interface DataOverrideSchema {
  accounts?: Record<string, { id: string; current_balance: number; name: string; subtype: string; type: string }>;
  chart?: Record<string, { balance: number; date: string }[]>;
  transactions?: { id: string; accountId: string; description: string; amount: number; date: string; category: string; status: string; merchant: string }[];
  budgets?: Record<string, { category: string; limit: number; spent: number }[]>;
  spending?: { category: string; amount: number }[];
}

export function validateDataOverride(data: unknown): { valid: boolean; errors: string[]; counts: Record<string, number> } {
  const errors: string[] = [];
  const counts: Record<string, number> = {};

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return { valid: false, errors: ["Root must be a JSON object"], counts };
  }

  const obj = data as Record<string, unknown>;
  const allowedKeys = ["accounts", "chart", "transactions", "budgets", "spending"];
  const extraKeys = Object.keys(obj).filter(k => !allowedKeys.includes(k));
  if (extraKeys.length) errors.push(`Unknown keys: ${extraKeys.join(", ")}`);

  if (Object.keys(obj).filter(k => allowedKeys.includes(k)).length === 0) {
    errors.push("Must contain at least one of: accounts, chart, transactions, budgets, spending");
  }

  if (obj.accounts !== undefined) {
    if (typeof obj.accounts !== "object" || obj.accounts === null || Array.isArray(obj.accounts)) {
      errors.push("accounts: must be an object keyed by account ID");
    } else {
      const accts = obj.accounts as Record<string, unknown>;
      let valid = 0;
      for (const [id, a] of Object.entries(accts)) {
        if (typeof a !== "object" || a === null) { errors.push(`accounts.${id}: must be an object`); continue; }
        const acc = a as Record<string, unknown>;
        if (typeof acc.id !== "string") errors.push(`accounts.${id}: missing or invalid "id"`);
        if (typeof acc.current_balance !== "number") errors.push(`accounts.${id}: missing or invalid "current_balance"`);
        if (typeof acc.name !== "string") errors.push(`accounts.${id}: missing or invalid "name"`);
        if (typeof acc.type !== "string") errors.push(`accounts.${id}: missing or invalid "type"`);
        if (typeof acc.subtype !== "string") errors.push(`accounts.${id}: missing or invalid "subtype"`);
        else valid++;
      }
      counts.accounts = valid;
    }
  }

  if (obj.transactions !== undefined) {
    if (!Array.isArray(obj.transactions)) {
      errors.push("transactions: must be an array");
    } else {
      let valid = 0;
      obj.transactions.forEach((t: unknown, i: number) => {
        if (typeof t !== "object" || t === null) { errors.push(`transactions[${i}]: must be an object`); return; }
        const tx = t as Record<string, unknown>;
        if (typeof tx.id !== "string") errors.push(`transactions[${i}]: missing "id"`);
        if (typeof tx.accountId !== "string") errors.push(`transactions[${i}]: missing "accountId"`);
        if (typeof tx.amount !== "number") errors.push(`transactions[${i}]: missing or invalid "amount"`);
        if (typeof tx.date !== "string") errors.push(`transactions[${i}]: missing "date"`);
        if (typeof tx.category !== "string") errors.push(`transactions[${i}]: missing "category"`);
        if (typeof tx.status !== "string") errors.push(`transactions[${i}]: missing "status"`);
        if (typeof tx.merchant !== "string") errors.push(`transactions[${i}]: missing "merchant"`);
        if (typeof tx.description !== "string") errors.push(`transactions[${i}]: missing "description"`);
        else valid++;
      });
      counts.transactions = valid;
    }
  }

  if (obj.chart !== undefined) {
    if (typeof obj.chart !== "object" || obj.chart === null || Array.isArray(obj.chart)) {
      errors.push("chart: must be an object keyed by account ID");
    } else {
      const c = obj.chart as Record<string, unknown>;
      let series = 0;
      for (const [id, arr] of Object.entries(c)) {
        if (!Array.isArray(arr)) { errors.push(`chart.${id}: must be an array`); continue; }
        for (const pt of arr) {
          if (typeof pt !== "object" || pt === null) continue;
          const p = pt as Record<string, unknown>;
          if (typeof p.balance !== "number" || typeof p.date !== "string") {
            errors.push(`chart.${id}: points must have "balance" (number) and "date" (string)`);
            break;
          }
        }
        series++;
      }
      counts.chart = series;
    }
  }

  if (obj.budgets !== undefined) {
    if (typeof obj.budgets !== "object" || obj.budgets === null || Array.isArray(obj.budgets)) {
      errors.push('budgets: must be an object keyed by "YYYY-M"');
    } else {
      counts.budgets = Object.keys(obj.budgets as object).length;
    }
  }

  if (obj.spending !== undefined) {
    if (!Array.isArray(obj.spending)) {
      errors.push("spending: must be an array");
    } else {
      counts.spending = (obj.spending as unknown[]).length;
    }
  }

  return { valid: errors.length === 0, errors, counts };
}

// ──── API functions ────

export const fetchAccountData = async (): Promise<AccountData> => {
  await delay(500);
  const source = _overrides.accounts ?? defaultAccountData;
  return validateResponse<AccountData>(
    source,
    (d) => typeof d === "object" && Object.values(d).every(a => "id" in a && "current_balance" in a && "name" in a),
    "AccountData",
  );
};

export const fetchChartData = async (): Promise<ChartData> => {
  await delay(500);
  const source = _overrides.chart ?? defaultChartData;
  return validateResponse<ChartData>(
    source,
    (d) => typeof d === "object" && Object.values(d).every(arr => Array.isArray(arr)),
    "ChartData",
  );
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  await delay(300);
  const source = _overrides.transactions ?? defaultTransactionData;
  return validateResponse<Transaction[]>(
    source,
    (d) => Array.isArray(d) && d.every(t => "id" in t && "amount" in t && "accountId" in t),
    "Transactions",
  );
};

export const fetchBudgets = async (month?: number, year?: number): Promise<BudgetCategory[]> => {
  await delay(200);
  const m = month ?? new Date().getMonth();
  const y = year ?? new Date().getFullYear();
  const key = `${y}-${m}`;
  const budgetSource = _overrides.budgets ?? defaultBudgetsByMonth;
  const fallbackKey = `${new Date().getFullYear()}-${new Date().getMonth()}`;
  const data = budgetSource[key] ?? budgetSource[fallbackKey] ?? [];
  return validateResponse<BudgetCategory[]>(
    data,
    (d) => Array.isArray(d) && d.every(b => "category" in b && "limit" in b && "spent" in b),
    "BudgetCategories",
  );
};

export const fetchSpendingSummary = async (): Promise<SpendingSummary[]> => {
  await delay(200);
  const source = _overrides.spending ?? defaultSpendingSummary;
  return validateResponse<SpendingSummary[]>(
    source,
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
