export enum AccountType {
  DEPOSITORY = "depository",
  CREDIT = "credit",
  INVESTMENT = "investment",
  BROKERAGE = "brokerage",
  LOAN = "loan",
  REAL_ESTATE = "real_estate",
  VEHICLE = "vehicle",
  OTHER = "other"
}

export enum AccountSubtype {
  CHECKING = "checking",
  SAVINGS = "savings",
  CREDIT_CARD = "credit_card",
  ST_401K = "st_401k",
  IRA = "ira",
  BROKERAGE = "brokerage",
  MORTGAGE = "mortgage",
  CAR = "car",
  PRIMARY_HOME = "primary_home",
  OTHER = "other"
}

export interface Account {
  current_balance: number;
  name: string;
  subtype: string;
  type: string;
  id: string;
}

export interface AccountData {
  [key: string]: Account;
}

export interface ChartDataPoint {
  balance: number;
  date: string;
}

export interface ChartData {
  [key: string]: ChartDataPoint[];
}

export interface NetWorthData {
  date: string;
  balance: number;
}

export interface AccountFilters {
  types: string[];
  subtypes: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

export interface ChartOptions {
  timeScale: "1M" | "3M" | "6M" | "1Y" | "ALL";
  showIndividualAccounts: boolean;
}

export type TransactionCategory =
  | "Groceries"
  | "Dining"
  | "Transport"
  | "Shopping"
  | "Utilities"
  | "Income"
  | "Transfer"
  | "Entertainment"

export type TransactionStatus = "completed" | "pending" | "failed"

export interface Transaction {
  id: string
  accountId: string
  description: string
  amount: number
  date: string
  category: TransactionCategory
  status: TransactionStatus
  merchant: string
}

export interface BudgetCategory {
  category: TransactionCategory
  limit: number
  spent: number
}

export interface SpendingSummary {
  category: TransactionCategory
  amount: number
}

export interface UserSettings {
  name: string
  email: string
  phone: string
  avatar?: string
}

export interface CardEntry {
  id: string
  last4: string
  network: "visa" | "mastercard" | "amex" | "discover" | "unknown"
  name: string
  expiry: string
  accountId?: string
  syncing?: boolean
}