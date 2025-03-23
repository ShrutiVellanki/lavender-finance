export enum AccountType {
  DEPOSITORY = "depository",
  CREDIT = "credit",
  INVESTMENT = "investment",
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
  subtype: AccountSubtype;
  type: AccountType;
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
  types: AccountType[];
  subtypes: AccountSubtype[];
  dateRange: {
    start: string;
    end: string;
  };
}

export interface ChartOptions {
  timeScale: "1M" | "3M" | "6M" | "1Y" | "ALL";
  showIndividualAccounts: boolean;
} 